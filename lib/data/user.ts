import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/client';

export async function getProfileIdByClerkId(
  clerkId: string,
): Promise<string | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', clerkId)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export async function ensureProfile(params: {
  clerkId: string;
  email?: string | null;
}): Promise<string> {
  const existing = await getProfileIdByClerkId(params.clerkId);
  if (existing) return existing;
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .insert({ clerk_id: params.clerkId, email: params.email ?? null })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function getCurrentUserProfileId() {
  const { userId } = auth();
  if (!userId) return null;
  return await getProfileIdByClerkId(userId);
}
