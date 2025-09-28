'use client';

import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <SignUp routing="path" path="/auth/register" signInUrl="/auth/login" />
    </div>
  );
}
