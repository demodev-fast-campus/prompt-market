'use client';

import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <SignIn routing="path" path="/auth/login" signUpUrl="/auth/register" />
    </div>
  );
}
