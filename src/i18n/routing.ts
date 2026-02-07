import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'hi', 'zh', 'pt', 'ar', 'fr', 'de'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
