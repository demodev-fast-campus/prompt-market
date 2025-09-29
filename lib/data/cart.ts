import { createServerClient } from '@/lib/supabase/client';
import { getCurrentUserProfileId } from './user';

export async function getCartCountByProfileId(
  profileId: string,
): Promise<number> {
  const supabase = await createServerClient();
  const { count, error } = await supabase
    .from('carts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profileId);
  if (error) throw error;
  return count ?? 0;
}

export async function getCartCount() {
  const profileId = await getCurrentUserProfileId();
  if (!profileId) return 0;
  return await getCartCountByProfileId(profileId);
}
