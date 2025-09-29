import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// 서버 컴포넌트, 서버 액션, 라우트 핸들러에서 사용
export const createServerClient = async () => {
  const { getToken, sessionId } = auth() as unknown as {
    getToken?: (args: { template: string }) => Promise<string | null>;
    sessionId?: string | null;
  };

  let supabaseToken: string | null = null;

  if (typeof getToken === 'function') {
    supabaseToken = await getToken({ template: 'supabase' });
  } else if (sessionId) {
    try {
      const { token } = await clerkClient.sessions.getToken({
        sessionId,
        template: 'supabase',
      });
      supabaseToken = token ?? null;
    } catch {
      supabaseToken = null;
    }
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: supabaseToken
          ? { Authorization: `Bearer ${supabaseToken}` }
          : {},
      },
    },
  );
};
