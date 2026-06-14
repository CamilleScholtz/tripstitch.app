---
title: "Tripstitch 2.0: Replacing Apple Maps with Mapbox and Overture"
date: 2026-06-14
description: "Tripstitch 2.0 rebuilds the map layer on Mapbox for rendering and a self-hosted Overture Maps mirror for place data. Why switching the renderer forced switching the catalog, why Overture won (free, open-licensed, more POIs than Apple, Google, or Mapbox), plus server-side coordinate resolution, 3D terrain, a globe, and the dependency conflicts along the way."
category: development
---

Tripstitch 2.0 is on the App Store. The version number jumped a whole point because of one change that touched almost every screen: the map is completely new. Apple Maps is gone, Google Places is gone, and the map layer is rebuilt on two things instead: Mapbox for rendering, and a self-hosted mirror of the Overture Maps dataset for place data.

That deserves an explanation, because in [the first post about building this app](/blog/building-ai-travel-app-that-doesnt-hallucinate/) I made a point of it. Every place in a Tripstitch itinerary came from Apple Maps. The model didn't invent restaurants, it picked from real search results. I called that the thing that keeps an AI travel app from hallucinating. So why tear it out?

If you want the features that shipped between launch and 2.0 (budget tracking, accommodations, the widget, timezone-correct dates), [the previous post covers those](/blog/two-months-after-launching-tripstitch/). This one is about the map.

## Why leave Apple Maps

It started with rendering. I wanted the trip map to feel like a place, not a flat tile sheet with pins. 3D terrain, real landmarks, and a globe that flies you to your destination while the itinerary builds. MapKit can do some 3D, but the control is limited: flyover works in a handful of cities, there's no globe projection, and you can't restyle much. For the visual I had in mind, it wasn't close. Mapbox was.

At the time I had two map providers, not one. Apple Maps Server API powered the AI's place search during generation, and the `/v1/places` proxy behind the in-app detail cards and photos ran on Google Places. Two providers, two category taxonomies, two sets of keys, two bills. So the plan started simple: switch rendering to Mapbox and collapse everything else onto it too. That plan was half right.

## Mapbox for the map

The rendering half worked exactly as hoped, and it stuck. `MapView`, `MapCardView`, and the loading background are rebuilt on the Mapbox Maps SDK. The trip map gets DEM-based 3D terrain and real landmarks. Pins are a clustered `PointAnnotationGroup` with rendered marker images, and the route between each day's stops draws as `PolylineAnnotation` overlays. The hand-written `ClusterManager` I'd been maintaining is deleted, because clustering is native and runs on the GPU now. Less code, faster map.

The loading experience changed too. Generation still takes up to a minute for a full day, and a spinner for a minute is a long time to stare at. So while your trip builds, a globe flies to your destination. It's a real rendered globe (`GlobeView` with a texture renderer, built on RealityKit), not a looping video, so it actually points at where you're going. I moved the globe and map views onto this year's iOS 27 SwiftUI APIs while I was rewriting them anyway.

For drawing maps, Mapbox is excellent. The problem was the other half of the plan.

## The licensing catch

Switching the renderer to Mapbox had a consequence I hadn't thought all the way through. Apple and Google only let you use their place data on their own maps. The Apple Maps POIs were licensed to display on an Apple map, the Google Places results on a Google map. The moment my map stopped being either of theirs, I lost the right to put their places on it. Changing how the map looked quietly changed what data I was allowed to show on it.

So the catalog had to move regardless of what I wanted. The only question was where.

The obvious answer was Mapbox's own place data, since I was already there: Search Box for search, the Details API for the cards. That's licensed to render on a Mapbox map, so no legal snag. I built it, and it worked. Two things pushed me off it. Coverage was thinner than I needed, with real restaurants and smaller POIs simply missing in the places people travel to. And for an app that searches on every generation and every map pan, the per-request pricing climbed fast.

[Overture Maps](https://overturemaps.org) fixed both. It's an open map dataset from the Overture Maps Foundation, the joint effort backed by Meta, Microsoft, Amazon, and TomTom, among others. The Places theme runs to tens of millions of points of interest, more than any of the closed providers ever handed me, each with names, categories, coordinates, websites, phone numbers, and socials. And it's open data: free to use, and licensed to use anywhere, including on a Mapbox map. I load it into my own database and serve it from a `/v1/places` proxy on my backend. No per-request bill for my single most important dataset, and no terms tying it to one company's renderer.

Overture doesn't have everything. It carries no ratings, no photos, no opening hours, because those are social signals rather than map data. So the detail cards layer Google back on for that and nothing else: Overture supplies the base place (name, website, phone, socials), Google supplies the rating, photos, and hours inside the card. That sounds like I re-added a provider I'd just removed, and I did, but for a sliver of the job. Google is no longer my catalog. It's a garnish on a catalog I own.

The end state is three sources, each doing one job. Mapbox draws the map. Overture is the place catalog. Google fills in ratings and photos. That's more moving parts than "just put everything on Mapbox," but the part that matters most, the catalog, is open data nobody can price me out of or pull back behind a different map.

## The grounding philosophy didn't change

Here's the part that matters for the "doesn't hallucinate" thesis: the approach never changed across any of this. The model still doesn't guess place names. It calls a search tool, gets back real places with coordinates, and picks from those. What changed three times underneath it was only which catalog answers the search. Apple Maps, then Mapbox, now Overture.

Apple Maps was an implementation. The grounding was the idea, and the idea survives a vendor swap fine. Both jobs, the places Mia picks during generation and the places you search by hand to drop a custom pin, read from the same backend catalog now. One source of truth for what places exist, shared by the AI and the user.

It got a little better on the way, too. Search runs in the destination's own language and script, so looking for ramen in Tokyo searches ラーメン, which surfaces local results a romanized query would miss. That's exactly the kind of place you want a travel app to find.

## Resolving coordinates server-side

At launch the iOS client did a second pass to turn the model's place picks into map pins. It ran `MKLocalSearch` on device, matched the result, and built the pin. That worked, but it meant the client re-resolved every place every time it drew the map, and it was the last thing tying the app to MapKit.

2.0 moves resolution to where the data is born. Places come out of the backend catalog already resolved, with coordinates attached, so one search call returns ready-to-pin results. There's a proximity sanity guard during generation: if a resolved place lands too far from the region it belongs to, it's rejected rather than dropping a pin for the wrong city's restaurant of the same name.

The client got dumber as a result, which is the right direction. It builds pins straight from backend coordinates and renders them. No on-device geocoding, no resolve step. Zero `import MapKit` remains in the app. This is the same lesson as the stateless backend rewrite from last time: resolve once, at the source, and stop making every client redo the work.

## The Mapbox Search SDK detour

Worth being honest about a wrong turn, because it's the one that pointed me at Overture. When I first migrated, I adopted Mapbox's Search SDK for the in-app search box, using its suggest and retrieve flow. A day later I ripped it back out.

The reason: I already had a places proxy on my own backend, the same one the detail cards use. Pulling in the Search SDK meant a second code path and a second category taxonomy living on the client, plus a dependency to keep current. Pointing the in-app search at my own `/v1/places` proxy instead gave me one source of truth and one fewer SDK in the build. The custom `SearchManager` that replaced it is more code than calling the SDK would have been, but it's code I control.

That decision is what made the Overture move painless. Once every place lookup went through my own proxy, swapping what sat behind the proxy was a backend change the app never saw. The client still calls `/v1/places/search`. It has no idea the catalog underneath went from Mapbox to Overture.

## Dependency hell: routing

One concrete gotcha for anyone doing this migration. The obvious way to draw routes is `mapbox-directions-swift`, Mapbox's official Swift wrapper for the Directions API. It's incompatible with the Maps SDK v11 because they pin conflicting versions of `turf-swift`, the geometry library underneath both. You can't have both in the same build.

So the route service skips the wrapper and calls the Mapbox Directions REST API directly. It's a handful of extra lines to build the request and decode the response, and it sidesteps the version conflict entirely. This is the same flavor of problem as the Apple Maps JWT auth from the first post: not hard, just undocumented, and it costs you an afternoon to find out the official path is a dead end.

## Three itineraries, not one

While the map was torn open I changed how generation starts. Outline generation now returns three candidate itineraries instead of one. You preview each one on the map, see how each day's region is laid out, and pick the one you like before any per-day generation runs. The old flow generated a single outline and locked you into whatever the first pass produced, which was a bad deal when the first pass put the beach day before the city day.

The onboarding flow was reordered to support this: the questions now go When, then Style, then Where, so style-sensitive copy can adapt before you answer (a road trip asks "where will the road take you," and road trips skip flight times in the estimate). Outline generation runs inside the onboarding sheet now, with a progress bar and then the variant picker, so you commit to a variant before you ever land on a trip screen. You never see an empty itinerary waiting to fill in.

## Telling Mia where you're from

The other generation change is small in code and surprisingly large in output quality. The traveler profile now has a home location: a country and an optional city. It goes into the generation prompt so the AI can contrast your home cuisine, climate, and norms against the destination, and decide whether a road trip should loop back to where it started. A Dutch traveler and a Brazilian traveler planning the same week in Rome get different framing, because "different from home" depends on the home.

This rode in on a schema migration (camping also moved from being a trip style to being an accommodation type, which needed a launch-time backfill to split affected trips). The part worth stealing: I wrapped the SwiftData container init in a launch guard. If a migration throws a Core Data exception, the app shows a recovery screen instead of fatal-erroring on every single launch. A bad migration that crash-loops is unrecoverable for the user. A bad migration that shows a screen is a support email. Always leave the escape hatch.

## What I learned

A few takeaways from the 2.0 rewrite:

**The renderer decides the data.** I thought picking a map SDK was a rendering decision. It wasn't. Apple and Google only license their places for their own maps, so moving to a Mapbox map disqualified both catalogs in a single step. The visual choice was a data choice wearing a disguise.

**Open data won on the merits, not just on principle.** Overture wasn't the idealistic pick I settled for. It had more POIs than Mapbox, Apple, or Google gave me, it's free, and I can use it on whatever map I like. The dataset I'd have chosen for independence turned out to also be the best data.

**Grounding is a philosophy, not a vendor.** I worried that leaving Apple Maps would undermine the whole "real places only" pitch. It didn't, because the pitch was never about Apple. The model picks from real search results. Which catalog serves them is an implementation detail I swapped three times.

**The official wrapper is not always the path.** `mapbox-directions-swift` would have been the natural choice and it doesn't build. Reading the REST docs and calling the API directly was faster than fighting the dependency graph.

The app is [on the App Store](https://apps.apple.com/app/tripstitch-ai-trip-planner/id6757090571) and I still read every email. Shared trips are still the next big thing on the roadmap, and the CloudKit story for it is still ugly. That's the next post, whenever I stop being scared of it.
