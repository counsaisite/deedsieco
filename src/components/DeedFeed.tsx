'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDeeds } from '@/lib/firestore';
import DeedCard from './DeedCard';
import PostDeedForm from './PostDeedForm';
import { Link } from '@/i18n/navigation';
import type { Deed } from '@/types';

export default function DeedFeed() {
  const { user, loading: authLoading } = useAuth();
  const [deeds, setDeeds] = useState<(Deed & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [deedAdded, setDeedAdded] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await getDeeds();
        setDeeds(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [deedAdded]);

  if (authLoading) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Sign in to see your feed.</p>
        <Link href="/signin" className="text-blue-600 dark:text-blue-400 font-medium">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PostDeedForm onSuccess={() => setDeedAdded((n) => n + 1)} />
      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading deeds...</div>
      ) : deeds.length === 0 ? (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
          <p className="mb-2">No deeds yet.</p>
          <p className="text-sm">Share your first deed above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deeds.map((deed) => (
            <DeedCard key={deed.id} deed={deed} />
          ))}
        </div>
      )}
    </div>
  );
}
