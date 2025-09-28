# Supabase 연동 가이드

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 다음 값을 입력하세요.

```
NEXT_PUBLIC_SUPABASE_URL=프로젝트_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_키
```

## 클라이언트 생성 유틸리티

`@supabase/supabase-js`, `@supabase/ssr` 패키지를 설치한 뒤 `utils/supabase` 디렉터리에 서버/클라이언트 전용 생성 함수를 정의했습니다.

- `utils/supabase/client.ts`: 브라우저에서 사용할 Supabase 클라이언트
- `utils/supabase/server.ts`: 서버 컴포넌트, 서버 액션, 라우트 핸들러에서 사용할 클라이언트
- `utils/supabase/middleware.ts`: 세션 자동 갱신을 위한 미들웨어 헬퍼

각 함수는 환경 변수 미설정 시 명확한 에러를 throw 하므로 배포 전 값이 올바르게 채워졌는지 확인하세요.

## 인증 세션 동기화

- `middleware.ts`에서 Supabase 세션을 갱신한 뒤 기존 언어 감지 쿠키 로직을 그대로 유지합니다.
- 헤더 컴포넌트는 Supabase 세션을 기반으로 로그인 상태를 판별하고, 로그아웃 시 `supabase.auth.signOut({ scope: 'global' })`로 세션을 정리합니다.

## 로그인/회원가입 페이지

- `app/auth/login/page.tsx`: 이메일/비밀번호 로그인과 OAuth(Google, Kakao) 로그인을 Supabase Auth로 전환했습니다.
- 회원가입 페이지는 현재 목업 상태이며, 추후 Supabase `signUp` API로 교체가 필요합니다.

## 추후 과제

- Supabase 프로필(`profiles` 테이블)과 UI를 연결해 실제 사용자 정보를 표시
- 장바구니/구매 내역 등 목업 데이터를 Supabase 데이터로 대체
- Supabase Row Level Security 정책 및 Edge Function, Webhook 구성
