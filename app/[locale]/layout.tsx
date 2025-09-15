import type { Metadata } from 'next';
import { IntlProvider } from '@/components/intl-provider';
import { loadMessages, locales, type Locale } from '@/i18n';

export const metadata: Metadata = {
  // Optional: per-locale metadata can be managed later if needed
};

export async function generateStaticParams() {
  return (locales as readonly string[]).map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const messages = await loadMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <IntlProvider locale={locale} messages={messages}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
