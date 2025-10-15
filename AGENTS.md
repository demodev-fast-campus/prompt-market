# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Prompt Market** - AI 프롬프트 거래소 (AI Prompt Marketplace). 운영자가 등록한 디지털 AI 프롬프트를 사용자가 장바구니에 담아 결제하고, 구매 후 본문 열람/복사 및 파일 다운로드를 제공하는 온라인 상점.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (shadcn/ui)
- **Icons**: lucide-react
- **Internationalization**: next-intl (EN/KO)
- **Theme**: next-themes (dark/light mode)
- **Backend (to-be)**: Supabase (Auth, Database, Storage)
- **Payment (to-be)**: 토스페이먼츠 (TossPayments)
- **Package Manager**: pnpm

## Project Structure

```
app/
  ├── layout.tsx              # Minimal root layout (required by Next.js)
  ├── [locale]/               # Locale-specific routes
  │   ├── layout.tsx          # Main layout with i18n, theme, analytics
  │   ├── page.tsx            # Home/landing page
  │   ├── prompts/            # Prompt listing page
  │   ├── prompt/[id]/        # Prompt detail page
  │   ├── cart/               # Shopping cart page
  │   ├── purchase-history/   # Purchase history page (NOT /my-page)
  │   ├── profile/            # User profile page (buyer-only)
  │   ├── admin/prompts/      # Admin dashboard for CRUD
  │   ├── seller/waitlist/    # Seller waitlist registration
  │   ├── auth/               # Auth pages (login, register, forgot-password)
  │   ├── terms/              # Terms of service
  │   └── privacy/            # Privacy policy
  └── api/                    # API routes

i18n/
  ├── routing.ts              # Routing configuration (defineRouting)
  ├── request.ts              # Request configuration (getRequestConfig)
  └── navigation.ts           # Navigation utilities (Link, redirect, etc.)

components/
  ├── header.tsx              # Global header with nav, search, cart, user menu
  ├── prompt-card.tsx         # Prompt card component
  ├── theme-provider.tsx      # Dark/light mode provider
  └── ui/                     # shadcn/ui components

lib/
  └── utils.ts                # Utility functions (cn, storage helpers)

messages/
  ├── en.json                 # English translations
  └── ko.json                 # Korean translations (default)

.cursor/rules/
  ├── nextjs.mdc              # Next.js best practices
  ├── prd.mdc                 # Product requirements document
  └── toss-frontend.mdc       # Toss frontend guidelines
```

## Development Commands

```bash
# Development
pnpm dev                     # Start dev server at localhost:3000

# Build
pnpm build                   # Production build

# Production
pnpm start                   # Start production server

# Linting
pnpm lint                    # Run Next.js linter
```

## Routing Standards (IMPORTANT)

**All routes include locale prefix (e.g., `/ko/prompts`, `/en/prompts`)**

URL patterns for user-facing routes:
- Home: `/[locale]/`
- Prompt listing: `/[locale]/prompts`
- Prompt detail: `/[locale]/prompt/[id]`
- Shopping cart: `/[locale]/cart`
- Purchase history: `/[locale]/purchase-history` (NOT `/my-page`)
- User profile: `/[locale]/profile` (buyer-only)
- Admin dashboard: `/[locale]/admin/prompts`
- Seller waitlist: `/[locale]/seller/waitlist`
- Terms: `/[locale]/terms`
- Privacy: `/[locale]/privacy`

## Internationalization (i18n)

- **Supported locales**: `en`, `ko` (default: `ko`)
- **Implementation**: next-intl with App Router (URL-based routing with `[locale]` segment)
- **Configuration files**:
  - `i18n/routing.ts` - Routing configuration using `defineRouting`
  - `i18n/request.ts` - Request configuration using `getRequestConfig`
  - `i18n/navigation.ts` - Navigation utilities (Link, redirect, etc.)
- **Translation files**: `messages/en.json`, `messages/ko.json`
- **Usage**:
  - Import `useTranslations` from `next-intl` in client components
  - Use `Link` from `@/i18n/navigation` instead of `next/link` for locale-aware navigation
  - Use `redirect` from `@/i18n/navigation` instead of `next/navigation`
- **Locale prefix**: Always shown in URL (`localePrefix: 'always'`)
- **Static generation**: Use `generateStaticParams()` in `app/[locale]/layout.tsx`

## Current State (as-is)

- **Authentication**: Mock login/logout using localStorage (`storage.setUser`)
- **Data**: All data is mocked (prompts, cart, favorites, purchase history)
- **Storage**: Client-side localStorage with custom event system (`pm_storage` events)
- **Search**: UI exists but no actual search functionality
- **Payment**: Not integrated (mock UI only)

## Planned State (to-be)

See `docs/PRD.md` and `docs/PLAN.md` for detailed specifications.

**Key changes:**
- Supabase integration for auth, database (profiles, prompts, carts, purchases, seller_waitlist)
- TossPayments integration for payment processing
- RLS (Row Level Security) for data access control
- Remove quantity/coupon features (digital goods only)
- Remove approval workflow (admin-only CRUD)
- Content masking based on purchase status

## Database Schema (Supabase, to-be)

### Tables

- `profiles`: User profiles (id, nickname, avatar_url, updated_at)
- `prompts`: Product catalog (id, title, description, price, prompt_text, image_urls, tags, rating, review_count, download_count, view_count, file_url, is_published)
- `carts`: Shopping cart (id, user_id, prompt_id) - unique(user_id, prompt_id)
- `purchases`: Purchase records (id, buyer_id, prompt_id, payment_order_id, created_at)
- `seller_waitlist`: Seller applications (id, name, email, portfolio_url, categories, message, processed, created_at)

### RLS Policies (to-be)

- `profiles`: Users can read/update their own profile
- `carts`: Users can CRUD their own cart items
- `purchases`: Users can read their own purchases, admins can read all
- `prompts`: Public read access, admin-only write access
- `seller_waitlist`: Admin-only read access

## Code Conventions

### General

- Use TypeScript for all code
- Prefer interfaces over types
- Use functional and declarative patterns
- Named exports over default exports (where possible)
- Use `@/` path alias for imports

### File Naming

- **Directories**: kebab-case (e.g., `purchase-history`)
- **Components**: PascalCase (e.g., `PromptCard.tsx`)
- **Utilities**: kebab-case (e.g., `utils.ts`)

### Component Patterns

- Most components are React Server Components (RSC)
- Use `'use client'` directive only when needed (interactivity, hooks)
- Minimize client components, wrap interactive elements
- Use Suspense for async operations with fallback UI
- Implement proper error boundaries

### State Management

- Avoid unnecessary `useState` and `useEffect`
- Use React Server Actions for form handling (to-be)
- Use URL search params for shareable state
- Current: localStorage-based state with custom event system

### Async Request APIs

Always use async versions of Next.js runtime APIs:

```typescript
const cookieStore = await cookies();
const headersList = await headers();
const params = await props.params;
const searchParams = await props.searchParams;
```

## Key Implementation Notes

### Storage System (lib/utils.ts)

Custom localStorage wrapper with event-based synchronization:

```typescript
storage.getUser()           // Get login state
storage.setUser(user)       // Set login state (triggers pm_storage event)
storage.getCart()           // Get cart items
storage.addToCart(item)     // Add to cart (no duplicates)
storage.removeFromCart(id)  // Remove from cart
storage.getFavorites()      // Get favorited prompt IDs
storage.toggleFavorite(id)  // Toggle favorite
```

Listen to storage changes:

```typescript
window.addEventListener('pm_storage', (e: CustomEvent) => {
  if (e.detail.key === storage.keys.cart) {
    // Cart changed
  }
});
```

### Digital Goods Constraints

- **No quantity field**: Each product can only be added once to cart
- **No coupons**: Removed from cart page
- **Unique constraint**: `unique(user_id, prompt_id)` prevents duplicate cart items
- **Transaction-based checkout**: Create purchases + clear cart atomically

### Content Access Control (to-be)

- **Before purchase**: Prompt detail page masks `prompt_text` and file download
- **After purchase**: Show full `prompt_text` with copy button + file download button
- **File downloads**: Use signed URLs with expiration (Supabase Storage)

### Payment Flow (to-be)

1. User clicks "결제하기" in cart
2. Server fetches user's cart items, calculates total (server-side only)
3. Generate order ID and params for TossPayments
4. On payment approval webhook: verify signature, create purchase records, clear cart (transactional)
5. Client redirects to purchase history or prompt detail with unlocked content

## Important Caveats

### Routes

- **NEVER use `/my-page`** - always use `/purchase-history`
- **Always use locale-aware navigation**: Import navigation utilities from `@/i18n/navigation`
- **Locale prefix is required**: All user-facing routes include `/[locale]/` prefix (e.g., `/ko/prompts`)

### Admin Features

- **No approval workflow** - admin has direct CRUD access only
- Remove all approval/rejection status UI from admin pages

### Profile Page

- **Buyer-only**: Remove seller stats, "내 프롬프트", "판매 현황" tabs
- **Fields**: email (read-only), nickname (editable), avatar (upload to Supabase Storage)

### Cart/Checkout

- **No quantity controls** - digital goods are 1-per-item only
- **No coupon input** - feature removed
- **Server-side pricing** - never trust client-side amounts

## Performance Optimizations

- Images: `unoptimized: false`, formats: `['image/avif', 'image/webp']`
- Compression enabled in `next.config.mjs`
- Aggressive caching headers for static assets (1 year)
- Vercel Analytics enabled

## Debugging

When debugging, check:

1. **Storage events**: Use browser DevTools to monitor `pm_storage` events
2. **Locale**: Check `NEXT_LOCALE` cookie value
3. **Theme**: Check `theme` localStorage value
4. **Console errors**: TypeScript and build errors are currently ignored (`ignoreBuildErrors: true`)

## Additional Resources

- **PRD**: `docs/PRD.md` - Full product requirements (as-is + to-be)
- **Plan**: `docs/PLAN.md` - Implementation plan and migration strategy
- **Next.js Rules**: `.cursor/rules/nextjs.mdc` - Next.js best practices
