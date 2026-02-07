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
  
  // Location
  townId: string,
  townName: string,
  stateId: string,
  stateName: string,
  
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
  
  townId: string,
  townName: string,
  stateId: string,
  
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
  stateId: string,
  stateName: string,
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
// e.g. leaderboards/friends_user123, leaderboards/city_town456
{
  scope: "friends" | "city" | "state" | "global",
  scopeId: string,
  entries: [
    { userId, displayName, photoURL, tier, impactScore, rank },
    ...
  ],
  updatedAt: timestamp
}
```

---

## 3. Point Scoring

| Action | Points |
|--------|--------|
| Post a Deed | +10 |
| Deed verified by another user | +25 |
| Reaction (like) | +2 |
| Reaction (inspired) | +10 |
| Daily streak (7+ days) | 1.1x multiplier |
| Daily streak (30+ days) | 1.2x multiplier |

---

## 4. Tier Structure (Reference)

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

## 5. Feed Prioritization (Phased)

- **MVP:** Local town first (geo + time)
- **v2:** Add friends' deeds
- **v3:** AI-ranked mix (local + friends + trending)

---

## 6. Auth Providers

- Google ✓
- Apple ✓
- Email/Password ✓
- Yahoo ✓ (bonus)

---

## 7. Cloud Functions (Future)

- `onDeedCreated` → update user totalDeeds, impactScore, streak, tier
- `onReactionCreated` → update deed counts, creator impactScore
- `onVerificationCreated` → update deed verified, creator points
- `updateLeaderboards` → scheduled, refresh cached leaderboards

---

## 8. Security Rules Policy

- Users can read/write own `users` doc
- Deeds: create (own), read (public), update (own)
- Reactions: create (auth), read (public)
- Verifications: create (auth, not own deed), read (public)
- Towns: read (public), write (admin/functions)
- Leaderboards: read (public), write (functions only)
