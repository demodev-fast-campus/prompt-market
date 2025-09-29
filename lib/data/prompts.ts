import { createServerClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/supabase';

export type PromptListItem = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail?: string | null;
  tags?: string[] | null;
  rating?: number | null;
  reviewCount?: number | null;
};

function mapRowToListItem(row: Tables<'prompts'>): PromptListItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    thumbnail:
      Array.isArray(row.image_urls) && row.image_urls.length > 0
        ? row.image_urls[0]
        : null,
    tags: row.tags,
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
  };
}

export async function getPrompts(options?: {
  limit?: number;
  search?: string;
  sort?: 'latest' | 'price' | 'rating';
}): Promise<PromptListItem[]> {
  const supabase = await createServerClient();
  let query = supabase.from('prompts').select('*').eq('is_published', true);

  if (options?.search) {
    // Simple ILIKE on title/description
    query = query.or(
      `title.ilike.%${options.search}%,description.ilike.%${options.search}%`,
    );
  }

  switch (options?.sort) {
    case 'price':
      query = query.order('price', { ascending: true });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapRowToListItem);
}

export type PromptDetail = Tables<'prompts'>;

export async function getPromptById(id: string): Promise<PromptDetail | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
