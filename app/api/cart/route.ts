import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/client';
import { getProfileIdByClerkId } from '@/lib/data/user';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const promptId: string | undefined = body?.promptId;
    if (!promptId) {
      return NextResponse.json({ error: 'promptId required' }, { status: 400 });
    }

    const profileId = await getProfileIdByClerkId(userId);
    if (!profileId) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const supabase = await createServerClient();
    const { error } = await supabase
      .from('carts')
      .insert({ user_id: profileId, prompt_id: promptId })
      .select('id')
      .single();

    if (error) {
      // unique(user_id, prompt_id) 위반 시에도 409로 처리
      const status = error.code === '23505' ? 409 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
