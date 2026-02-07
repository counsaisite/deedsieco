'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createDeed, getUser } from '@/lib/firestore';
import { useLocation } from '@/hooks/useLocation';
import { DEED_TYPES } from '@/types';
import { useTranslations } from 'next-intl';

type Props = { onSuccess: () => void };

export default function PostDeedForm({ onSuccess }: Props) {
  const { user } = useAuth();
  const { location } = useLocation();
  const t = useTranslations('Topics');
  const [content, setContent] = useState('');
  const [type, setType] = useState('random_kindness');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [creatorTier, setCreatorTier] = useState('First Spark');

  useEffect(() => {
    if (user) {
      getUser(user.uid).then((p) => p && setCreatorTier(p.currentTier));
    }
  }, [user]);

  const loc = {
    countryCode: location?.countryCode ?? 'US',
    countryName: location?.countryName ?? 'United States',
    regionId: location?.region ?? '',
    regionName: location?.regionName ?? '',
    townId: location?.city ? location.city.toLowerCase().replace(/\s+/g, '-') : 'unknown',
    townName: location?.city ?? location?.regionName ?? 'Unknown',
    lat: location?.lat ?? null,
    lng: location?.lng ?? null,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await createDeed(
        user.uid,
        user.displayName ?? 'Anonymous',
        user.photoURL ?? null,
        creatorTier,
        content.trim(),
        type,
        loc
      );
      setContent('');
      onSuccess();
    } catch (err: any) {
      setError(err.message ?? 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share a deed of kindness..."
        required
        rows={3}
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 resize-none min-h-[80px]"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {DEED_TYPES.map(({ value, labelKey }) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition min-h-[36px] ${
              type === value
                ? 'bg-blue-600 text-white'
                : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500/50'
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="mt-4 w-full sm:w-auto sm:min-w-[120px] py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium transition min-h-[48px]"
      >
        {submitting ? 'Posting...' : 'Post Deed'}
      </button>
    </form>
  );
}
