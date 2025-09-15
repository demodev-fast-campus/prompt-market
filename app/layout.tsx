import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { cookies } from 'next/headers';
import { locales, defaultLocale, loadMessages } from '@/i18n';
import { IntlProvider } from '@/components/intl-provider';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const lang = (locales as readonly string[]).includes(cookieLocale ?? '')
    ? (cookieLocale as (typeof locales)[number])
    : defaultLocale;
  const messages = await loadMessages(lang);
  return (
    <html lang={lang} suppressHydrationWarning>
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
          <IntlProvider locale={lang} messages={messages}>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
            <Analytics />
          </IntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
