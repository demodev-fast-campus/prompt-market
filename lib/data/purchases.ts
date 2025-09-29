import { createServerClient } from '@/lib/supabase/client';

export type PurchaseJoinedItem = {
  id: string;
  title: string;
  price: number;
  category: string;
  thumbnail: string | null;
  purchasedAt: number;
};

export async function getPurchasesByProfileId(
  profileId: string,
): Promise<PurchaseJoinedItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('purchases')
    .select(
      'id, created_at, prompt_id, prompts(title, price, tags, image_urls)',
    )
    .eq('buyer_id', profileId)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row: any) => {
    const p = row.prompts as {
      title: string;
      price: number;
      tags: string[] | null;
      image_urls: string[] | null;
    } | null;
    return {
      id: row.id as string,
      title: p?.title ?? '구매한 프롬프트',
      price: p?.price ?? 0,
      category: p?.tags?.[0] ?? '기타',
      thumbnail:
        Array.isArray(p?.image_urls) && p!.image_urls!.length > 0
          ? p!.image_urls![0]
          : null,
      purchasedAt: Date.parse(row.created_at as string),
    } satisfies PurchaseJoinedItem;
  });
}

export async function hasPurchasedPrompt(params: {
  profileId: string;
  promptId: string;
}): Promise<boolean> {
  const supabase = await createServerClient();
  const { count, error } = await supabase
    .from('purchases')
    .select('*', { count: 'exact', head: true })
    .eq('buyer_id', params.profileId)
    .eq('prompt_id', params.promptId);
  if (error) throw error;
  return (count ?? 0) > 0;
}
