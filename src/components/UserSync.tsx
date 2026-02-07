'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { createUser, getUser } from '@/lib/firestore';

export default function UserSync() {
  const { user } = useAuth();
  const { location } = useLocation();
  const synced = useRef(false);

  useEffect(() => {
    const u = user;
    if (!u || synced.current) return;

    async function sync() {
      if (!u) return;
      try {
        const existing = await getUser(u.uid);
        if (existing) {
          synced.current = true;
          return;
        }

        await createUser(u.uid, {
          displayName: u.displayName ?? 'Anonymous',
          email: u.email ?? '',
          photoURL: u.photoURL ?? null,
          countryCode: location?.countryCode ?? 'US',
          countryName: location?.countryName ?? 'United States',
          regionId: location?.region ?? '',
          regionName: location?.regionName ?? '',
          townId: location?.city ? location.city.toLowerCase().replace(/\s+/g, '-') : '',
          townName: location?.city ?? location?.regionName ?? 'Unknown',
          lat: location?.lat ?? null,
          lng: location?.lng ?? null,
          timezone: location?.timezone ?? 'America/New_York',
          preferredLocale: typeof window !== 'undefined' ? document.documentElement.lang || 'en' : 'en',
        });
        synced.current = true;
      } catch (err) {
        console.error('UserSync:', err);
      }
    }

    sync();
  }, [user, location]);

  return null;
}
