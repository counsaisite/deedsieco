import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { routing } from '@/i18n/routing';
import SignInButtons from '@/components/SignInButtons';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-deedsie-navy">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700/50">
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <Image src="/logo.png" alt="Deedsie" width={32} height={32} className="rounded-full sm:w-9 sm:h-9" />
          <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Deedsie</span>
        </Link>
        <Link href="/join" className="text-blue-600 dark:text-blue-400 font-medium py-2 px-3 min-h-[44px] flex items-center">
          {t('joinNow')}
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            {t('signIn')}
          </h1>
          <SignInButtons />
          <Link
            href="/"
            className="block w-full text-center py-3.5 mt-6 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium min-h-[48px] flex items-center justify-center"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
