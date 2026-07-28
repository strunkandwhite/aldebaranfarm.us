# components/layout/

Structural chrome shared across every page — not property-specific.

- **`Container.tsx`** — centered max-width wrapper for consistent gutters.
- **`Header.tsx`** — centered wordmark + primary nav; swaps to the hamburger
  below 820px.
- **`Nav.tsx`** — nav link definitions (`navLinkClass` itself lives in
  `components/shared/links.ts`, shared with `MobileNav`).
- **`MobileNav.tsx`** — hamburger drawer (Base UI Dialog) used below 820px.
- **`Footer.tsx`** — site footer.
- **`PageTitle.tsx`** — centered Playfair page heading.
- **`SectionHeading.tsx`** — burgundy subheader.

The root layout (`app/layout.tsx`) composes `Header` + `Footer` around page
content.
