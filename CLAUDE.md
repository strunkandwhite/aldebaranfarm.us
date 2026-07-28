# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/booking-info site for Aldebaran Farm, a single vacation-rental property in Spring Green, WI. Six static pages, no online booking (guests reserve by email/phone), deployed on Vercel. Stack: Next.js 16 App Router (TypeScript) · Tailwind CSS v4 · shadcn/ui · file-based content.

## Commands

Use **pnpm**.

- `pnpm dev` — dev server at localhost:3000
- `pnpm build` — production build
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint
- `pnpm format` / `pnpm format:check` — Prettier write/check
- `pnpm knip` — dead code/deps check
- `pnpm test` — Vitest unit tests for `lib/`
- `pnpm check:images` — verify every referenced `/images/…` path exists under `public/`

Tests are minimal and deliberate: Vitest covers the pure-logic lib modules (booking URL builders, imageUrl, property parsing/validation). Static JSX is not unit-tested; the pre-commit gate and build-time validation are the main quality net.

A husky pre-commit hook runs lint-staged (eslint --fix + prettier on staged files), knip (dead code/deps — config in `knip.json`; CSS-only deps and the shadcn CLI are ignore-listed there), then `tsc --noEmit`, `pnpm test`, then `pnpm check:images`. Any failure blocks the commit.

## Architecture

Read `docs/architecture.md` first — it is the authoritative description. The core principle: **the UI never knows where data comes from or how bookings happen.** Each `lib/` subfolder is the single point of change for its concern:

- `lib/data` — `getProperty()`, the ONLY code that reads/parses `content/property.md`. Returns a typed `Property` (`types/property.ts`). Intentionally `async` so a future API-backed source drops in without changing callers.
- `lib/images` — `imageUrl()`. Every image src must flow through `imageUrl()` — directly or via `FramedImage`, which calls it internally. CDN migration = set `NEXT_PUBLIC_IMAGE_BASE_URL`.
- `lib/booking` — `buildInquiryMailtoUrl()` and `buildInquiryTelUrl()` are the live "make a booking" implementations, used by the reservations page; it's commission-free for the guest and gets the best rate, so the page leads with it; the property's Airbnb and Vrbo listings (`ListingLink` in `components/property`) are offered below the rates table as secondary paths with additional fees. Future direct booking + Airbnb/VRBO calendar sync will live in this module when built (surface described in `docs/architecture.md`).
- `lib/analytics` — `trackEvent()`/`EVENTS`, the only caller of `@vercel/analytics`'s `track()`. Instrument clicks via `data-track` attributes, handled by the single delegated listener in `components/analytics/TrackedClicks`.

Content has two access patterns — don't conflate them:

1. `content/property.md` (frontmatter + Markdown body) is read only through `lib/data.getProperty()`. Grep test: `content/property.md` is _imported/read_ only under `lib/data` (doc comments elsewhere may mention it by name).
2. The typed TS content files (`content/faqs.ts`, `rates.ts`, `things-to-do.ts`, `gallery.ts`, `reviews.ts`) are imported directly by their pages — they're already structured data, so no parsing layer sits between.

Pages are Server Components; components receive data as props and never import content values themselves (type-only imports from `content/` are fine — the data contracts are co-located with the data).

`lib/site.ts` holds site-wide config (siteUrl, route manifest for the sitemap, bookNowHref).

## Directory READMEs

Most directories (`app/`, `components/*`, `content/`, `lib/*`, `types/`) carry a README explaining their role and rules. Read the README of any directory you're changing, and update it if your change makes it stale.

## Design system

`docs/style-guide.md` is the reference. Key rules:

- Theme lives in `app/globals.css` (Tailwind v4 `@theme` + `:root`); fonts load in `app/layout.tsx`. shadcn/ui primitives read the semantic tokens, so restyle tokens, not components.
- All text is burgundy `#770A15` by default (`--foreground` and `--primary`). Avoid `text-muted-foreground` for normal copy.
- Headings use Playfair Display (`font-heading`); body is self-hosted Helvetica Neue (`app/fonts/`) with a system-stack fallback. ⚠️ Helvetica Neue web-embedding license is unconfirmed — flag before shipping font changes to production.
- Link language: prose links are underlined at rest; nav links underline on hover (shared `navLinkClass` in `components/shared/links.ts`; the footer uses its own smaller treatment); primary actions are filled burgundy buttons.
- Light-only design — no dark-mode toggle is shipped.

## Conventions

- Every page must be responsive as it is built (phone ~375px, tablet 768/1024, desktop) — not deferred to a polish pass. Nav collapses to the `MobileNav` hamburger drawer below 820px, handled globally by `Header`.
- `components/ui/` is generated shadcn/ui — don't hand-edit unless deliberately customizing a primitive.
- Gallery photos live in `/public/images/gallery/<category>/`; the gallery is data-driven via `content/gallery.ts`.
- `NEXT_PUBLIC_SITE_URL` sets `metadataBase`/canonical URLs (fallback `https://aldebaranfarm.us`); must be set on Vercel for correct OG/robots/sitemap URLs.
