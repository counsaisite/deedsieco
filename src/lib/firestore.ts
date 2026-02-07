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
} from 'firebase/firestore';
import { db } from './firebase';
import type { Deed, UserProfile } from '@/types';

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
  await updateDoc(userRef, {
    totalDeeds: increment(1),
    impactScore: increment(10),
    lastDeedDate: new Date().toISOString().split('T')[0],
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
