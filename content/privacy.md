---
title: "Privacy Policy"
description: "Tripstitch Privacy Policy — learn how the app handles your data, what we collect, and your choices regarding your information."
---

**Last Updated: March 9, 2026**

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

If you grant location permission, we use your approximate location to suggest nearby places, find airports, and provide context to the AI assistant. We request location at hundred-meter accuracy. You can revoke this at any time in iOS Settings.

### Subscription Data

In-app purchases are handled entirely by Apple. We validate your subscription status to determine your plan and enforce usage limits. We do not process or store payment information.

## 2. How We Use Your Data

- **Generate itineraries**: Your trip details and traveler preferences are sent to our AI service to create personalized travel plans.
- **Power the AI assistant**: Chat messages, trip context, and (optionally) your location are sent to our AI service to answer questions and suggest changes.
- **Provide place details**: Place names and coordinates are sent to a place data provider to retrieve ratings, reviews, hours, and photos.
- **Send notifications**: Your device token is used to notify you when background tasks complete.
- **Sync your data**: All trip data syncs across your devices via iCloud.

## 3. Third-Party Services

We use the following third-party services. Data is sent through our backend server (acting as a proxy), except where noted.

| Service | Data Shared | Purpose |
|---------|-------------|---------|
| **Anthropic (Claude AI)** | Trip details, traveler profiles, itineraries, chat messages, location (if granted) | AI itinerary generation and chat assistant |
| **Google Places API** | Place names, coordinates | Place search, ratings, reviews, photos, and hours |
| **Apple Maps Server API** | Coordinates, search categories | Place search during AI itinerary generation |
| **Open Exchange Rates API** | Currency codes | Currency exchange rate lookup |
| **DiceBear** | Traveler name (as avatar seed) | Generating traveler avatar images |

We also use standard Apple platform services (iCloud, Maps, Weather, Notifications, StoreKit) as part of normal iOS functionality.

### AI Data Processing

When you generate an itinerary or chat with Mia, your trip data — including traveler names, preferences, saved locations, and itinerary details — is sent to Anthropic's Claude API. Anthropic's data practices are governed by their [usage policy](https://www.anthropic.com/policies). We store AI requests and responses on our server to support the generation process.

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

We do not use any third-party analytics, crash reporting, or advertising SDKs.

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
