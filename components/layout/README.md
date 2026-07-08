# components/layout/

Structural chrome shared across every page — not property-specific.

- **`Container.tsx`** — centered max-width wrapper for consistent gutters.
- **`Header.tsx`** — wordmark/logo + primary nav.
- **`Nav.tsx`** — primary navigation links.
- **`Footer.tsx`** — site footer.

All are intentionally minimal placeholders (structure, not final styling). The
root layout (`app/layout.tsx`) composes `Header` + `Footer` around page content.
