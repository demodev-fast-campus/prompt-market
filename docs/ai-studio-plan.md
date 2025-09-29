안녕하세요! 현재 프로젝트를 분석하고 Supabase와 Clerk 통합 과정에서 발생하는 문제들을 해결하기 위한 명확하고 단순한 구조를 제안해 드리겠습니다.

프로젝트 전체를 살펴보니, 인증(Clerk)과 데이터(Supabase)를 분리하려는 좋은 시도가 보이지만, 두 시스템을 연결하는 과정과 Next.js App Router의 특성이 겹치면서 복잡성과 에러가 발생한 것으로 보입니다.

가장 큰 문제는 **"Supabase가 현재 로그인한 Clerk 사용자가 누구인지 알 수 있는 명확한 방법이 없다"**는 것입니다. 이를 해결하는 것이 핵심입니다.

아래에 모범 사례를 기반으로 프로젝트 구조를 단순화하고 문제를 해결하는 단계별 계획을 정리했습니다.

### 문제의 핵심 원인 분석

1.  **인증 시스템 혼재**: 코드 곳곳에 Supabase 자체 인증(`signInWithPassword`) 로직과 Clerk 인증 로직(`useUser`, `clerkMiddleware`)이 섞여 있습니다. **Clerk를 단일 인증 소스로 사용**하고 Supabase는 데이터베이스 역할에만 집중시켜야 합니다.
2.  **잘못된 미들웨어 구성**: `middleware.ts`에서 `clerkMiddleware`와 `next-intl`의 통합 방식이 Clerk의 세션 감지를 방해하여 `auth() was called...` 에러를 유발합니다.
3.  **Supabase 클라이언트 설정 오류**: 서버 컴포넌트나 API 라우트에서 Supabase 클라이언트를 생성할 때, 현재 로그인한 Clerk 사용자의 인증 토큰(JWT)을 전달하지 않고 있습니다. 이 때문에 RLS(행 수준 보안) 정책이 동작하지 않아 모든 사용자의 데이터가 보이거나 접근이 거부됩니다.
4.  **불필요한 복잡성**: Supabase 클라이언트를 만드는 파일이 여러 개(`client.ts`, `server.ts`, `middleware.ts`)로 나뉘어 있어 혼란을 유발합니다. 이를 단순화할 필요가 있습니다.

---

### 해결을 위한 단계별 실행 계획

아래 단계를 따라 프로젝트를 재구성하면 대부분의 에러가 해결되고, 유지보수가 훨씬 쉬워집니다.

#### 1단계: 인증 흐름을 Clerk으로 통일하기

가장 먼저 Supabase Auth 관련 코드를 모두 제거하고 Clerk의 컴포넌트를 사용해 UI를 단순화합니다.

- `app/auth/login/page.tsx`와 `app/auth/register/page.tsx`를 아래와 같이 Clerk의 내장 UI 컴포넌트를 사용하도록 변경하세요. 기존의 복잡한 폼 로직이 모두 사라집니다.

  **`app/auth/login/page.tsx`**

  ```typescriptreact
  'use client';
  import { SignIn } from '@clerk/nextjs';

  export default function LoginPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SignIn routing="path" path="/auth/login" signUpUrl="/auth/register" />
      </div>
    );
  }
  ```

  **`app/auth/register/page.tsx`**

  ```typescriptreact
  'use client';
  import { SignUp } from '@clerk/nextjs';

  export default function RegisterPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SignUp routing="path" path="/auth/register" signInUrl="/auth/login" />
      </div>
    );
  }
  ```

- `components/header.tsx`에서 로그인/로그아웃 버튼을 Clerk의 `SignedIn`, `SignedOut`, `UserButton`으로 교체합니다. 이렇게 하면 세션 상태를 직접 관리할 필요가 없습니다.

  **`components/header.tsx` (주요 변경 부분)**

  ```typescriptreact
  import { SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs';

  // ... nav 내부 ...
  <SignedIn>
    {/* 로그인 시 보여줄 UI (장바구니 아이콘, UserButton 등) */}
    <UserButton afterSignOutUrl="/" />
  </SignedIn>
  <SignedOut>
    {/* 로그아웃 시 보여줄 UI */}
    <SignInButton mode="modal">
      <Button variant="ghost">{t('nav.login')}</Button>
    </SignInButton>
    <SignUpButton mode="modal">
      <Button>{t('nav.signup')}</Button>
    </SignUpButton>
  </SignedOut>
  ```

#### 2단계: 미들웨어(Middleware) 재구성

Clerk과 `next-intl` 미들웨어를 올바르게 통합합니다. `clerkMiddleware`가 `next-intl`을 감싸는 구조여야 합니다.

**`middleware.ts` (전체 교체)**

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// 공개 라우트 설정 (로그인 없이 접근 가능)
const isPublicRoute = createRouteMatcher([
  '/',
  '/prompts',
  '/prompt/(.*)',
  '/auth(.*)',
  '/api(.*)',
  '/(ko|en)(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // 공개 라우트가 아니면 로그인 페이지로 리디렉션
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  // i18n 라우팅 처리
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

#### 3단계: Supabase-Clerk 연동 클라이언트 생성

서버 환경에서 Clerk 인증 토큰을 Supabase 클라이언트에 주입하는 헬퍼 함수를 만듭니다. 이것이 이번 리팩터링의 핵심입니다.

- 기존 `utils/supabase` 폴더의 내용을 모두 지우고 아래 파일들로 교체합니다.

  **`lib/supabase/client.ts` (신규 생성 또는 대체)**

  ```typescript
  import { auth } from '@clerk/nextjs/server';
  import { createClient } from '@supabase/supabase-js';
  import type { Database } from '@/types/supabase';

  // 서버 컴포넌트, 서버 액션, API 라우트에서 사용
  export const createServerClient = async () => {
    const { getToken } = auth();
    const supabaseToken = await getToken({ template: 'supabase' });

    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${supabaseToken}`,
          },
        },
      },
    );
  };
  ```

  **참고:** 위 코드가 동작하려면 Clerk 대시보드 > JWT Templates에서 Supabase 템플릿을 생성해야 합니다.

#### 4단계: 데이터베이스 스키마 및 데이터 조회 로직 수정

`profiles` 테이블을 Clerk ID와 연결하고, 모든 데이터 조회 함수가 Clerk 사용자 기반으로 동작하도록 수정합니다.

- **`profiles` 테이블 스키마 수정**: `supabase/migrations/..._db.sql` 파일에서 `profiles` 테이블의 `id`가 `auth.users.id`를 참조하는 제약조건을 제거하고, `clerk_id`를 `UNIQUE`로 설정합니다.

  ```sql
  -- 기존 profiles_id_fkey FK 제약 제거
  ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
  -- clerk_id를 TEXT UNIQUE NOT NULL로 설정
  -- ALTER TABLE public.profiles ALTER COLUMN clerk_id SET NOT NULL;
  -- CREATE UNIQUE INDEX IF NOT EXISTS profiles_clerk_id_key ON public.profiles(clerk_id);
  ```

- **데이터 조회 함수 수정**: `lib/data/*.ts`의 함수들이 Clerk `userId`를 받아 Supabase에서 데이터를 조회하도록 변경합니다.

  **`lib/data/user.ts` (예시)**

  ```typescript
  import { auth } from '@clerk/nextjs/server';
  import { createServerClient } from '@/lib/supabase/client'; // 새로 만든 클라이언트 사용

  // Clerk ID로 Supabase 프로필 ID 조회
  export async function getProfileIdByClerkId(
    clerkId: string,
  ): Promise<string | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();
    if (error) return null;
    return data.id;
  }

  // 현재 로그인한 사용자의 프로필 ID를 가져오는 헬퍼
  export async function getCurrentUserProfileId() {
    const { userId } = auth();
    if (!userId) return null;
    return await getProfileIdByClerkId(userId);
  }
  ```

  **`lib/data/cart.ts` (수정 예시)**

  ```typescript
  import { createServerClient } from '@/lib/supabase/client';
  import { getCurrentUserProfileId } from './user';

  export async function getCartCount() {
    const profileId = await getCurrentUserProfileId();
    if (!profileId) return 0;

    const supabase = await createServerClient();
    const { count, error } = await supabase
      .from('carts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profileId);

    if (error) throw error;
    return count ?? 0;
  }
  ```

### 요약 및 권장 사항

1.  **환경 변수 통일**: `.env.local` 파일에 Clerk과 Supabase 키를 모두 명확히 기재하세요.

    ```
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
    CLERK_SECRET_KEY=...

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ```

2.  **서버 재시작**: 미들웨어와 환경 변수 변경 후에는 반드시 개발 서버를 완전히 종료(`Ctrl+C`)했다가 다시 시작(`pnpm dev`)해야 합니다.
3.  **Clerk 대시보드 설정**: Supabase JWT 템플릿을 생성하는 것을 잊지 마세요.

이 구조로 변경하면 에러가 해결되고, Clerk의 강력한 인증 기능과 Supabase의 유연한 데이터베이스를 안전하고 효율적으로 함께 사용할 수 있습니다.

제가 직접 이 변경사항들을 적용해 드릴까요?
