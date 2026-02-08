import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Deed, UserProfile } from '@/types';

export type ReactionType = 'like' | 'inspired';

export async function createUser(
  userId: string,
  data: Partial<UserProfile> & { displayName: string; email: string }
) {
  if (!db) return null;
  const userRef = doc(db, 'users', userId);
  const existing = await getDoc(userRef);
  if (existing.exists()) return existing.data();

  const userData: Partial<UserProfile> = {
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL ?? null,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    countryCode: data.countryCode ?? 'US',
    countryName: data.countryName ?? 'United States',
    regionId: data.regionId ?? '',
    regionName: data.regionName ?? '',
    townId: data.townId ?? '',
    townName: data.townName ?? data.regionName ?? 'Unknown',
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    timezone: data.timezone ?? 'America/New_York',
    preferredLocale: data.preferredLocale ?? 'en',
    totalDeeds: 0,
    impactScore: 0,
    currentTier: 'First Spark',
    tierLevel: 1,
    streakDays: 0,
    lastDeedDate: '',
  };
  await setDoc(userRef, userData);
  return userData;
}

export async function updateUser(userId: string, data: Partial<UserProfile>) {
  if (!db) return;
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getUser(userId: string): Promise<UserProfile | null> {
  if (!db) return null;
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserProfile & { id: string };
}

export async function createDeed(
  creatorId: string,
  creatorName: string,
  creatorPhotoURL: string | null,
  creatorTier: string,
  content: string,
  type: string,
  location: {
    countryCode: string;
    countryName: string;
    regionId: string;
    regionName: string;
    townId: string;
    townName: string;
    lat?: number | null;
    lng?: number | null;
  }
) {
  if (!db) throw new Error('Firebase is not configured.');
  const deedsRef = collection(db, 'deeds');
  const deedData = {
    creatorId,
    creatorName,
    creatorPhotoURL,
    creatorTier,
    content,
    type,
    tags: [type],
    countryCode: location.countryCode,
    townId: location.townId,
    townName: location.townName,
    regionId: location.regionId,
    regionName: location.regionName,
    verified: false,
    verificationCount: 0,
    reactionCount: 0,
    inspiredCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lat: location.lat ?? null,
    lng: location.lng ?? null,
  };
  const ref = await addDoc(deedsRef, deedData);

  const userRef = doc(db, 'users', creatorId);
  const userSnap = await getDoc(userRef);
  const today = new Date().toISOString().split('T')[0];
  let newStreak = 1;
  if (userSnap.exists()) {
    const data = userSnap.data();
    const last = data?.lastDeedDate || '';
    const currentStreak = data?.streakDays || 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (last === today) newStreak = currentStreak;
    else if (last === yesterdayStr) newStreak = currentStreak + 1;
  }
  await updateDoc(userRef, {
    totalDeeds: increment(1),
    impactScore: increment(10),
    lastDeedDate: today,
    streakDays: newStreak,
    updatedAt: serverTimestamp(),
  });

  return { id: ref.id, ...deedData };
}

export async function getDeeds(townId?: string, limitCount = 50): Promise<(Deed & { id: string })[]> {
  if (!db) return [];
  const deedsRef = collection(db, 'deeds');
  let q;
  if (townId && townId.length > 0 && townId !== 'unknown') {
    q = query(
      deedsRef,
      where('townId', '==', townId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
  } else {
    q = query(deedsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt, updatedAt: d.data().updatedAt })) as (Deed & { id: string })[];
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  if (!db || followerId === followingId) return false;
  const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
  const snap = await getDoc(followRef);
  return snap.exists();
}

export async function getDeedsForFriends(userId: string, limitCount = 50): Promise<(Deed & { id: string })[]> {
  if (!db) return [];
  const followingIds = await getFollowingIds(userId);
  const allIds = [userId, ...followingIds];
  const creatorIds = allIds.filter((id, i) => allIds.indexOf(id) === i).slice(0, 30);
  if (creatorIds.length === 0) return getDeeds(undefined, limitCount);
  const deedsRef = collection(db, 'deeds');
  const q = query(
    deedsRef,
    where('creatorId', 'in', creatorIds),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt, updatedAt: d.data().updatedAt })) as (Deed & { id: string })[];
}

export async function getDeedsByUser(userId: string): Promise<(Deed & { id: string })[]> {
  if (!db) return [];
  const deedsRef = collection(db, 'deeds');
  const q = query(
    deedsRef,
    where('creatorId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt, updatedAt: d.data().updatedAt })) as (Deed & { id: string })[];
}

export function getReactionId(deedId: string, userId: string, type: ReactionType): string {
  return `${deedId}_${userId}_${type}`;
}

export async function addReaction(deedId: string, userId: string, type: ReactionType): Promise<boolean> {
  if (!db) return false;
  const reactionId = getReactionId(deedId, userId, type);
  const reactionRef = doc(db, 'reactions', reactionId);
  const existing = await getDoc(reactionRef);
  if (existing.exists()) return false;

  const deedRef = doc(db, 'deeds', deedId);
  const field = type === 'like' ? 'reactionCount' : 'inspiredCount';
  await setDoc(reactionRef, { deedId, userId, type, createdAt: serverTimestamp() });
  await updateDoc(deedRef, { [field]: increment(1), updatedAt: serverTimestamp() });
  return true;
}

export async function removeReaction(deedId: string, userId: string, type: ReactionType): Promise<boolean> {
  if (!db) return false;
  const reactionId = getReactionId(deedId, userId, type);
  const reactionRef = doc(db, 'reactions', reactionId);
  const existing = await getDoc(reactionRef);
  if (!existing.exists()) return false;

  const deedRef = doc(db, 'deeds', deedId);
  const field = type === 'like' ? 'reactionCount' : 'inspiredCount';
  await deleteDoc(reactionRef);
  await updateDoc(deedRef, { [field]: increment(-1), updatedAt: serverTimestamp() });
  return true;
}

export async function getMyReactions(deedId: string, userId: string): Promise<ReactionType[]> {
  if (!db) return [];
  const types: ReactionType[] = ['like', 'inspired'];
  const result: ReactionType[] = [];
  for (const type of types) {
    const reactionRef = doc(db, 'reactions', getReactionId(deedId, userId, type));
    const snap = await getDoc(reactionRef);
    if (snap.exists()) result.push(type);
  }
  return result;
}

export async function addVerification(deedId: string, verifierId: string): Promise<boolean> {
  if (!db) return false;
  const verificationId = `${deedId}_${verifierId}`;
  const verificationRef = doc(db, 'verifications', verificationId);
  const existing = await getDoc(verificationRef);
  if (existing.exists()) return false;

  const deedRef = doc(db, 'deeds', deedId);
  const deedSnap = await getDoc(deedRef);
  if (!deedSnap.exists() || deedSnap.data()?.creatorId === verifierId) return false;

  await setDoc(verificationRef, { deedId, verifierId, createdAt: serverTimestamp() });
  await updateDoc(deedRef, {
    verificationCount: increment(1),
    verified: true,
    updatedAt: serverTimestamp(),
  });
  return true;
}

export async function hasVerified(deedId: string, userId: string): Promise<boolean> {
  if (!db) return false;
  const verificationRef = doc(db, 'verifications', `${deedId}_${userId}`);
  const snap = await getDoc(verificationRef);
  return snap.exists();
}

export async function followUser(followerId: string, followingId: string): Promise<void> {
  if (!db || followerId === followingId) return;
  const followId = `${followerId}_${followingId}`;
  const followRef = doc(db, 'follows', followId);
  const existing = await getDoc(followRef);
  if (existing.exists()) return;
  await setDoc(followRef, { followerId, followingId, createdAt: serverTimestamp() });
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  if (!db) return;
  const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
  await deleteDoc(followRef);
}

export async function getFollowingIds(userId: string): Promise<string[]> {
  if (!db) return [];
  const followsRef = collection(db, 'follows');
  const q = query(followsRef, where('followerId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().followingId);
}

export type LeaderboardEntry = {
  userId: string;
  displayName: string;
  photoURL: string | null;
  currentTier: string;
  impactScore: number;
  totalDeeds: number;
  rank: number;
};

export async function getLeaderboard(scope: 'town' | 'country', scopeId: string, limitCount = 20): Promise<LeaderboardEntry[]> {
  if (!db) return [];
  const usersRef = collection(db, 'users');
  const field = scope === 'town' ? 'townId' : 'countryCode';
  const q = query(
    usersRef,
    where(field, '==', scopeId),
    orderBy('impactScore', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => {
    const data = d.data();
    return {
      userId: d.id,
      displayName: data.displayName || 'Anonymous',
      photoURL: data.photoURL || null,
      currentTier: data.currentTier || 'First Spark',
      impactScore: data.impactScore || 0,
      totalDeeds: data.totalDeeds || 0,
      rank: i + 1,
    };
  });
}
