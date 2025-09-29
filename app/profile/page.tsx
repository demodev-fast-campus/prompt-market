import { Header } from '@/components/header';
import { auth } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const { userId } = await auth();

  return (
    <div>
      <Header />
      <pre>{JSON.stringify({ userId }, null, 2)}</pre>
    </div>
  );
}
