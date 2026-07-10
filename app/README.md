# app/

Next.js App Router: routes, root layout, and global styles.

- **`layout.tsx`** — root layout. Loads fonts (→ design-token CSS vars), sets
  metadata, and wraps every page in `Header` + `Footer`.
- **`page.tsx`** — Home. Server Component that calls `getProperty()` and
  renders the hero and the guest-reviews section; the wired end-to-end
  data-flow example.
- **`house/page.tsx`** — The House: details & amenities, history.
- **`gallery/page.tsx`** — Gallery, grouped by room category.
- **`things-to-do/page.tsx`** — Things To Do sections with outbound links.
- **`faqs/page.tsx`** — grouped Q&A.
- **`reservations/page.tsx`** — contact info, the rates table, and the
  Airbnb/Vrbo secondary-booking section (the Book Now target).
- **`not-found.tsx`** — global 404 boundary; redirects unknown routes to `/`
  rather than showing a dead-end page.
- **`robots.ts` / `sitemap.ts`** — SEO routes, built from `NEXT_PUBLIC_SITE_URL`.
- **`globals.css`** — Tailwind v4 entry + design tokens (see the brand-token
  marker inside).

Pages are Server Components. Property data comes via `lib/data.getProperty()`
(never by reading `content/property.md` directly); the typed TS content files
(`content/faqs.ts`, `rates.ts`, …) are imported directly by their pages.
