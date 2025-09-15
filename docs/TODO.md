# TODO

## P0

- [x] 헤더 UX 완성(로그인/드롭다운/장바구니 배지 목업)

  - Acceptance: 로그인 토글·드롭다운 동작, 배지 카운트 localStorage 반영
  - Notes: LocalStorage로 사용자/카트 수 동기화

- [x] 프롬프트 목록 페이지 목업 고도화

  - Acceptance: 검색/카테고리/정렬 동작, 클라이언트 페이지네이션 제공
  - Notes: Mock 데이터 기반 필터/정렬/페이지네이션

- [x] 프롬프트 상세 마스킹/버튼 상태

  - Acceptance: 미구매 시 마스킹·구매/장바구니 버튼, 구매 후 본문/복사/다운로드 표시
  - Notes: LocalStorage `purchases`로 구매 여부 판정

- [x] 장바구니 정책 반영(UI 정합화)

  - Acceptance: 수량·쿠폰 제거, 중복 담기 방지, 총 N개/총 금액 표시
  - Notes: LocalStorage 카트 스키마 저장

- [x] 결제 플로우 더미 구현

  - Acceptance: 결제하기 클릭 시 성공 시뮬레이션 → `purchases` 이동·`cart` 비우기
  - Notes: 백엔드 없이 로컬 상태/LocalStorage 전이

- [x] 구매 내역 페이지 UX 완성

  - Acceptance: purchases에서 아이템 렌더, 다운로드 버튼 동작 로그
  - Notes: LocalStorage에서 읽기

- [x] 프로필 페이지 구매자 전용 슬림화

  - Acceptance: 판매자 탭 제거, 이메일 읽기 전용·닉네임/아바타 로컬 편집 가능
  - Notes: Mock 사용자/로컬 업로드(보관 생략)

- [x] 관리자 페이지 정책 반영(심사 제거)

  - Acceptance: 승인/대기/거부 UI 제거, CRUD 폼/리스트 목업 동작
  - Notes: LocalStorage에 `prompts` CRUD

- [x] 판매자 웨이팅 리스트 폼

  - Acceptance: 제출 시 로컬 컬렉션 저장, 성공 토스트 표시
  - Notes: LocalStorage `seller_waitlist`

- [x] 네이밍/라우팅 정합성 점검

  - Acceptance: 모든 링크가 `/purchase-history` 사용
  - Notes: 코드 전역 링크 교정

- [x] 홈(랜딩) 인기/최신 섹션 목업
  - Acceptance: 인기/최신 카드 일부 노출, 전체보기 이동
  - Notes: Mock 데이터

### 에러

- [x] 로그인 이후 프로필 아이콘을 눌렀을 때 아무 메뉴가 나오질 않음
- [x] 홈 페이지 '판매자 되기' 버튼을 눌렀을 때 판매자 웨이팅 리스트 페이지로 이동하지 않음
- [x] 프롬프트 목록 카드에 하트를 누르고 새로고침 했을 때 하트가 사라짐 -> 데이터가 저장이 안됨
- [x] 이미 장바구니에 넣은 프롬프트를 또 장바구니에 넣으려고 하면 토스트 알림으로 '이미 장바구니에 있습니다.' 라고 나오게 하고 싶음
- [x] 장바구니 페이지에서 개수는 볼 수도 변경도 안되는데 +- 버튼이 존재함. 지워줘

## P1

- [ ] Supabase 세팅 및 환경변수 구성

  - Acceptance: `@supabase/supabase-js` 설치, 클라이언트 헬퍼 추가, env 로딩
  - Notes: pnpm 사용, `lib/supabase/{client,server}.ts`

- [ ] DB 스키마/RLS/트리거 구축

  - Acceptance: PRD 스키마 생성·`profiles` 자동 생성 트리거·RLS 정책 적용
  - Notes: `profiles/prompts/carts/purchases/seller_waitlist`

- [ ] Auth 연동(로그인/회원가입/비번찾기)

  - Acceptance: 이메일 로그인/가입/리셋 동작, 세션 반영
  - Notes: Supabase Auth

- [ ] 헤더 사용자/장바구니 배지 실시간 동기화

  - Acceptance: 로그인 시 carts 수 표시(실시간/주기)
  - Notes: Supabase `carts` 구독 또는 폴링

- [ ] 프롬프트 목록 Supabase 연동

  - Acceptance: 검색/필터/정렬/페이지네이션이 서버 데이터로 동작
  - Notes: RSC/쿼리 최적화

- [ ] 프롬프트 상세 마스킹/구매 판정

  - Acceptance: `purchases` 기반 마스킹, 구매 시 `prompt_text`/서명 URL 다운로드 제공
  - Notes: RLS/Storage 권한 고려

- [ ] 장바구니 연동 및 upsert

  - Acceptance: `unique(user_id,prompt_id)` 준수 담기/삭제
  - Notes: 서버 액션 또는 API 라우트

- [ ] 서버 금액 계산/주문 생성 API

  - Acceptance: carts 합산 금액/품목명/주문ID 생성
  - Notes: 클라이언트 금액 불신

- [ ] 토스페이먼츠 결제 연동

  - Acceptance: 결제창 호출→승인 Webhook 서명 검증→`purchases` insert→`carts` 비우기
  - Notes: 멱등 트랜잭션 처리

- [ ] 구매 내역 조인 목록/다운로드

  - Acceptance: purchases join 목록, 각 항목 서명 URL 다운로드
  - Notes: Supabase Storage 서명 URL

- [ ] 프로필 연동(닉네임/아바타)

  - Acceptance: `profiles` 읽기/수정, 아바타 업로드 동작
  - Notes: Storage 업로드/퍼미션

- [ ] 관리자 `prompts` CRUD

  - Acceptance: 운영자 전용 생성/수정/삭제, 간단 통계 요약
  - Notes: 서비스 롤/Edge Function로 권한 제어

- [ ] 판매자 웨이팅 리스트 테이블 저장

  - Acceptance: 폼 제출 시 `seller_waitlist` insert
  - Notes: 운영자 조회 가능

- [ ] 네이밍/라우팅 최종 점검
  - Acceptance: `/purchase-history` 일관성, 구 경로 제거
  - Notes: 링크/리다이렉트 검사

## P2

- [ ] 성능 최적화(홈/목록/상세)

  - Acceptance: 이미지 최적화, Suspense/Streaming, Web Vitals 개선
  - Notes: 캐시 정책/ISR 검토

- [ ] 에러 처리/토스트/리트라이 정책

  - Acceptance: API 오류 표준 핸들링·토스트·재시도 로직
  - Notes: 전역 에러 바운더리

- [ ] SEO/OG 태그/사이트맵

  - Acceptance: 메타/OG 구성, sitemap/robots 제공
  - Notes: Next Metadata API

- [ ] 모니터링/로그/세션 리플레이

  - Acceptance: 주요 이벤트 로깅/에러 수집 대시보드
  - Notes: Sentry/Logtail 등

- [ ] E2E/통합 테스트

  - Acceptance: 핵심 플로우(CRUD/구매) 자동화 테스트 통과
  - Notes: Playwright/Vitest

- [ ] CI/CD 및 환경 분리

  - Acceptance: PR 미리보기/배포 자동화, env 분리
  - Notes: Vercel/GitHub Actions

- [ ] 접근성/모바일 최적화

  - Acceptance: 키보드 내비/명도 대비/반응형 점검
  - Notes: a11y 린트

- [ ] 즐겨찾기/리뷰/평점 기능

  - Acceptance: 즐겨찾기 목록, 리뷰 작성/평점 집계
  - Notes: 테이블/집계 설계

- [ ] 지표 필드 업데이트 파이프라인

  - Acceptance: `view_count`/`download_count` 증분 업데이트
  - Notes: 트리거/배치/Edge Function

- [ ] 데이터 시드/백업 스크립트
  - Acceptance: 초기 데이터 시드/주기 백업 가능
  - Notes: Supabase CLI/SQL
