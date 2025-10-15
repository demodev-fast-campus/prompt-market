import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ko'],

  // Used when no locale matches
  defaultLocale: 'ko',

  // Always show locale prefix in URL (e.g., /ko/prompts, /en/prompts)
  localePrefix: 'always',
});
