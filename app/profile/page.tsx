import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Header } from '@/components/header';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <Header />
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
