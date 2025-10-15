import type React from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { koKR } from '@clerk/localizations';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  title: '프롬프트 마켓 - AI 프롬프트 거래소',
  description: 'AI 프롬프트를 사고팔 수 있는 한국 최대 마켓플레이스',
  generator: 'v0.app',
  openGraph: {
    title: '프롬프트 마켓 - AI 프롬프트 거래소',
    description: 'AI 프롬프트를 사고팔 수 있는 한국 최대 마켓플레이스',
    siteName: '프롬프트 마켓',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '프롬프트 마켓 OG 이미지',
      },
    ],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://vitals.vercel-analytics.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com" />
        <link
          rel="preconnect"
          href="https://cdn.vercel-insights.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.vercel-insights.com" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider localization={koKR}>
            <NextIntlClientProvider
              locale={locale}
              messages={messages}
              timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            >
              <Suspense fallback={null}>{children}</Suspense>
              <Toaster />
              <Analytics />
            </NextIntlClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
