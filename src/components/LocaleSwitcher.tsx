'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  hi: 'हिन्दी',
  zh: '中文',
  pt: 'Português',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className="bg-transparent border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 text-sm text-slate-700 dark:text-slate-300 min-h-[44px]"
      aria-label="Select language"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {LOCALE_NAMES[loc] || loc}
        </option>
      ))}
    </select>
  );
}
