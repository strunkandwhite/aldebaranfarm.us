# lib/

Non-UI logic, split into single-responsibility isolation layers. Each subfolder
is the **one place** that owns its concern, so it can be swapped later without
touching components.

- **`data/`** — data-access layer. `getProperty()`; the only reader of
  `content/`. Swap file → API here.
- **`images/`** — `imageUrl()` path helper. Swap local → CDN here.
- **`booking/`** — booking layer. Email-to-book today; direct booking + Airbnb/
  VRBO calendar sync later (stubs present).
- **`utils.ts`** — shared helpers (`cn()` for Tailwind class merging, used by
  shadcn/ui).

See `docs/architecture.md` for how these fit together.
