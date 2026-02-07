import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About Deedsie</h1>
      <p className="mb-4">Deedsie is a platform for sharing kindness in your community.</p>
      <p>Join your town. Share a Deed. Make the world brighter.</p>
    </div>
  );
}
