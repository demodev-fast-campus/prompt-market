import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

export async function POST(request: NextRequest) {
  const { locale } = (await request.json().catch(() => ({}))) as {
    locale?: string;
  };
  if (!locale || !routing.locales.includes(locale as any)) {
    return NextResponse.json(
      { ok: false, error: 'INVALID_LOCALE' },
      { status: 400 },
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
