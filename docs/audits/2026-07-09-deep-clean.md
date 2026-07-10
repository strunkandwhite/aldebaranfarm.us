# Deep Clean Audit Report — 2026-07-09

**Branch:** `deep-clean-fixes` (15 commits, 73 files changed, +3017 / -370)

## Summary

The 2026-07-09 deep clean audited a green, deployed baseline across seven parallel review domains — architecture, security, performance, code quality, test quality, documentation, and data flow — and produced a Finding → Task map covering 5 critical, 14 important, and numerous minor findings plus four owner-decision items (softened rates copy, removal of the recommendations map, deletion of orphaned gallery photos, and a link-preview title fix). Tasks 0–14 landed the fixes as one reviewed commit per task on `deep-clean-fixes`, each passing a pre-commit gate (lint-staged, knip, `tsc --noEmit`, and — from Task 1 onward — Vitest and the new image-reference check). This report re-runs the full quality gate from scratch, spot-checks the fixed behaviors against a production build, and closes out the audit. Outcome: every finding in the map has a landed fix or an explicit, documented reason it was left alone; the gate passes end-to-end; the site still builds to the same 13 static routes.

## Findings by Category

### Architecture (5 fixes)

| #   | Severity      | Finding                                                                                                                                                         | Fix                                                                                           |
| --- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | M             | `siteUrl`, the sitemap route list, and `bookNowHref` were scattered across `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, and `components/layout/Nav.tsx` | Task 3: consolidated into `lib/site.ts`                                                       |
| 2   | C3            | `Reviews`/`ReviewCard` imported `content/reviews.ts` directly, the only components violating the "components receive data as props" rule                        | Task 7: reviews now flow through `app/page.tsx` props                                         |
| 3   | M             | The `tel:` URL was built inline in the reservations page instead of the booking module that owns URL construction                                               | Task 1: `buildInquiryTelUrl()` added to `lib/booking`                                         |
| 4   | M             | `navLinkClass` was exported from `components/layout/Nav.tsx`, a component file, instead of a shared, non-component module                                       | Task 10: moved to `components/shared/links.ts`                                                |
| 5   | owner request | The recommendations map (link + Google My Maps embed) carried duplicated map IDs and a click-to-load facade                                                     | Task 11: section removed entirely at the owner's request, resolving both findings by deletion |

### Security (2 fixes)

| #   | Severity | Finding                                                                                                                      | Fix                                                                                                                                                                         |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | I7       | No security response headers — the site was frameable by any third party (clickjacking risk on the booking CTA)              | Task 9: `next.config.ts` `headers()` adds CSP `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` |
| 2   | M        | `ExternalLink`'s `target`/`rel` could be overridden by prop-spread, reopening the reverse-tabnabbing hole it exists to close | Task 5: `target`/`rel` moved after the prop spread so they can't be overridden                                                                                              |

### Performance (3 fixes)

| #   | Severity | Finding                                                                                                               | Fix                                                                    |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | I8       | Gallery lightbox had no neighbor preload — each arrow click started a fresh 100–250KB fetch with no loading indicator | Task 12: preload the two neighboring photos while the lightbox is open |
| 2   | M        | `/things-to-do`'s above-the-fold Outdoors photo was missing `priority` despite being an LCP candidate                 | Task 12: added `priority`, matching `/house`'s treatment               |
| 3   | M        | `shadcn` CLI was listed in `dependencies` instead of `devDependencies`, bloating the production install               | Task 12: moved to `devDependencies`                                    |

### Code Quality (13 fixes)

| #   | Severity      | Finding                                                                                                                                                       | Fix                                                                                                                              |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | C1            | Mailto links used `URLSearchParams` (form-encoding), turning spaces into literal `+` in real mail clients (Apple Mail, iOS, Outlook)                          | Task 1: percent-encode per RFC 6068                                                                                              |
| 2   | M             | `imageUrl()` mishandled a trailing slash on the CDN base (double slash) and double-prefixed protocol-relative URLs                                            | Task 2: hardened base-joining logic                                                                                              |
| 3   | C4            | The `EVENTS` registry existed, but 4 of 5 `data-track` values were still hand-typed string literals across 5 files — the "one-place rename" promise was false | Task 5: every call site now reads `EVENTS.*`                                                                                     |
| 4   | M             | The metadata title template was a no-op (`%s` never appended the brand suffix)                                                                                | Task 8: fixed template to `` `%s — ${property.name}` ``                                                                          |
| 5   | M             | `sitemap.ts` stamped a build-time `lastModified` on every route, falsely implying every page changed on every deploy                                          | Task 8: removed                                                                                                                  |
| 6   | I17           | The brand CTA button classes were retyped at 4 call sites                                                                                                     | Task 10: `variant="brand"` / `brand-sm` / `brand-lg` on the shared `Button`                                                      |
| 7   | I18           | The prose-link class was duplicated at 5 call sites, one silently deviating (`underline-offset-2`)                                                            | Task 10: shared `proseLinkClass`; the deviation normalized to the shared `underline-offset-4` (the one sanctioned visual change) |
| 8   | I19           | The page-header wrapper `<div className="pt-6 md:pt-10">` was duplicated across 5 pages                                                                       | Task 10: `PageTitle` absorbs its own top padding                                                                                 |
| 9   | M             | `AirbnbLink`/`VrboLink` were twin components differing only in data                                                                                           | Task 10: unified into `ListingLink`                                                                                              |
| 10  | M             | Unused `--spacing-brand-gutter` / `--spacing-brand-section` CSS tokens — false affordances, zero usages                                                       | Task 10: removed                                                                                                                 |
| 11  | M             | The "NO TV" note was hard-coded in JSX instead of owner-editable content                                                                                      | Task 11: `Property.amenitiesNote`                                                                                                |
| 12  | M             | The sleeps-line hard-coded singular/plural strings that the data could invalidate                                                                             | Task 11: `pluralize()` helper in `lib/utils`                                                                                     |
| 13  | owner request | "Aldebaran Farm can also be booked on Airbnb and Vrbo at slightly higher rates" oversold the price difference                                                 | Task 11: softened to "at higher rates"                                                                                           |

### Test Quality (4 fixes)

| #   | Severity      | Finding                                                                                                                  | Fix                                                                                      |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | I10           | No test coverage for the booking URL builders — exactly the bug class C1 fell into                                       | Task 1: Vitest harness + `lib/booking/index.test.ts`                                     |
| 2   | I11           | Frontmatter validation checked presence only, not type or nested shape (`maxGuests: eleven` passed and rendered garbage) | Task 4: `assertValidFrontmatter` validates types/nested shapes; `lib/data/index.test.ts` |
| 3   | I9            | No static tool verified that `/images/...` paths referenced in content/components actually exist under `public/`         | Task 13: `scripts/check-images.mjs`, wired into pre-commit                               |
| 4   | owner request | Six gallery photos under `public/images/gallery/exterior` and `screened-porch` were referenced nowhere                   | Task 13: deleted (paired with the new orphan report), recoverable from git history       |

### Data Flow (5 fixes)

| #   | Severity      | Finding                                                                                                                                             | Fix                                                                         |
| --- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | C2            | The footer hard-coded contact info and address independent of `content/property.md`, so editing the content file silently left the footer stale     | Task 6: `Footer` is now an async Server Component calling `getProperty()`   |
| 2   | I6            | `content/reviews.ts` carried mirrored copies of the Airbnb/Vrbo listing URLs — a second source of truth                                             | Task 7: listing URLs now derive from the `Property` at the page level       |
| 3   | I13           | The street address existed only as hard-coded strings (footer, FAQ) with no typed home in the property model                                        | Task 4: `PropertyLocation` gains `streetAddress` / `regionCode`             |
| 4   | I12           | Guest capacity, bedroom count, and the property name were frozen into static metadata strings, so `property.md` edits never reached the SEO surface | Task 8: `generateMetadata()` derives title/description from `getProperty()` |
| 5   | owner request | Social link previews rendered the em-dash title as a bare "Spring Green, Wisconsin" once scrapers stripped the site name                            | Task 8: title changed to "Aldebaran Farm in Spring Green, WI"               |

### Documentation (5 fixes)

| #   | Severity | Finding                                                                                                                                                                                  | Fix                                                                                                     |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | C5       | Stale comments/docs across the codebase (embed widget that was dropped, `xl` breakpoint that no longer exists, "no logo image needed", etc.)                                             | Task 14: corrected in place                                                                             |
| 2   | I14      | The reviews feature was entirely undocumented                                                                                                                                            | Task 14: `components/reviews/README.md` created; `components/README.md`, `docs/architecture.md` updated |
| 3   | I15      | The "equally-weighted" description of Airbnb/Vrbo vs. direct booking no longer matched the shipped page (direct booking steering)                                                        | Task 14: `docs/architecture.md` and `CLAUDE.md` corrected                                               |
| 4   | I16      | The `/images` grep-test wording in `docs/architecture.md` was stale                                                                                                                      | Task 14: corrected                                                                                      |
| 5   | M        | Assorted small doc-drift items (`CLAUDE.md` "no test suite" line, `lib/README.md`, `content/README.md`, `lib/analytics/README.md`, `components/shared/README.md`, `docs/style-guide.md`) | Task 14: synced with the code                                                                           |

## Test Impact

- Before: 0 tests
- After: 16 tests (3 files: `lib/booking`, `lib/images`, `lib/data`), plus the `check:images` build-time verifier
- New test files:
  - `lib/booking/index.test.ts`
  - `lib/images/index.test.ts`
  - `lib/data/index.test.ts`

## New Modules

| File                                  | Purpose                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `lib/site.ts`                         | Site-wide config: `siteUrl`, sitemap `routes` manifest, `bookNowHref`                                   |
| `lib/analytics/events.ts`             | Vendor-free `EVENTS` registry, importable from Server Components                                        |
| `components/shared/links.ts`          | Shared `navLinkClass` / `proseLinkClass` constants                                                      |
| `components/property/ListingLink.tsx` | Unified Airbnb/Vrbo listing button, replacing the `AirbnbLink`/`VrboLink` twins                         |
| `scripts/check-images.mjs`            | Build-time check that every referenced `/images/...` path exists under `public/`, plus an orphan report |
| `vitest.config.ts`                    | Vitest config: `lib/**/*.test.ts`, `@` path alias, `server-only` stub                                   |
| `test/server-only-stub.ts`            | Stubs the `server-only` import so `lib/data` can be unit-tested outside a Server Component bundle       |

(`components/reviews/README.md`, added in Task 14, is documentation, not a module.)

## Not Addressed

Per the plan's "Deliberately NOT addressed" list:

- The FAQ answer's street-address prose — narrative content with extra context; a conscious duplication, kept as-is.
- Restyling footer links to `navLinkClass` — the docs were corrected instead; the footer's smaller link treatment is intentional.
- Resolved by owner decision rather than a code fix: the map-ID-duplication and click-to-load-facade findings (the recommendations map was removed entirely, Task 11) and the orphaned gallery photos (deleted, Task 13 — recoverable from git history).

Plus these review-logged minors, deliberately left for a future pass:

- The `lib/booking` tel builder has no length validation on the normalized digit string.
- `imageUrl`'s `http://`-case and empty-string edges are untested.
- `getProperty()` is not wrapped in React's `cache()` — extra re-parses, but a build-time-only cost on this static site.
- The Header/Hero wordmark brand name is still a literal, not derived from the property.
- The message-only inquiry body produces a triple newline (pre-existing quirk, not introduced by this branch).
- `docs/project-plan.md` retains historical "sand-colored" wording — explicitly disclaimed as historical documentation.

## Verification Notes

- Full gate (`typecheck`, `lint`, `knip`, `test`, `check:images`, `build`) passes clean.
- `pnpm format:check` reports issues only under `.superpowers/sdd/` — a directory with its own nested `.gitignore` that git honors but Prettier v3 does not (Prettier reads only the root `.gitignore`). Those are SDD process scratch files (task briefs/reports), not part of the deliverable and untouched by any of the 15 tasks; all tracked source files are clean.
- Build emits the same 13 static routes as before the branch.
