# 리서치 결과

- **문서 범위**: PRD는 as-is(현재 구현)와 to-be(가까운 목표 상태)로 분리하여 정리. 기술 스펙은 별도 기술 구현 문서로 분리.
- **비즈니스 모델**: 단일 판매자(운영자만 상품 등록). 판매 희망자는 웨이팅 리스트 페이지에서 신청 정보 제출.
- **플랫폼/스택**: Next.js 14(App Router), Tailwind, Radix 기반 UI, 현재는 목업 데이터. 백엔드는 Supabase를 실제 사용.
- **결제**: 토스페이먼츠 확정. 가격·합계는 서버가 DB에서 조회·계산.
- **장바구니/구매 정책**: 디지털 상품 특성상 수량·쿠폰 제거. 결제 성공 시 장바구니 정리 및 구매 레코드 생성(트랜잭션).
- **콘텐츠 접근 제어**: 미구매 시 프롬프트 본문 마스킹 유지. 구매 후 본문 열람/복사 가능. 파일 다운로드도 병행.
- **네이밍/라우팅 표준**: 현재 구현과 문서를 표준으로 일치.
  - 홈(랜딩): `/`
  - 프롬프트 목록: `/prompts`
  - 프롬프트 상세: `/prompt/[id]`
  - 장바구니: `/cart`
  - 구매 내역: `/purchase-history` (이전 `/my-page` 명칭 사용 금지)
  - 프로필: `/profile` (구매자 전용)
  - 관리자: `/admin/prompts`
  - 판매자 웨이팅 리스트: `/seller/waitlist`
- **관리자 정책**: 프롬프트 심사/승인 프로세스 삭제. 운영자 직권으로 등록/수정/삭제.
- **데이터 스키마(요약)**: `profiles`, `prompts`, `carts`, `purchases` 중심으로 단순화. 메타 필드(평점, 리뷰수, 태그, 조회/다운로드 수 등) 포함.

# 실행 계획

## 1) 문서 정비

- `docs/PRD.md`를 as-is/to-be 구조로 동기화하고 표준 라우팅/네이밍 반영.
- 기술 세부 스펙은 별도 문서로 분리(예: `docs/TECH-SPEC.md`, 후속 작업 범위).

## 2) Supabase 통합(단계적)

- 프로젝트 연결 및 환경변수 설정: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 등.
- 인증 연동: 이메일/소셜(Optional). 세션 기반 클라이언트 사용.
- 트리거: `auth.users` 삽입 시 `profiles` 자동 생성.
- 스키마 생성(요약):
  - `profiles(id uuid pk, nickname text, avatar_url text, updated_at timestamptz)`
  - `prompts(id uuid pk, created_at timestamptz, title text, description text, price int, prompt_text text, image_urls text[], tags text[], rating numeric default 0, review_count int default 0, download_count int default 0, view_count int default 0, file_url text null, is_published boolean default true)`
  - `carts(id bigint pk, created_at timestamptz, user_id uuid, prompt_id uuid, unique(user_id, prompt_id))`
  - `purchases(id uuid pk, created_at timestamptz, buyer_id uuid, prompt_id uuid, payment_order_id text unique)`
  - `seller_waitlist(id uuid pk, created_at timestamptz, name text, email text, portfolio_url text, categories text[], message text, processed boolean default false)`
- RLS(행 수준 보안):
  - `profiles`: 본인 읽기/수정 허용
  - `carts`: 본인 소유만 CRUD
  - `purchases`: 본인 소유만 조회, 운영자 전체 조회
  - `prompts`: 공개 리스트 조회 허용, 쓰기는 운영자만
  - `seller_waitlist`: 운영자만 조회

## 3) 데이터 연동 작업

- 홈/목록/상세에서 목업 제거 → Supabase 쿼리로 대체.
- 장바구니: 수량·쿠폰 제거. `unique(user_id, prompt_id)`로 중복 방지. UI 비활성 처리.
- 상세 페이지: 구매 여부 조회(`purchases`)로 마스킹 제어. 구매자에게 `prompt_text`/다운로드 노출.
- 프로필: 구매자 전용 필드만 유지(이메일 읽기전용, 닉네임/아바타 편집). 판매자 통계 UI 제거.
- 관리자: 승인 탭/상태 제거. 등록/수정/삭제 및 간단한 통계 정도만 유지.
- 판매자 웨이팅 리스트 페이지 신설(`/seller/waitlist`): 신청 폼 → `seller_waitlist` insert.

## 4) 결제 연동(토스페이먼츠)

- 결제 흐름:
  1. 서버에서 유저의 `carts` 조회 → 합계 계산 → 결제 위젯/결제창 요청 파라미터 생성(주문 ID, 금액, 품목명)
  2. 결제 승인 Webhook 수신 시 트랜잭션 처리: `purchases` 다건 insert(장바구니 항목별), `carts` 비우기
  3. 승인 결과 클라이언트에 반영(구매 내역/상세 페이지 즉시 노출)
- 안전장치: 금액 서버 계산 고정, 주문 ID 멱등 처리, 서명 검증, 실패 시 롤백.

## 5) 라우팅/UX 정리

- 링크 표준화: 헤더 드롭다운의 ‘구매 내역’ 링크를 `/purchase-history`로 고정. ‘판매자 되기’는 `/seller/waitlist`로.
- 목록/상세/장바구니: 디지털 상품에 맞춘 간결한 플로우 유지. 다건 구매는 가능하되 수량 개념 없음.

## 6) QA 체크리스트

- 비로그인 사용자의 장바구니/구매 버튼 동작(로그인 유도)
- 장바구니 중복 담기 방지 및 상태 동기화
- 결제 성공/실패/중복 승인 시나리오
- 구매 후 상세 페이지 마스킹 해제 및 다운로드 접근 제어
- 프로필 편집(닉네임/아바타) 정상 반영
- 관리자 CRUD, 웨이팅 리스트 저장/조회

## 7) 마이그레이션/정리

- 기존 문서의 `/my-page` 표기 제거 → `/purchase-history`로 통일
- 관리자 승인/거부 문구/상태 제거
- 장바구니 수량/쿠폰 UI 제거 계획 명시

## 8) 일정(권장)

- 주 1: 스키마/RLS/트리거, 인증, 목록/상세 read 연동, 장바구니 write 연동
- 주 2: 결제 서버/웹훅, 구매 트랜잭션, 마스킹/다운로드 접근 제어
- 주 3: 프로필 편집, 관리자 CRUD, 웨이팅 리스트 페이지, QA/하드닝

# 리스크 & 대응

- **결제 무결성**: 서버 합계 고정, 멱등 키/주문 ID 관리, 웹훅 서명 검증.
- **경합/중복 결제**: 트랜잭션, 고유 `payment_order_id` 제약, 재시도 정책.
- **콘텐츠 유출**: 마스킹 전 구매 검증, 다운로드 URL 서명/만료(스토리지 서명 URL), RLS로 데이터 보호.
- **성능/비용**: 목록 쿼리 인덱스, 이미지 CDN/리사이즈, 지표 카운트는 배치/증분 집계 고려.
- **개인정보/법무**: 약관/개인정보 고지 최신화, 결제/영수증 정책 반영, 청약철회 예외 조항(디지털 상품) 명시.
- **운영 워크플로**: 웨이팅 리스트 수집 후 수동 온보딩 프로세스 문서화.
