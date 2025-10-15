import { NextRequest, NextResponse } from 'next/server';

// NOTE: 실제 운영에서는 토스 시크릿 키로 서버에서 결제 승인/검증을 수행해야 합니다.
// 여기서는 테스트 편의를 위해 echo 형태의 스텁을 제공합니다.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // TODO: 시그니처 검증 및 결제 승인 호출 (server-to-server)
    return NextResponse.json({ ok: true, echo: body });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: 'invalid_request' },
      { status: 400 },
    );
  }
}
