---
title: "Privacy Policy"
description: "Tripstitch Privacy Policy — learn how the app handles your data, what we collect, and your choices regarding your information."
---

**Last Updated: June 11, 2026**

Tripstitch ("we", "our", or "the app") is an AI-powered travel itinerary app for iOS. This Privacy Policy explains what data we collect, how we use it, and your choices regarding your information.

## 1. Data We Collect

### Device Information

Tripstitch does not require an account with an email or password. We identify your device using a cryptographic device identifier that is stored as a hashed value and cannot be used to personally identify you.

We also collect your **push notification token** if you enable notifications, solely to notify you when your itinerary is ready.

### Trip & Travel Data

When you use Tripstitch, you provide information to plan your trips, such as destinations, dates, traveler preferences, saved locations, and accommodations. AI-generated itineraries with day-by-day plans are also stored.

### Chat Messages

Conversations with our AI assistant ("Mia") are stored on your device and synced via iCloud. When you send a message, your chat history and trip context are sent to our server to generate a response.

### Location Data

If you grant location permission, we use your approximate location to show your position on the map, suggest nearby places, find airports, improve map search results, and provide context to the AI assistant. To do this, your approximate location and search queries may be sent directly to our maps provider, Mapbox (see Third-Party Services). We request location at hundred-meter accuracy. You can revoke this at any time in iOS Settings.

### Subscription Data

In-app purchases are handled entirely by Apple. We validate your subscription status to determine your plan and enforce usage limits. We do not process or store payment information.

## 2. How We Use Your Data

- **Generate itineraries**: Your trip details and traveler preferences are sent to our AI service to create personalized travel plans.
- **Power the AI assistant**: Chat messages, trip context, and (optionally) your location are sent to our AI service to answer questions and suggest changes.
- **Provide place details**: Place names and coordinates are sent to a place data provider to retrieve ratings, reviews, hours, and photos.
- **Show maps and search**: Your approximate location, the map area you're viewing, and your search queries are sent to our maps provider to render maps and find nearby places.
- **Send notifications**: Your device token is used to notify you when background tasks complete.
- **Sync your data**: All trip data syncs across your devices via iCloud.

## 3. Third-Party Services

We use the following third-party services. Data is sent through our backend server (acting as a proxy), except where noted.

| Service | Data Shared | Purpose | Sent |
|---------|-------------|---------|------|
| **Anthropic (Claude AI)** | Trip details, traveler profiles, itineraries, chat messages, location (if granted) | AI itinerary generation and chat assistant | Our server (proxy) |
| **Google Places** | Place names, coordinates | Ratings, reviews, photos, and hours | Our server (proxy) |
| **Apple Maps Server API** | Coordinates, search categories | Place search and travel-time estimates during itinerary generation | Our server (proxy) |
| **Mapbox** | Approximate location, map interactions, search queries | Map display, place search, and geocoding | Directly from the app |
| **ExchangeRate-API** | Home currency code | Currency exchange rate lookup | Directly from the app |

We also use standard Apple platform services (iCloud, MapKit, WeatherKit, Notifications, StoreKit, App Attest) as part of normal iOS functionality. Traveler avatars are generated on your device and are not sent anywhere.

### AI Data Processing

When you generate an itinerary or chat with Mia, your trip data — including traveler names, preferences, saved locations, and itinerary details — is sent to Anthropic's Claude API. Anthropic's data practices are governed by their [usage policy](https://www.anthropic.com/legal/aup). We store AI requests and responses on our server to support the generation process.

### Maps & Location Providers

Maps, the spinning globe, and place search are powered by Mapbox. When you view a map or search for a place, your approximate location, the map area you're viewing, and your search queries are sent directly from the app to Mapbox. Mapbox may also collect anonymized usage telemetry to operate and improve its mapping services, governed by [Mapbox's privacy policy](https://www.mapbox.com/legal/privacy). We do not use this telemetry ourselves.

The app also uses Apple's MapKit on your device for search suggestions and directions, and fetches currency rates directly from ExchangeRate-API using only your home currency code.

## 4. Data Storage & Retention

### On Your Device

Trip data, traveler profiles, itineraries, chat messages, and recent searches are stored on your device and synced to your iCloud account. This data persists until you delete it within the app or delete the app.

### On Our Server

- **Device registration**: Hashed device identifier and push notification token
- **Generation records**: AI generation requests and responses — retained while your account is active
- **Chat records**: Chat messages and AI responses — retained while your account is active
- **API logs**: Request metadata — retained for 14 days

### On iCloud

All app data syncs to your iCloud account, encrypted and accessible only to you. We do not have access to your iCloud data.

## 5. Data We Do NOT Collect

- Email addresses, phone numbers, or passwords
- Analytics, advertising identifiers, or tracking data

We do not use any third-party analytics, crash reporting, or advertising SDKs. Our maps provider, Mapbox, may collect anonymized telemetry to operate its mapping services (see Maps & Location Providers above); this is not used by us for analytics or advertising.

## 6. Data Security

- Device identifiers are hashed before storage
- All data in iCloud is encrypted by Apple
- All server communication uses HTTPS
- API keys for third-party services are stored on our server and never exposed to the client

## 7. Your Choices & Rights

- **Location**: Enable or disable location access in iOS Settings.
- **Notifications**: Enable or disable push notifications in iOS Settings.
- **Delete trip data**: Delete individual trips, travelers, and itineraries within the app. Deletions sync across your devices.
- **Delete all data**: Deleting the app removes all local data. iCloud data can be removed via Settings > Apple Account > iCloud > Manage Storage.

### Data Deletion Requests

To request deletion of your data stored on our servers, please contact us at the email below. We will process your request within 30 days.

## 8. Children's Privacy

Tripstitch is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with data, please contact us and we will delete it.

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or by updating the "Last Updated" date above.

## 10. Contact Us

If you have questions or wish to exercise your data rights, contact us at:

**Email**: privacy@tripstitch.app

---

*This policy applies to the Tripstitch iOS app and its associated backend services.*
