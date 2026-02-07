import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { routing } from '@/i18n/routing';
import Footer from '@/components/Footer';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LegalLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-deedsie-navy">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-700/50">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Deedsie" width={32} height={32} className="rounded-full" />
          <span className="font-bold text-slate-900 dark:text-white">Deedsie</span>
        </Link>
        <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm">
          Back
        </Link>
      </header>
      <main className="flex-1 px-4 sm:px-6 py-8 max-w-2xl mx-auto w-full text-slate-700 dark:text-slate-300">
        {children}
      </main>
      <Footer />
    </div>
  );
}
