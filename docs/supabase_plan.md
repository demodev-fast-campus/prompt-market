지금부터 “목업 → Supabase 연동” 전환 계획을 단계별로 정리합니다. 각 단계는 작은 PR/커밋 단위로 쪼갤 수 있게 설계했어요.

### 0) 사전 정리(스키마/인증 브리지)

- 프로필 FK 정리: `profiles.id → auth.users.id` FK 제거, `profiles.id`는 자체 `uuid` PK 유지. `clerk_id`는 `unique`로 유지.
- 유저 식별 전략: Clerk `userId`로 `profiles.clerk_id`를 조회하고, 없으면 서버에서 `profiles`에 upsert.
- 시드 상태: `prompts`는 이미 시드됨. 이후 페이지들이 바로 Supabase 조회 가능.

### 1) 공용 유틸/타입/클라이언트

- `utils/supabase/server.ts` 그대로 사용. 페이지/서버 액션은 모두 서버에서 Supabase 호출.
- `types/supabase.ts` 적용: 쿼리/insert/update 타입 안정성 확보.
- 공용 데이터 접근 헬퍼 추가:
  - `lib/data/prompts.ts`: `getPrompts({ q, category, sort, page, pageSize })`, `getPromptById(id)`
  - `lib/data/user.ts`: `ensureProfile({ clerkId, email })`, `getProfileByClerkId(clerkId)`
  - `lib/data/cart.ts`: `getCart(userProfileId)`, `addToCart(userProfileId, promptId)`, `removeFromCart(...)`, `clearCart(...)`
  - `lib/data/purchases.ts`: `getPurchases(userProfileId)`

### 2) 헤더 배지(장바구니 개수)

- 서버 컴포넌트 경로에서 Clerk `userId` → `profiles.id` 조회 → `carts` 카운트 fetch → `Header cartItemCount`에 전달.
- 추후 실시간은 선택: `revalidateTag('cart')` 기반 서버 액션/뮤테이션 후 카운트 갱신.

### 3) 목록 페이지(`/prompts`)

- ‘use client’ 제거 → 서버 컴포넌트 전환.
- Supabase에서 `prompts` 페이징/검색/정렬 쿼리:
  - 검색: `title`/`description` ILIKE
  - 카테고리: `tags` 또는 별도 컬럼 기준
  - 정렬: `rating`/`created_at`/`price` 등
- 결과를 `PromptCard`에 전달(카드 자체는 그대로 사용 가능).
- 즐겨찾기(로컬스토리지) 유지 or 제거: v1은 제거 권장(서버 구현 전). 유지 시 기능 플래그로 임시 남김.

### 4) 상세 페이지(`/prompt/[id]`)

- 서버에서 `prompts` 단건 + 로그인 사용자 구매 여부(`purchases`에서 `prompt_id` 존재 여부) 함께 조회.
- 구매 O: `prompt_text`/다운로드 버튼 노출.
- 구매 X: 본문 마스킹, ‘장바구니 담기’/‘바로 구매’ 노출.
- 이미지/메타는 DB 값 사용.

### 5) 장바구니 페이지(`/cart`)

- 서버에서 `carts` join `prompts`로 목록 조회.
- 액션은 서버 액션으로 전환:
  - `addToCart(promptId)`: `unique(user_id, prompt_id)` 보장
  - `removeFromCart(promptId)`, `clearCart()`
- 가격 합계는 서버 계산 결과 표시. 결제는 다음 단계(토스페이).

### 6) 구매 내역(`/purchase-history`)

- 서버에서 `purchases` join `prompts`로 목록/합계 조회.
- 다운로드 버튼은 v1에서 placeholder, v2에서 서명 URL 제공.

### 7) 프로필(`/profile`)

- Clerk `userId` → `profiles` upsert/조회 후 화면에 표시(닉네임/아바타 편집은 v2).

### 8) 관리자(`/admin/prompts`)

- 운영자 가드(Clerk role/whitelist) 적용.
- 목록: Supabase `prompts` 조회.
- 등록/수정/삭제: 서버 액션으로 `insert/update/delete`.
- 승인 프로세스는 없음(기획 준수).

### 9) 판매자 웨이팅 리스트(`/seller/waitlist`)

- 로컬스토리지 제거.
- 서버 액션으로 `seller_waitlist` insert.
- 완료 토스트/상태 UI 유지.

### 10) 보안/RLS(2차)

- v2에서 RLS 활성화 및 정책 적용:
  - `prompts`: 공개 읽기
  - `carts`: `user_id = auth.uid()`(Clerk 연동 시에는 서비스 로직으로 보호하거나 JWT 커스텀 클레임 전략)
  - `purchases`: 본인만 조회
  - `seller_waitlist`: 운영자만 조회/처리
- 당장은 서버 전용 호출로 보호하고, 익명키 노출 없이 서버에서만 쓰기 수행.

### 11) 마이그레이션(스키마 조정) 계획

- `profiles.id` FK 제거:
  - `alter table public.profiles drop constraint profiles_id_fkey;`
- 필요 시 인덱스/제약:
  - `create unique index if not exists carts_user_prompt_unique on public.carts(user_id, prompt_id);` (혹은 constraint 명시)
  - 검색 최적화 인덱스: `prompts(title)`, `prompts(created_at)`, `prompts(price)`, `gin(prompts.tags)`
- 추후 RLS 정책 마이그레이션 별도 배포.

### 12) 단계별 머지/배포 순서

1. 스키마 FK 제거 마이그레이션 → `ensureProfile` 유틸 추가
2. 헤더 배지 Supabase 연동
3. `/prompts` 서버 컴포넌트화 + 쿼리
4. `/prompt/[id]` 구매여부 연동
5. `/cart` 서버 액션 전환
6. `/purchase-history` 연동
7. `/seller/waitlist` 서버 액션 전환
8. `/admin/prompts` CRUD 전환
9. RLS 적용(2차) + 결제 연동(토스페이)(3차)
