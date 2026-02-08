import { Timestamp } from 'firebase/firestore';

export type DeedType =
  | 'nearby'
  | 'volunteering'
  | 'helping_neighbors'
  | 'gratitude'
  | 'giving_back'
  | 'faith_hope'
  | 'random_kindness';

export interface Deed {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorPhotoURL: string | null;
  creatorTier: string;
  content: string;
  type: DeedType;
  tags: string[];
  countryCode: string;
  townId: string;
  townName: string;
  regionId: string;
  regionName: string;
  verified: boolean;
  verificationCount: number;
  reactionCount: number;
  inspiredCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lat?: number | null;
  lng?: number | null;
}

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  countryCode: string;
  countryName: string;
  regionId: string;
  regionName: string;
  townId: string;
  townName: string;
  lat?: number | null;
  lng?: number | null;
  timezone: string;
  preferredLocale: string;
  totalDeeds: number;
  impactScore: number;
  currentTier: string;
  tierLevel: number;
  streakDays: number;
  lastDeedDate: string;
}

export const DEED_TYPES: { value: DeedType; labelKey: string }[] = [
  { value: 'nearby', labelKey: 'nearby' },
  { value: 'volunteering', labelKey: 'volunteering' },
  { value: 'helping_neighbors', labelKey: 'helpingNeighbors' },
  { value: 'gratitude', labelKey: 'gratitude' },
  { value: 'giving_back', labelKey: 'givingBack' },
  { value: 'faith_hope', labelKey: 'faithHope' },
  { value: 'random_kindness', labelKey: 'randomKindness' },
];

export const TIER_COLORS: Record<string, string> = {
  'First Spark': 'from-green-400 to-green-600',
  'Kind Starter': 'from-green-400 to-green-600',
  'Helper': 'from-green-400 to-green-600',
  'Neighbor': 'from-green-400 to-green-600',
  'Community Friend': 'from-green-400 to-green-600',
  'Giver': 'from-blue-400 to-blue-600',
  'Uplifter': 'from-blue-400 to-blue-600',
  'Encourager': 'from-blue-400 to-blue-600',
  'Local Hero': 'from-blue-400 to-blue-600',
  'City Light': 'from-blue-400 to-blue-600',
  'Difference Maker': 'from-purple-400 to-purple-600',
  'Kindness Leader': 'from-purple-400 to-purple-600',
  'Community Champion': 'from-purple-400 to-purple-600',
  'Beacon': 'from-amber-400 to-amber-600',
  'Inspiration': 'from-amber-400 to-amber-600',
  'Living Legend': 'from-amber-400 to-amber-600',
  'Kindness Icon': 'from-amber-400 to-amber-600',
  'Eternal Deedsie': 'from-amber-400 to-amber-600',
};

// Approximate deeds needed for next tier (from ARCHITECTURE)
export const TIER_THRESHOLDS: { level: number; name: string; minDeeds: number }[] = [
  { level: 1, name: 'First Spark', minDeeds: 0 },
  { level: 2, name: 'Kind Starter', minDeeds: 5 },
  { level: 3, name: 'Helper', minDeeds: 25 },
  { level: 4, name: 'Neighbor', minDeeds: 50 },
  { level: 5, name: 'Community Friend', minDeeds: 100 },
  { level: 6, name: 'Giver', minDeeds: 200 },
  { level: 7, name: 'Uplifter', minDeeds: 300 },
  { level: 8, name: 'City Light', minDeeds: 1000 },
  { level: 9, name: 'Beacon', minDeeds: 25000 },
  { level: 10, name: 'Kindness Icon', minDeeds: 1000000 },
  { level: 11, name: 'Eternal Deedsie', minDeeds: 2000000 },
];
