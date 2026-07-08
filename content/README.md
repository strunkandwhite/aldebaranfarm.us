# content/

File-based content for the site. This is the **current** source of truth for the
single property.

- **`property.md`** — YAML frontmatter (structured fields) + a Markdown body
  (`description`). The frontmatter keys map 1:1 to the `Property` type in
  `types/property.ts`.

## Rules

- **Nothing in `/app` or `/components` reads this file directly.** The only
  reader is `lib/data/getProperty()`. That isolation is the whole point: when we
  integrate the Airbnb/VRBO APIs, we reimplement `lib/data` and delete/retire
  this file without touching a single component. See `docs/architecture.md`.
- Image paths are relative to `/public` and must be rendered through
  `imageUrl()` from `lib/images`.
