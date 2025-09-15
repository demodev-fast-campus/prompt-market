# [PRD] 프롬프트 스토어 "Prompt Market"

## 1. 서비스 컨셉 및 모델

- **컨셉:** 운영자가 등록한 디지털 AI 프롬프트를 사용자가 장바구니에 담아 결제하고, 구매 후 본문 열람/복사 및 파일 다운로드를 제공하는 온라인 상점. 판매 희망자는 웨이팅 리스트에 정보를 등록한다.
- **사용자 역할:**
  - **관리자 (Admin):** 유일한 판매자. 관리자 화면을 통해 상품(프롬프트)을 등록/관리.
  - **사용자 (User):** 회원가입 후 프롬프트를 탐색·장바구니·구매하고, 자신의 프로필을 관리하는 소비자.
- **네이밍/라우팅 표준(통일):**
  - 홈(랜딩): `/`
  - 프롬프트 목록: `/prompts`
  - 프롬프트 상세: `/prompt/[id]`
  - 장바구니: `/cart`
  - 구매 내역: `/purchase-history` (이전 `/my-page` 사용 금지)
  - 프로필(구매자 전용): `/profile`
  - 관리자: `/admin/prompts`
  - 판매자 웨이팅 리스트: `/seller/waitlist`

> 문서는 as-is(현 구현)과 to-be(가까운 목표 상태)로 나누어 명세한다. 기술 상세 스펙은 별도 기술 문서로 분리한다.

---

## 2. 상세 화면 명세서 (Screen Specifications)

### 2.1. 헤더 (공통)

- **역할:** 전역 내비게이션, 검색, 사용자 상태/장바구니 진입 제공.
- **공통:** 로고 클릭 시 `/` 이동.
- **as-is:**
  - 검색 입력 UI가 존재하나 실제 검색 API 연동 없음(목업).
  - 로그인 상태는 로컬 상태로 토글. 드롭다운: `내 프로필(/profile)`, `프롬프트 관리(/admin/prompts)`, `구매 내역(/purchase-history)`, 로그아웃.
  - 장바구니 아이콘: 로컬 상태 카운트 표시.
- **to-be:**
  - 로그인 연동(Supabase Auth). 사용자 상태 기반 드롭다운.
  - 장바구니 배지: `carts` 테이블 실시간/주기 동기화로 개수 표시.
  - 헤더/모바일 메뉴 내 링크는 위 표준 라우팅을 준수.

---

### 2.2. 홈(랜딩) 페이지(`/`)

- **역할:** 서비스 가치 제안, 인기 프롬프트 섹션, 목록으로의 진입 유도.
- **as-is:** 목업 데이터 기반 인기 프롬프트 그리드와 CTA 제공.
- **to-be:** `prompts` 테이블에서 인기/최신 정렬로 일부 노출, 전체 보기 → `/prompts`.

---

### 2.3. 프롬프트 목록 페이지(`/prompts`)

- **역할:** 판매 중 프롬프트 탐색/검색/필터링.
- **as-is:** 검색/카테고리/정렬 UI는 존재하나 목업 데이터 기반.
- **to-be:**
  - Supabase 쿼리 기반 페이지네이션/검색(제목/설명)/카테고리 필터/정렬(인기, 최신, 가격, 평점).
  - 카드(`PromptCard`): 대표 이미지, 제목, 가격, 카테고리 배지, 평점/리뷰수, 작성자, ‘장바구니 담기’, 즐겨찾기 토글.

---

### 2.4. 프롬프트 상세 페이지(`/prompt/[id]`)

- **역할:** 상품 상세 정보 제공 및 구매/장바구니 액션 유도.
- **데이터:** `prompts` 단건, 로그인 사용자의 `purchases`/`carts` 상태.
- **as-is:** 상세 설명/이미지 갤러리/리뷰 섹션/구매·장바구니 버튼 존재. 구매 여부에 따른 마스킹 로직은 비연동(목업).
- **to-be:**
  - 구매 완료 시: 구매 버튼 영역 제거. 마스킹 해제 → 실제 `prompt_text`와 ‘복사’ 버튼 + 파일 다운로드 버튼 노출.
  - 구매 전: 본문 마스킹(“구매 후 확인 가능”). ‘장바구니 담기’는 `carts` insert. ‘바로 구매하기’는 즉시 결제 플로우 시작.
  - 메타: 태그, 특징, 평점/리뷰수, 조회/다운로드 카운트 노출(읽기 전용).

---

### 2.5. 장바구니 페이지(`/cart`)

- **역할:** 구매 전 상품 최종 확인 및 결제 진입.
- **데이터:** 로그인 사용자의 `carts` + 연결된 `prompts`.
- **as-is:** 수량 변경, 쿠폰 입력, 선택 결제 UI 존재(목업). 결제 미연동.
- **to-be:**
  - 디지털 상품 특성상 ‘수량’ 제거, ‘쿠폰’ 제거. 각 상품은 1개 단위로만 담김(중복 담기 금지).
  - ‘총 N개의 상품’, ‘총 주문금액’ 표시. ‘결제하기’ 클릭 시 토스페이먼츠 결제창 호출.
  - 결제 승인 후 트랜잭션 처리: `purchases` 기록 생성 → `carts` 비우기.

---

### 2.6. 구매 내역 페이지(`/purchase-history`)

- **역할:** 사용자의 모든 구매 기록 확인, 다운로드/열람 진입.
- **as-is:** 목업 데이터 리스트, 다운로드 버튼은 동작 로그만 남김.
- **to-be:**
  - `purchases` 조인으로 목록 노출(제목/카테고리/가격/구매일/결제수단).
  - 각 항목에 대해: 상세로 이동, 프롬프트 본문 열람, 파일 다운로드(서명 URL) 제공.

---

### 2.7. 사용자 프로필 페이지(`/profile`)

- **역할:** 구매자 전용 프로필 정보 확인/수정.
- **as-is:** 판매자 통계/내 프롬프트 탭 등 판매자 UI 요소 포함(목업).
- **to-be:**
  - 이메일(읽기 전용), 닉네임, 아바타 업로드(스토리지) 편집.
  - 판매자 관련 탭(내 프롬프트/판매 현황) 제거. 구매자 중심 정보만 유지.

---

### 2.8. 관리자 페이지(`/admin/prompts`)

- **역할:** 운영자의 상품 CRUD 및 간단 통계.
- **as-is:** 승인/대기/거부 등 심사 상태 UI 존재(목업).
- **to-be:** 심사 프로세스 삭제. 운영자 직권 등록/수정/삭제 + 판매/조회 통계 요약만 노출.

---

### 2.9. 판매자 웨이팅 리스트 페이지(`/seller/waitlist`)

- **역할:** 판매자로 참여 희망하는 사용자의 정보 수집.
- **폼 필드(예시):** 이름, 이메일, 포트폴리오 URL, 관심 카테고리(다중), 자기소개/메시지.
- **동작:** 제출 시 `seller_waitlist` 테이블에 저장. 운영자만 조회/처리.

---

### 2.10. 정책/법무 페이지

- **경로:**
  - 이용약관: `/terms`
  - 개인정보처리방침: `/privacy`
- **비고:** 디지털 상품 특성에 따른 청약철회 예외 조항 및 결제/영수증 정책 명시.

---

## 3. 데이터베이스 스키마 (Supabase)

> 설명을 위한 기준 스키마. 실제 생성 시 RLS/인덱스/제약 포함 권장.

### `profiles` (사용자 프로필)

- `id` (uuid, PK, FK → `auth.users.id`)
- `nickname` (text)
- `avatar_url` (text, nullable)
- `updated_at` (timestamptz)

### `prompts` (상품)

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `title` (text)
- `description` (text)
- `price` (integer)
- `prompt_text` (text) // 실제 프롬프트 본문(구매 후 노출)
- `image_urls` (text[])
- `tags` (text[])
- `rating` (numeric, default 0)
- `review_count` (int, default 0)
- `download_count` (int, default 0)
- `view_count` (int, default 0)
- `file_url` (text, nullable) // 구매자용 다운로드 파일 경로
- `is_published` (boolean, default true)

### `carts` (장바구니)

- `id` (bigint, PK)
- `created_at` (timestamptz)
- `user_id` (uuid, FK → `auth.users.id`)
- `prompt_id` (uuid, FK → `prompts.id`)
- 제약: `unique(user_id, prompt_id)` (중복 담기 방지), 수량 필드 없음

### `purchases` (구매 기록)

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `buyer_id` (uuid, FK → `auth.users.id`)
- `prompt_id` (uuid, FK → `prompts.id`)
- `payment_order_id` (text, unique) // 토스페이먼츠 주문 ID

### `seller_waitlist` (판매자 웨이팅 리스트)

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `name` (text)
- `email` (text)
- `portfolio_url` (text)
- `categories` (text[])
- `message` (text)
- `processed` (boolean, default false)

### 트리거/보안(RLS) 권장

- 회원가입 트리거: `auth.users` 생성 시 `profiles` 자동 생성.
- RLS:
  - `profiles`: 본인만 읽기/수정
  - `carts`: 본인 소유만 CRUD
  - `purchases`: 본인만 조회, 운영자 전체 조회
  - `prompts`: 공개 읽기 허용, 쓰기는 운영자만
  - `seller_waitlist`: 운영자만 조회

---

## 4. 핵심 로직 구현 노트

- **장바구니 로직:**

  - 디지털 상품 수량/쿠폰 미지원. 동일 상품 중복 담기 금지(`unique(user_id, prompt_id)`).
  - 결제 성공 시, 구매된 상품에 대한 `purchases` 레코드 생성 후 해당 항목을 `carts`에서 삭제.
  - 이 과정은 트랜잭션으로 처리(멱등 보장).

- **결제 로직(토스페이먼츠):**

  - ‘결제하기’ 클릭 시 서버에서 유저의 `carts` 조회 → 금액 합산 후 주문 생성 파라미터 구성(주문 ID, 금액, 품목명).
  - 결제 승인 Webhook 수신 시: 주문 ID 검증, 서명 검증 → `purchases` insert(장바구니 항목별) → `carts` 비우기.
  - 클라이언트 금액은 신뢰하지 않음. 서버 계산 금액만 사용.

- **프롬프트 마스킹/접근 제어:**

  - 미구매 시 상세의 `prompt_text`/파일 다운로드 비공개. 구매 여부(`purchases`) 기준으로 노출.
  - 다운로드는 서명 URL(만료 시간) 사용 권장.

- **프로필/인증 분리:**

  - 인증은 Supabase `auth.users`. 부가 정보는 `profiles` 테이블 관리.
  - 트리거로 `profiles` 자동 생성 권장.

- **네이밍/라우팅 정합성:**

  - 문서와 구현 모두 `/purchase-history` 명칭으로 통일. `/my-page`는 사용하지 않음.
  - 관리자 심사 상태/프로세스 삭제. 운영자 직권 CRUD만 명세.

- **지표/메타 필드:**
  - `rating`, `review_count`, `view_count`, `download_count`는 읽기 전용 또는 배치/증분 집계 고려.

> 기술 스펙(SSR/캐시/상태관리/에러 처리/웹훅 보안 등) 상세는 별도 기술 문서에서 다룬다.
