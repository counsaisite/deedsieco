import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { routing } from '@/i18n/routing';
import DeedFeed from '@/components/DeedFeed';
import Footer from '@/components/Footer';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FeedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-deedsie-navy">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700/50">
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <Image src="/logo.png" alt="Deedsie" width={32} height={32} className="rounded-full sm:w-9 sm:h-9" />
          <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Deedsie</span>
        </Link>
        <Link href="/profile" className="text-slate-600 dark:text-slate-300 font-medium py-2 px-3 min-h-[44px] flex items-center">
          Profile
        </Link>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Your feed
        </h2>
        <DeedFeed />
      </main>
      <Footer />
    </div>
  );
}
