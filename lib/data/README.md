# lib/data/

The **data-access layer**. This is the single most important architectural
boundary in the project.

## What it does

Exposes `getProperty(): Promise<Property>` — the ONLY function in the codebase
that knows *where* property content comes from. Today it reads
`content/property.md` and parses the frontmatter with `gray-matter`.

## Rules

- Components and pages import `getProperty` from here. They never read the
  content file or import `gray-matter` themselves.
- Returns a fully-typed `Property` (see `types/property.ts`).
- It is `async` on purpose. Reading a local file doesn't need to be, but the
  future API-backed version will be async — awaiting now makes that swap
  invisible to callers.

## Swapping the source later (file → API)

To move to a live Airbnb/VRBO-backed source, reimplement `getProperty()` here
(e.g. call `lib/booking`'s sync layer, or a headless CMS) and keep the return
type. No UI file changes. See `docs/architecture.md`.
