import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from '@/i18n';

export async function POST(request: NextRequest) {
  const { locale } = (await request.json().catch(() => ({}))) as {
    locale?: string;
  };
  if (!locale || !(locales as readonly string[]).includes(locale)) {
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
