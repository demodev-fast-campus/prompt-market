import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';

export function useClerkSupabaseClient() {
  const { session } = useSession();

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      async accessToken() {
        return (await session?.getToken()) ?? null;
      },
    },
  );

  return client;
}
