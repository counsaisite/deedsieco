'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUser, getLeaderboard, type LeaderboardEntry } from '@/lib/firestore';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function LeaderboardView() {
  const t = useTranslations('Leaderboard');
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<{ townId: string; townName: string; countryCode: string; countryName: string } | null>(null);
  const [scope, setScope] = useState<'town' | 'country'>('town');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const p = await getUser(user.uid);
        if (p) {
          setProfile({
            townId: p.townId || '',
            townName: p.townName || '',
            countryCode: p.countryCode || 'US',
            countryName: p.countryName || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  useEffect(() => {
    async function load() {
      if (!profile) return;
      setLoading(true);
      try {
        let effectiveScope = scope;
        let scopeId = scope === 'town' ? profile.townId : profile.countryCode;
        if (scope === 'town' && (!scopeId || scopeId === 'unknown')) {
          effectiveScope = 'country';
          scopeId = profile.countryCode;
        }
        if (!scopeId) {
          setEntries([]);
          return;
        }
        const list = await getLeaderboard(effectiveScope, scopeId);
        setEntries(list);
      } catch (err) {
        console.error(err);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profile, scope]);

  if (authLoading || (user && loading && entries.length === 0)) {
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

  const scopeLabel = scope === 'town' ? (profile?.townName || t('yourTown')) : (profile?.countryName || t('yourCountry'));

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setScope('town')}
          className={`flex-1 py-3 rounded-lg font-medium min-h-[44px] transition ${
            scope === 'town'
              ? 'bg-blue-600 text-white'
              : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
          }`}
        >
          {t('town')}
        </button>
        <button
          type="button"
          onClick={() => setScope('country')}
          className={`flex-1 py-3 rounded-lg font-medium min-h-[44px] transition ${
            scope === 'country'
              ? 'bg-blue-600 text-white'
              : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
          }`}
        >
          {t('country')}
        </button>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {t('title')} — {scopeLabel}
      </h3>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">{t('loading')}</p>
      ) : entries.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-center">
          <p className="text-slate-600 dark:text-slate-400">{t('noEntries')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-4 rounded-xl border min-h-[44px] ${
                entry.userId === user.uid
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
              }`}
            >
              <span className="w-8 text-lg font-bold text-slate-500 dark:text-slate-400">#{entry.rank}</span>
              {entry.photoURL ? (
                <Image src={entry.photoURL} alt="" width={40} height={40} className="rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {entry.displayName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{entry.displayName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{entry.currentTier}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900 dark:text-white">{entry.impactScore}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('impact')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
