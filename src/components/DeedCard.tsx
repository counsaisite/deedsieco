'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Deed } from '@/types';
import { TIER_COLORS } from '@/types';
import { addReaction, removeReaction, getMyReactions, addVerification, hasVerified, followUser, unfollowUser, isFollowing } from '@/lib/firestore';
import type { ReactionType } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';

type DeedCardProps = {
  deed: Deed & { id: string };
};

function formatDate(ts: any) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString();
}

export default function DeedCard({ deed }: DeedCardProps) {
  const t = useTranslations('DeedCard');
  const { user } = useAuth();
  const tierColor = TIER_COLORS[deed.creatorTier] || 'from-slate-400 to-slate-600';

  const [reactionCount, setReactionCount] = useState(deed.reactionCount);
  const [inspiredCount, setInspiredCount] = useState(deed.inspiredCount);
  const [verified, setVerified] = useState(deed.verified);
  const [verificationCount, setVerificationCount] = useState(deed.verificationCount);
  const [myReactions, setMyReactions] = useState<ReactionType[]>([]);
  const [iVerified, setIVerified] = useState(false);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getMyReactions(deed.id, user.uid).then(setMyReactions);
    hasVerified(deed.id, user.uid).then(setIVerified);
    if (deed.creatorId !== user.uid) isFollowing(user.uid, deed.creatorId).then(setFollowing);
  }, [deed.id, deed.creatorId, user]);

  async function handleReaction(type: ReactionType) {
    if (!user) return;
    setLoading(type);
    const isActive = myReactions.includes(type);
    try {
      if (isActive) {
        await removeReaction(deed.id, user.uid, type);
        setMyReactions((prev) => prev.filter((r) => r !== type));
        if (type === 'like') setReactionCount((n) => Math.max(0, n - 1));
        else setInspiredCount((n) => Math.max(0, n - 1));
      } else {
        await addReaction(deed.id, user.uid, type);
        setMyReactions((prev) => [...prev, type]);
        if (type === 'like') setReactionCount((n) => n + 1);
        else setInspiredCount((n) => n + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  async function handleFollow() {
    if (!user || user.uid === deed.creatorId) return;
    setLoading('follow');
    try {
      if (following) {
        await unfollowUser(user.uid, deed.creatorId);
        setFollowing(false);
      } else {
        await followUser(user.uid, deed.creatorId);
        setFollowing(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  async function handleVerify() {
    if (!user || user.uid === deed.creatorId) return;
    setLoading('verify');
    try {
      const ok = await addVerification(deed.id, user.uid);
      if (ok) {
        setIVerified(true);
        setVerified(true);
        setVerificationCount((n) => n + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <article className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
      <div className="flex gap-3 sm:gap-4">
        <div className="relative shrink-0">
          {deed.creatorPhotoURL ? (
            <Image
              src={deed.creatorPhotoURL}
              alt={deed.creatorName}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {deed.creatorName.charAt(0)}
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br ${tierColor} ring-2 ring-white dark:ring-slate-800`} title={deed.creatorTier} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-white">{deed.creatorName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              {deed.creatorTier}
            </span>
            {user && user.uid !== deed.creatorId && (
              <button
                type="button"
                onClick={handleFollow}
                disabled={loading !== null}
                className={`text-xs px-2 py-1 rounded-full min-h-[28px] font-medium transition ${
                  following ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {following ? t('following') : t('follow')}
              </button>
            )}
            {verified && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {deed.townName} · {formatDate(deed.createdAt)}
          </p>
          <p className="mt-3 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{deed.content}</p>
          <div className="mt-3 flex flex-wrap gap-4 items-center">
            <button
              type="button"
              onClick={() => handleReaction('like')}
              disabled={!user || loading !== null}
              className={`flex items-center gap-1.5 text-sm min-h-[44px] px-2 -ml-2 rounded-lg transition ${
                myReactions.includes('like')
                  ? 'text-red-500'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span>❤️</span>
              <span>{reactionCount}</span>
            </button>
            <button
              type="button"
              onClick={() => handleReaction('inspired')}
              disabled={!user || loading !== null}
              className={`flex items-center gap-1.5 text-sm min-h-[44px] px-2 rounded-lg transition ${
                myReactions.includes('inspired')
                  ? 'text-amber-500'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span>✨</span>
              <span>{inspiredCount}</span>
            </button>
            {user && user.uid !== deed.creatorId && (
              <button
                type="button"
                onClick={handleVerify}
                disabled={iVerified || loading !== null}
                className={`flex items-center gap-1.5 text-sm min-h-[44px] px-2 rounded-lg transition ${
                  iVerified ? 'text-green-600 dark:text-green-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <span>{iVerified ? '✓' : '✓'}</span>
                <span>{iVerified ? t('verified') : t('verify')}</span>
                {verificationCount > 0 && <span>({verificationCount})</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
