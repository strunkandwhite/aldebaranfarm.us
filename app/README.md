# app/

Next.js App Router: routes, root layout, and global styles.

- **`layout.tsx`** — root layout. Loads fonts (→ design-token CSS vars), sets
  metadata, and wraps every page in `Header` + `Footer`.
- **`page.tsx`** — the single-property landing page. Server Component that calls
  `getProperty()` and renders the property sections. This is the wired
  end-to-end data-flow example.
- **`about/page.tsx`** — about the property/owner (placeholder).
- **`contact/page.tsx`** — inquiry / "email to book" page (placeholder).
- **`globals.css`** — Tailwind v4 entry + design tokens (see the brand-token
  marker inside).

Pages are Server Components and get data via `lib/data`; they don't read
`content/` directly.
