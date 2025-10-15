import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ prompt: data });
  }

  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ prompts: data });
}
