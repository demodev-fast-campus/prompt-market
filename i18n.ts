import { notFound } from 'next/navigation';

export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export function getPathnameWithoutLocale(pathname: string): string {
  const pattern = new RegExp(`^/(?:${locales.join('|')})(/|$)`);
  return pathname.replace(pattern, '/');
}

export async function loadMessages(locale: Locale) {
  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return messages;
  } catch (e) {
    notFound();
  }
}
