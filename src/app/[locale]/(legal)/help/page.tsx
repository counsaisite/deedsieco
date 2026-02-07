import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Help Center</h1>
      <p className="mb-4">Find answers and get support.</p>
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
