import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { koKR, enUS } from '@clerk/localizations';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

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

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const clerkLocalization = locale === 'ko' ? koKR : enUS;

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
        <ClerkProvider localization={clerkLocalization}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <Suspense fallback={null}>{children}</Suspense>
              <Toaster />
              <Analytics />
            </NextIntlClientProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
