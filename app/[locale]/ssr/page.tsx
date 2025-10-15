import { createServerSupabaseClient } from '@/lib/supabase/with-clerk-server';

export default async function SsrTasksPage() {
  const client = createServerSupabaseClient();
  const { data, error } = await client.from('tasks').select();
  if (error) {
    return <pre>{JSON.stringify({ error: error.message }, null, 2)}</pre>;
  }
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
