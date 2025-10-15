import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/with-clerk-server';

// GET /api/cart - 장바구니 조회
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // 장바구니 아이템 + 프롬프트 정보 조회
    const { data, error } = await supabase
      .from('carts')
      .select(`
        id,
        prompt_id,
        created_at,
        prompts (
          id,
          title,
          description,
          price,
          thumbnail,
          category,
          author
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Cart fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error('GET /api/cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - 장바구니에 추가
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { prompt_id } = body;

    if (!prompt_id) {
      return NextResponse.json(
        { error: 'prompt_id is required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 이미 장바구니에 있는지 확인
    const { data: existing } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', prompt_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Already in cart' },
        { status: 409 }
      );
    }

    // 장바구니에 추가
    const { data, error } = await supabase
      .from('carts')
      .insert({ user_id: userId, prompt_id })
      .select()
      .single();

    if (error) {
      console.error('Cart insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart?id=<cart_id> - 장바구니에서 제거
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get('id');

    if (!cartId) {
      return NextResponse.json(
        { error: 'cart id is required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 본인의 장바구니 아이템인지 확인하면서 삭제
    const { error } = await supabase
      .from('carts')
      .delete()
      .eq('id', cartId)
      .eq('user_id', userId);

    if (error) {
      console.error('Cart delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
