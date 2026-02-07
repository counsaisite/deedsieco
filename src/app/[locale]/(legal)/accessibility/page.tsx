import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AccessibilityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Accessibility</h1>
      <p className="mb-4">Deedsie is committed to making our platform accessible to everyone.</p>
      <p>We follow WCAG guidelines and continuously improve our experience.</p>
    </div>
  );
}
