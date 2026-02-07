'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUser } from '@/lib/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { TIER_COLORS } from '@/types';

export default function ProfileView() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const p = await getUser(user.uid);
        setProfile(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Sign in to view your profile.</p>
        <Link href="/signin" className="text-blue-600 dark:text-blue-400 font-medium">
          Sign in
        </Link>
      </div>
    );
  }

  const tierColor = profile ? TIER_COLORS[profile.currentTier] || 'from-slate-400 to-slate-600' : 'from-green-400 to-green-600';

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName ?? 'User'}
                width={96}
                height={96}
                className="rounded-full ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                {(user.displayName ?? 'U').charAt(0)}
              </div>
            )}
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${tierColor} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800`} title={profile?.currentTier ?? 'First Spark'}>
              {profile?.tierLevel ?? 1}
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.displayName ?? 'Anonymous'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {profile?.currentTier ?? 'First Spark'}
            </p>
            {profile?.townName && (
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                📍 {profile.townName}
              </p>
            )}
          </div>
        </div>
      </div>

      {profile && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.totalDeeds}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Deeds</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.impactScore}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Impact</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.streakDays}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Day Streak</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Lvl {profile.tierLevel}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tier</p>
          </div>
        </div>
      )}

      <button
        onClick={() => auth && signOut(auth)}
        className="w-full py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition min-h-[48px]"
      >
        Sign out
      </button>
    </div>
  );
}
