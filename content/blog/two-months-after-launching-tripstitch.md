---
title: "Two Months After Launching Tripstitch: What Shipped"
date: 2026-05-13
description: "Every feature I added to Tripstitch in the two months after launch. Budget tracking, calendar sync, accommodations, a widget, and the long tail of fixes that came with the first thousand real users."
category: development
---

Tripstitch went live on the App Store on March 14. The codebase has changed enough since then that the launch build now feels like a beta. This is a list of what shipped, why, and what I learned writing each piece. If you want the architecture overview, read [Building an AI Travel App That Doesn't Hallucinate](/blog/building-ai-travel-app-that-doesnt-hallucinate/) first. This post picks up where that one ended.

## The server became the source of truth

The launch build trusted the client too much. The subscription tier was checked locally against the StoreKit JWS, the free trial counter lived in iCloud KVS, and the API took the client's word for both. That works until someone runs the app in a debugger.

The first post-launch change was tearing that out. Every API request now sends the JWS in a header, the server verifies it against Apple's public keys, and usage is enforced server-side. The client still tracks usage for UI display, but the server is the only thing that can actually block generation. The iCloud KVS counter is gone. A new `/v1/usage` endpoint fetches counts on launch so the limits display correctly after a reinstall.

While I was in there I also fixed a bug nobody had reported but I knew was waiting: reinstalling the app reset the free trial because device attestation generates a fresh key on each install. The fix sends the previous device ID during re-attestation so the server migrates the usage record to the new key. A clean install no longer hands out new trial credits.

## A stateless backend

The launch backend had a `trips` table. Every generation request scoped to a trip ID, the server pulled the trip state from MySQL, regenerated, wrote back. Two problems: every sync bug had two sources of truth to disagree about, and the trips table got hot fast.

The rewrite flattened the API. Endpoints are `/outlines`, `/days`, `/packing`. The client sends all the context it needs in each request, including locked days, used places, and travelers. The server runs the generation and returns. No more server-side trip state, no more "the server's idea of this trip differs from the client's" support tickets.

Doing this also meant the server stopped being a single point of truth for itinerary content, which sounds bad but is actually correct. CloudKit already syncs the itinerary across devices. The server's job is to run the AI, not to hold copies of trip data.

## Budget tracking and cost estimates

Travelers wanted to know what a trip would cost before they booked flights. Mia now returns an estimated per-person cost on every activity and a daily transport estimate, in the destination currency. Costs aggregate in two places: a stacked bar chart on the trip overview showing daily totals broken down by category (food, attractions, transit, etc.), and a donut chart inside each day view.

A Budget / Mid-range / Luxury picker in onboarding gets sent to the API as part of the generation prompt. The model picks different restaurants and activities at each tier. Mid-range is the default and where most of the testing went.

A caveat on accuracy: these are model estimates derived from category and region. They are roughly right for major cities and probably off by 30 to 50 percent in places with less data. Useful for "is this trip $1500 or $5000" decisions, not for actual budgeting against booked prices.

## Tipping guidance

While I was already in the budget code, I added a tipping section to the trip view. Hardcoded rules for 50 countries covering restaurants, cafes, taxis, hotels, and tours, grouped by destination country.

Hardcoded, not AI-generated, because tipping is high-stakes and changes slowly. Getting it wrong embarrasses the user and the app. A pass through Wikipedia and government tourism board pages once a year beats querying the model every time, and the rules fit in about 400 lines of Swift.

## Calendar sync

You plan a trip in Tripstitch, then you retype the dates and activities into your work calendar so coworkers know you are out. Calendar sync writes the itinerary to a dedicated "Tripstitch" calendar via EventKit, with a per-trip toggle in settings.

Sync runs on three triggers: day generation completes, trip dates or title change, and the toggle flips. Disable or delete the trip and the events go away. The calendar stays separate from your work and personal calendars so you can hide or unsubscribe from it.

The annoying part of EventKit is calendar identity. The system can hold multiple calendars named "Tripstitch" if the user has restored from backup, deleted, and recreated the calendar at some point. The app stores the calendar identifier in UserDefaults, falls back to title matching, and creates a fresh calendar if neither resolves. Defensive but necessary.

## Accommodations with region-aware planning

The launch build assumed you slept somewhere generic in the city and routed activities accordingly. That breaks the moment you have a multi-city trip, and it produces dumb routing on single-city trips too (a restaurant 40 minutes from your hotel is not where you want to be after a 12 hour flight).

You can now attach an accommodation to each region of a trip with name, coordinates, and check-in / check-out dates. The AI uses these to plan the first and last day of each region around the hotel, picks dinner spots in the right neighborhood, and avoids cross-city transit on tired days.

The data model was the interesting part. Accommodations are per-region, not per-trip, and they round-trip through CloudKit. Same enum-as-raw-value pattern I wrote about last time, same custom-array-as-JSON-blob pattern for amenities. SwiftData with CloudKit does not get easier the second time.

## A home-screen widget

Small and medium sizes, showing the next upcoming trip with a countdown, a generation progress bar if the trip is still building, and the first few activities of the next active day. It refreshes on scene activation, trip create or delete, and day generation completion.

Widgets cannot read the main app's database directly. The widget bundle is a separate process with its own sandbox. So the app writes a JSON snapshot to a shared App Group container on every relevant change, and the widget reads from that snapshot. Cheap, predictable, and avoids the class of bugs where SwiftData migrations do not apply the way you would expect across process boundaries.

The widget also caught about 30 missing localization keys across the app. Widget text has no runtime to fall back on, so any missing string shows up in the simulator immediately when you switch languages. Tightening localization for the widget meant tightening it everywhere.

## Destination-local trip dates

A subtle bug that took a while to find. A user in Tokyo planning a Paris trip saw the trip start one day earlier than they typed. The cause: dates were stored as `Date` (a UTC timestamp under the hood) but interpreted in the user's local calendar on display.

The fix was to stop using `Date` for trip dates entirely. They now travel as `YYYY-MM-DD` strings scoped to the destination's calendar, with a `Calendar.forDestination(longitude:)` helper deriving the timezone from longitude. DatePickers in the trip form and the onboarding calendar use the same helper, so picking March 5 for a Paris trip means March 5 in Paris regardless of where the user is sitting.

Most apps dealing with travel dates get this wrong. Tripstitch got it wrong at launch. Reports come in slowly because most users do not cross enough timezones for the bug to trigger.

## Multi-region polish

The launch build handled multi-country trips as a single weather location, a single set of plug types, and a single flag on the share card. Fine for a Barcelona weekend, awkward for a Tokyo to Seoul to Kyoto trip.

Now: the share card shows up to two country flags split diagonally on the ticket stub. Apple's WeatherKit attribution renders once per region instead of three times in a row. Plug types deduplicate, so a three-country European trip does not list "Type C" three times.

Small things. The kind of polish you do not notice missing until real users plan real trips.

## What I learned

A few takeaways from two months of post-launch work:

**Real users find the bugs you cannot.** The timezone bug, the reinstall reset, the duplicate plug types, the EventKit calendar identity issue. None of these came up in testing. All of them came up within a week of users finding them.

**Server-side state is worth removing.** The stateless backend rewrite paid for itself the same week. Every sync bug became simpler to debug because there was only one source of truth.

**Localization compounds.** Adding the widget exposed 30 missing keys across the app. Adding accommodations exposed inflection bugs in date formatting. Each new surface area pulls on every string that goes through it.

**Polish is its own feature.** Two country flags on the share card is not a flagship feature. But it is the difference between a screenshot a user posts and one they delete.

If you have feedback, the app is [on the App Store](https://apps.apple.com/app/tripstitch-ai-trip-planner/id6757090571) and I read every email. The next thing on the roadmap is shared trips. The CloudKit story for that is going to be ugly. More on that when it ships.
