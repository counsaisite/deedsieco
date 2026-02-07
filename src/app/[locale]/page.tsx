import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { routing } from '@/i18n/routing';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import HeroAuthButtons from '@/components/HeroAuthButtons';

const TOPIC_KEYS = [
  'nearby',
  'volunteering',
  'helpingNeighbors',
  'gratitude',
  'givingBack',
  'faithHope',
  'randomKindness',
] as const;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');
  const tTopics = await getTranslations('Topics');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-deedsie-navy">
      {/* Header - mobile: compact, touch-friendly */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700/50">
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <Image src="/logo.png" alt="Deedsie" width={32} height={32} className="rounded-full sm:w-9 sm:h-9" />
          <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Deedsie</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <LocaleSwitcher />
          <Link
            href="/join"
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition py-2 px-3 min-h-[44px] flex items-center text-sm sm:text-base"
          >
            {t('joinNow')}
          </Link>
          <Link
            href="/signin"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition font-medium py-2 px-3 min-h-[44px] flex items-center text-sm sm:text-base"
          >
            {t('signIn')}
          </Link>
        </div>
      </header>

      {/* Hero - mobile: stacked, full width */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 gap-10 sm:gap-16">
        <div className="flex-1 max-w-xl w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4 sm:mb-6">
            {t('headline')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10">
            {t('subheadline')}
          </p>

          <HeroAuthButtons />

          <p className="mt-6 text-sm text-slate-500">
            {t.rich('agreement', {
              terms: (chunks) => <Link href="/terms" className="text-blue-400 hover:underline">{chunks}</Link>,
              privacy: (chunks) => <Link href="/privacy" className="text-blue-400 hover:underline">{chunks}</Link>,
              cookies: (chunks) => <Link href="/cookies" className="text-blue-400 hover:underline">{chunks}</Link>,
            })}
          </p>
        </div>

        {/* Illustration - hidden on small mobile, shown sm+ */}
        <div className="flex-1 flex items-center justify-center w-full max-w-md hidden sm:flex">
          <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{t('communityWarmth')}</p>
                <p className="text-slate-500 text-xs mt-1">{t('illustrationComing')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Discovery - mobile: scrollable pills */}
      <section className="border-t border-slate-200 dark:border-slate-700/50 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
            {t('discoveryTitle')}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {TOPIC_KEYS.map((key) => (
              <button
                key={key}
                className="px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 transition text-sm font-medium min-h-[44px]"
              >
                {tTopics(key)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-slate-200 dark:border-slate-700/50 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            {t('socialProof', { count: '12,482', towns: '143' })}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-700/50 py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-4 sm:mb-6">
            {t('ctaLine1')}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8">{t('ctaLine2')}</p>
          <Link
            href="/join"
            className="inline-block px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition min-h-[48px] flex items-center justify-center mx-auto"
          >
            {t('createAccount')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700/50 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-500">
          <Link href="/about" className="hover:text-slate-400 py-2">
            {t('about')}
          </Link>
          <Link href="/help" className="hover:text-slate-400 py-2">
            {t('help')}
          </Link>
          <Link href="/terms" className="hover:text-slate-400 py-2">
            {t('terms')}
          </Link>
          <Link href="/privacy" className="hover:text-slate-400 py-2">
            {t('privacy')}
          </Link>
        </div>
      </footer>
    </div>
  );
}
