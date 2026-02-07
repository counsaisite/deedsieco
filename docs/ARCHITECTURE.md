# Deedsie Backend Architecture

> Full scope for Firestore schema, auth, and feature implementation.

---

## 1. Collections Overview

| Collection | Purpose |
|------------|---------|
| `users` | Profiles, power rank, preferences |
| `deeds` | Kindness posts |
| `reactions` | Likes, inspired, etc. |
| `verifications` | User-verified deeds |
| `towns` | Town metadata, counts |
| `follows` | Social graph (friends) |
| `tiers` | Tier definitions (config) |
| `leaderboards` | Cached rankings |

---

## 2. Firestore Schema

### `users/{userId}`
```js
{
  displayName: string,
  email: string,
  photoURL: string | null,
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Location (where user signed in / lives - drives feed & leaderboards)
  countryCode: string,           // "US" | "GB" | "IN" | etc.
  countryName: string,
  regionId: string,             // State, province, or equivalent
  regionName: string,
  townId: string,
  townName: string,
  lat: number | null,            // From IP or browser geolocation at sign-in
  lng: number | null,
  geoHash: string | null,        // For geo queries
  timezone: string,              // "America/New_York"
  lastLocationUpdated: timestamp,
  
  // Localization
  preferredLocale: string,       // "en" | "es" | "hi" | "zh" | etc.
  
  // Power Rank
  totalDeeds: number,           // Verified deeds count
  impactScore: number,          // Quality score (reactions, verifications)
  currentTier: string,          // "Local Hero"
  tierLevel: number,            // 9
  streakDays: number,
  lastDeedDate: string,         // "2025-02-07"
  
  // Preferences
  preferredTheme: "system",     // Always system for MVP
  topic interests: string[]    // Optional: discovery pills
}
```

### `deeds/{deedId}`
```js
{
  creatorId: string,
  creatorName: string,
  creatorPhotoURL: string | null,
  creatorTier: string,
  
  content: string,
  type: string,                 // "helping_neighbors" | "volunteering" | etc.
  tags: string[],
  
  countryCode: string,
  townId: string,
  townName: string,
  regionId: string,
  regionName: string,
  
  verified: boolean,
  verificationCount: number,
  reactionCount: number,
  inspiredCount: number,
  
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Geo (for nearby)
  geoHash: string | null,
  lat: number | null,
  lng: number | null
}
```

### `reactions/{reactionId}`
```js
{
  deedId: string,
  userId: string,
  type: string,                 // "like" | "inspired" | "thankful"
  createdAt: timestamp
}
```

### `verifications/{verificationId}`
```js
{
  deedId: string,
  verifierId: string,
  createdAt: timestamp
}
```

### `towns/{townId}`
```js
{
  name: string,
  countryCode: string,
  countryName: string,
  regionId: string,
  regionName: string,
  lat: number | null,
  lng: number | null,
  geoHash: string | null,
  deedCount: number,
  userCount: number,
  updatedAt: timestamp
}
```

### `follows/{followId}` (for friends leaderboard)
```js
{
  followerId: string,
  followingId: string,
  createdAt: timestamp
}
```

### `tiers` (config - rarely changes)
```js
// Document ID = tierLevel
{
  level: number,
  name: string,           // "Local Hero"
  minDeeds: number,
  minImpactScore: number,
  color: string,          // "blue" | "purple" | "gold"
  badge: string,          // icon/key
  group: string           // "community_builder" | "legendary"
}
```

### `leaderboards/{scope}_{scopeId}` (denormalized)
```js
// e.g. leaderboards/friends_user123, leaderboards/city_town456, leaderboards/country_US
{
  scope: "friends" | "city" | "region" | "country" | "global",
  scopeId: string,
  countryCode: string | null,    // For country/global leaderboards
  entries: [
    { userId, displayName, photoURL, tier, impactScore, rank },
    ...
  ],
  updatedAt: timestamp
}
```

---

## 3. Location Capture Strategy

**When:** On sign-up, sign-in, and when user updates profile.

**Sources (priority order):**
1. **User selection** — User explicitly picks town/region (most accurate)
2. **Browser Geolocation API** — `navigator.geolocation` (requires permission)
3. **IP geolocation** — Server-side or service (Vercel Geo, MaxMind, ipapi.co) — fallback when no permission

**Flow:**
- On first sign-in: Try IP geolocation → suggest town → user confirms or changes
- Optional: "Use my location" button → Browser geolocation → reverse geocode to town
- Store in `users`: countryCode, regionId, townId, lat, lng, timezone

**Feed & leaderboards:** Always filter/rank by user's `townId` → `regionId` → `countryCode` → global.

---

## 4. Internationalization (i18n) — Global Access

**Goal:** Any user, anywhere, can use Deedsie in their language.

**Approach:** `next-intl` or Next.js locale routing.

**Supported locales (phase 1):**
- `en` — English (default)
- `es` — Spanish
- `hi` — Hindi
- `zh` — Chinese (Simplified)
- `pt` — Portuguese
- `ar` — Arabic (RTL)
- `fr` — French
- `de` — German

**Storage:** `users.preferredLocale` — from browser `Accept-Language` or user setting.

**Routing:** `/[locale]/...` e.g. `/es`, `/hi`, `/en`

**Translation files:** `messages/{locale}.json` — all UI strings.

**Deed content:** Stored in creator's language; future: optional translation layer.

---

## 5. Point Scoring

| Action | Points |
|--------|--------|
| Post a Deed | +10 |
| Deed verified by another user | +25 |
| Reaction (like) | +2 |
| Reaction (inspired) | +10 |
| Daily streak (7+ days) | 1.1x multiplier |
| Daily streak (30+ days) | 1.2x multiplier |

---

## 6. Tier Structure (Reference)

| Level | Name | Group |
|-------|------|-------|
| 1 | First Spark | Beginner |
| 5 | Kind Starter | Beginner |
| 25 | Helper | Beginner |
| 50 | Neighbor | Beginner |
| 100 | Community Friend | Beginner |
| 200 | Giver | Community Builder |
| 300 | Uplifter | Community Builder |
| ... | ... | ... |
| 1000 | City Light | Community Builder |
| 25000 | Beacon | Legendary |
| 1000000 | Kindness Icon | Global Icon |
| 2000000 | Eternal Deedsie | Global Icon |

---

## 7. Feed Prioritization (Phased)

- **MVP:** Local town first (geo + time)
- **v2:** Add friends' deeds
- **v3:** AI-ranked mix (local + friends + trending)

---

## 8. Auth Providers

- Google ✓
- Apple ✓
- Email/Password ✓
- Yahoo ✓ (bonus)

---

## 9. Cloud Functions (Future)

- `onDeedCreated` → update user totalDeeds, impactScore, streak, tier
- `onReactionCreated` → update deed counts, creator impactScore
- `onVerificationCreated` → update deed verified, creator points
- `updateLeaderboards` → scheduled, refresh cached leaderboards

---

## 10. Security Rules Policy

- Users can read/write own `users` doc
- Deeds: create (own), read (public), update (own)
- Reactions: create (auth), read (public)
- Verifications: create (auth, not own deed), read (public)
- Towns: read (public), write (admin/functions)
- Leaderboards: read (public), write (functions only)
