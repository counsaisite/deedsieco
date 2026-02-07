'use client';

import Image from 'next/image';
import type { Deed } from '@/types';
import { TIER_COLORS } from '@/types';

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
  const tierColor = TIER_COLORS[deed.creatorTier] || 'from-slate-400 to-slate-600';

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
              style={{ ['--tw-ring-color' as string]: `var(--tier-${deed.creatorTier})` }}
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
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {deed.townName} · {formatDate(deed.createdAt)}
          </p>
          <p className="mt-3 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{deed.content}</p>
          <div className="mt-3 flex gap-4 text-sm text-slate-500">
            <span>❤️ {deed.reactionCount}</span>
            <span>✨ {deed.inspiredCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
