import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ko'],

  // Used when no locale matches
  defaultLocale: 'ko',

  // The locale prefix strategy - 'as-needed' means the default locale doesn't have a prefix
  localePrefix: 'as-needed',
});
