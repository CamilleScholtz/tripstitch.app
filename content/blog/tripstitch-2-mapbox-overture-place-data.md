---
title: "Tripstitch 2.0: Replacing Apple Maps with Mapbox and Overture"
date: 2026-06-14
description: "Tripstitch 2.0 rebuilds the entire map layer. Apple Maps and Google Places are gone, replaced by Mapbox for rendering and a self-hosted Overture Maps mirror for place data. Why I left MapKit, how the AI place grounding survived the switch, server-side coordinate resolution, 3D terrain, a spinning globe, and the dependency conflicts along the way."
category: development
---

Tripstitch 2.0 is on the App Store. The version number jumped a whole point because of one change that touched almost every screen: the map is completely new. Apple Maps is gone, Google Places is gone, and the map layer is rebuilt on two things instead: Mapbox for rendering, and a self-hosted mirror of the Overture Maps dataset for place data.

That deserves an explanation, because in [the first post about building this app](/blog/building-ai-travel-app-that-doesnt-hallucinate/) I made a point of it. Every place in a Tripstitch itinerary came from Apple Maps. The model didn't invent restaurants, it picked from real search results. I called that the thing that keeps an AI travel app from hallucinating. So why tear it out?

If you want the features that shipped between launch and 2.0 (budget tracking, accommodations, the widget, timezone-correct dates), [the previous post covers those](/blog/two-months-after-launching-tripstitch/). This one is about the map.

## Why leave Apple Maps (and Google Places)

Two reasons, and they're separate problems that I had lumped together under the word "maps."

The first is rendering. I wanted the trip map to feel like a place, not a flat tile sheet with pins. 3D terrain, real landmarks, and a globe that flies you to your destination while the itinerary builds. MapKit can do some 3D, but the control is limited: flyover works in a handful of cities, there's no globe projection, and you can't restyle much. For the visual I had in mind, it wasn't close.

The second reason is the one I didn't write about last time. I had two map providers, not one. Apple Maps Server API powered the AI's place search during generation. But the `/v1/places` proxy that backs the in-app detail cards and photos ran on Google Places. Two providers means two category taxonomies, two sets of keys, two billing relationships, and two different ways for a request to fail.

So the plan started simple: collapse everything onto one vendor, Mapbox. Rendering, place search, place details, all of it. That plan was half right.

## Mapbox for the map

The rendering half worked exactly as hoped, and it stuck. `MapView`, `MapCardView`, and the loading background are rebuilt on the Mapbox Maps SDK. The trip map gets DEM-based 3D terrain and real landmarks. Pins are a clustered `PointAnnotationGroup` with rendered marker images, and the route between each day's stops draws as `PolylineAnnotation` overlays. The hand-written `ClusterManager` I'd been maintaining is deleted, because clustering is native and runs on the GPU now. Less code, faster map.

The loading experience changed too. Generation still takes up to a minute for a full day, and a spinner for a minute is a long time to stare at. So while your trip builds, a globe flies to your destination. It's a real rendered globe (`GlobeView` with a texture renderer, built on RealityKit), not a looping video, so it actually points at where you're going. I moved the globe and map views onto this year's iOS 27 SwiftUI APIs while I was rewriting them anyway.

For drawing maps, Mapbox is excellent. The problem was the other half of the plan.

## The place catalog problem

Once rendering was on Mapbox, the obvious next step was to put place data there too: Mapbox's Search Box API for search, Mapbox's Details API for the rich cards. I did exactly that, and it worked. And then I undid most of it, because I'd walked straight back into the thing I was trying to escape.

The whole no-hallucination approach depends on a catalog of real places to pick from. That catalog is the most important data in the app. Putting it behind a single closed API, billed per request, owned by one vendor, is the same lock-in I had with Apple Maps and Google Places. I'd just renamed the vendor. If Mapbox changes pricing or coverage, my core feature changes with it, and I have no recourse.

So the place catalog moved one more time, to data I can host myself: [Overture Maps](https://overturemaps.org). Overture is an open map dataset from the Overture Maps Foundation, the joint effort backed by Meta, Microsoft, Amazon, and TomTom, among others. Its Places theme is tens of millions of points of interest with names, categories, coordinates, websites, phone numbers, and socials, published as open data. I load it into my own database and serve it from a `/v1/places` proxy on my backend. No per-request bill for my own core data, no single vendor who can pull it out from under me.

Overture doesn't have everything, though. It has no ratings, no photos, no opening hours, because those aren't really "map data," they're social signals. So the detail cards layer Google back on top: Overture supplies the base place (name, website, phone, socials) and Google supplies ratings, photos, and hours. That sounds like I re-added a provider I'd just removed, and I did, but for a much smaller job. Google is no longer my catalog. It's a garnish on a catalog I own.

The end state is three providers, each doing the one thing it's best at. Mapbox draws the map. Overture is the place catalog. Google fills in ratings and photos. That reads as more complexity than "just use Mapbox for everything," and on a dependency graph it is. But each piece is now replaceable on its own, and the part that matters most, the catalog, is data I control.

## The grounding philosophy didn't change

Here's the part that matters for the "doesn't hallucinate" thesis: the approach never changed across any of this. The model still doesn't guess place names. It calls a search tool, gets back real places with coordinates, and picks from those. What changed three times underneath it was only which catalog answers the search. Apple Maps, then Mapbox, now Overture.

Apple Maps was an implementation. The grounding was the idea, and the idea survives a vendor swap fine. Both jobs, the places Mia picks during generation and the places you search by hand to drop a custom pin, read from the same backend catalog now. One source of truth for "what places exist," shared by the AI and the user.

It got a little better on the way, too. Search runs in the destination's own language and script, so looking for ramen in Tokyo searches ラーメン, which surfaces local results a romanized query would miss. That's exactly the kind of place you want a travel app to find.

## Resolving coordinates server-side

At launch the iOS client did a second pass to turn the model's place picks into map pins. It ran `MKLocalSearch` on device, matched the result, and built the pin. That worked, but it meant the client re-resolved every place every time it drew the map, and it was the last thing tying the app to MapKit.

2.0 moves resolution to where the data is born. Places come out of the backend catalog already resolved, with coordinates attached, so one search call returns ready-to-pin results. There's a proximity sanity guard during generation: if a resolved place lands too far from the region it belongs to, it's rejected rather than dropping a pin for the wrong city's restaurant of the same name.

The client got dumber as a result, which is the right direction. It builds pins straight from backend coordinates and renders them. No on-device geocoding, no resolve step. Zero `import MapKit` remains in the app. This is the same lesson as the stateless backend rewrite from last time: resolve once, at the source, and stop making every client redo the work.

## The Mapbox Search SDK detour

Worth being honest about a wrong turn, because it's the one that pointed me at Overture. When I first migrated, I adopted Mapbox's Search SDK for the in-app search box, using its suggest and retrieve flow. A day later I ripped it back out.

The reason: I already had a places proxy on my own backend, the same one the detail cards use. Pulling in the Search SDK meant a second code path and a second category taxonomy living on the client, plus a dependency to keep current. Pointing the in-app search at my own `/v1/places` proxy instead gave me one source of truth and one fewer SDK in the build. The custom `SearchManager` that replaced it is more code than calling the SDK would have been, but it's code I control.

That decision is what made the Overture move obvious. Once every place lookup went through my own proxy, swapping what sat behind the proxy was a backend change the app never noticed. The client still calls `/v1/places/search`. It has no idea the catalog underneath went from Mapbox to Overture.

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

**Grounding is a philosophy, not a vendor.** I worried that leaving Apple Maps would undermine the whole "real places only" pitch. It didn't, because the pitch was never about Apple. The model picks from real search results. Which catalog serves those results is an implementation detail I swapped three times.

**One vendor for everything is the lock-in you're fleeing.** I left two closed providers and almost replaced them with one closed provider. Consolidation felt clean right up until I noticed I'd put my single most important dataset behind someone else's metered API again. Owning the catalog as open data was worth the extra moving parts.

**Render, search, and data are three different problems.** I'd been treating "maps" as one decision. Mapbox won rendering outright. The catalog wanted to be open data I host. Ratings and photos wanted a third source. Forcing all three onto one provider was a worse answer than letting each go where it fit.

**The official wrapper is not always the path.** `mapbox-directions-swift` would have been the natural choice and it doesn't build. Reading the REST docs and calling the API directly was faster than fighting the dependency graph.

The app is [on the App Store](https://apps.apple.com/app/tripstitch-ai-trip-planner/id6757090571) and I still read every email. Shared trips are still the next big thing on the roadmap, and the CloudKit story for it is still ugly. That's the next post, whenever I stop being scared of it.
