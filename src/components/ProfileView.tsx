'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUser, getDeedsByUser } from '@/lib/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { TIER_COLORS, TIER_THRESHOLDS, type UserProfile } from '@/types';
import DeedCard from './DeedCard';
import type { Deed } from '@/types';
import { useTranslations } from 'next-intl';

function formatMemberSince(ts: unknown): string {
  if (!ts) return '';
  const val = ts as { toDate?: () => Date } | string | number;
  const d = typeof val === 'object' && val !== null && typeof (val as any).toDate === 'function'
    ? (val as any).toDate()
    : new Date(val as string | number);
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function getTierProgress(profile: UserProfile): { current: number; next: number; label: string } | null {
  const idx = TIER_THRESHOLDS.findIndex((t) => t.name === profile.currentTier);
  if (idx < 0 || idx >= TIER_THRESHOLDS.length - 1) return null;
  const current = TIER_THRESHOLDS[idx].minDeeds;
  const next = TIER_THRESHOLDS[idx + 1].minDeeds;
  const deeds = profile.totalDeeds;
  const remaining = Math.max(0, next - deeds);
  return {
    current: deeds - current,
    next: next - current,
    label: remaining > 0 ? `${remaining} deeds to ${TIER_THRESHOLDS[idx + 1].name}` : '',
  };
}

export default function ProfileView() {
  const t = useTranslations('Profile');
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<(UserProfile & { id: string }) | null>(null);
  const [deeds, setDeeds] = useState<(Deed & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [deedsLoading, setDeedsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const p = await getUser(user.uid);
        setProfile(p as (UserProfile & { id: string }) | null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  useEffect(() => {
    async function loadDeeds() {
      if (!user) {
        setDeedsLoading(false);
        return;
      }
      try {
        const list = await getDeedsByUser(user.uid);
        setDeeds(list);
      } catch (err) {
        console.error(err);
      } finally {
        setDeedsLoading(false);
      }
    }
    loadDeeds();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-4">{t('signInPrompt')}</p>
        <Link href="/signin" className="text-blue-600 dark:text-blue-400 font-medium">
          {t('signIn')}
        </Link>
      </div>
    );
  }

  const tierColor = profile ? TIER_COLORS[profile.currentTier] || 'from-slate-400 to-slate-600' : 'from-green-400 to-green-600';
  const tierProgress = profile ? getTierProgress(profile) : null;

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative shrink-0">
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
            <div
              className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${tierColor} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800`}
              title={profile?.currentTier ?? 'First Spark'}
            >
              {profile?.tierLevel ?? 1}
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.displayName ?? 'Anonymous'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {profile?.currentTier ?? 'First Spark'}
            </p>
            {profile?.townName && (
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                📍 {[profile.townName, profile.regionName, profile.countryName].filter(Boolean).join(', ')}
              </p>
            )}
            {(profile as any)?.createdAt && (
              <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
                {t('memberSince')} {formatMemberSince((profile as any).createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      {profile && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-center min-h-[72px] flex flex-col justify-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.totalDeeds}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('deeds')}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-center min-h-[72px] flex flex-col justify-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.impactScore}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('impact')}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-center min-h-[72px] flex flex-col justify-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.streakDays}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dayStreak')}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-center min-h-[72px] flex flex-col justify-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Lvl {profile.tierLevel}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('tier')}</p>
          </div>
        </div>
      )}

      {/* Tier progress */}
      {profile && tierProgress && tierProgress.label && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('tierProgress')}</h4>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${tierColor} transition-all`}
                style={{ width: `${Math.min(100, (tierProgress.current / tierProgress.next) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{tierProgress.label}</span>
          </div>
        </div>
      )}

      {/* Location details */}
      {profile && (profile.townName || profile.regionName || profile.countryName) && (
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{t('location')}</h4>
          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {profile.townName && <p>📍 {profile.townName}</p>}
            {profile.regionName && profile.regionName !== profile.townName && <p>📍 {profile.regionName}</p>}
            {profile.countryName && <p>🌍 {profile.countryName}</p>}
          </div>
        </div>
      )}

      {/* My Deeds */}
      <div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('myDeeds')}</h4>
        {deedsLoading ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">{t('loading')}</p>
        ) : deeds.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">{t('noDeeds')}</p>
            <Link
              href="/feed"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium min-h-[44px]"
            >
              {t('shareFirstDeed')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {deeds.map((deed) => (
              <DeedCard key={deed.id} deed={deed} />
            ))}
          </div>
        )}
      </div>

      {/* Account & Sign out */}
      <div className="space-y-3">
        {user.email && (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{t('account')}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => auth && signOut(auth)}
          className="w-full py-3.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition min-h-[48px]"
        >
          {t('signOut')}
        </button>
      </div>
    </div>
  );
}
