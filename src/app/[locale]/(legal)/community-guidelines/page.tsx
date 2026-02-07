import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CommunityGuidelinesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Community Guidelines</h1>
      <p className="mb-4">Deedsie is built on kindness. Our community guidelines help keep it that way.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Be kind and respectful</li>
        <li>Share genuine deeds</li>
        <li>No harassment or hate</li>
        <li>Respect privacy</li>
      </ul>
    </div>
  );
}
