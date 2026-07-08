# types/

Shared TypeScript types for the app.

- **`property.ts`** — the `Property` type, the contract between the data layer
  (`lib/data`) and the UI. Components depend on this type, not on the content
  file format. Swapping the content source (file → API) must not change this
  shape. See `docs/architecture.md`.
