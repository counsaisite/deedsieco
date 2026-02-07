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
};
