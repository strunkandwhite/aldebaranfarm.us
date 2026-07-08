# Architecture

A single-property rental site. The guiding principle: **the UI never knows where
data comes from or how bookings happen.** Both are hidden behind narrow layers in
`/lib` so they can be replaced later without a rewrite.

## The data flow (today)

```
content/property.md            ← the content (frontmatter + Markdown body)
        │
        ▼
lib/data/getProperty()         ← the ONLY code that reads the file / parses it
        │  returns a typed `Property` (types/property.ts)
        ▼
app/page.tsx (Server Component)
        │  passes `property` down as props
        ▼
components/property/*          ← Hero renders the name/tagline/facts; the
                                 reservations page builds the inquiry mailto
                                 via lib/booking
```

Rules that keep this clean:

- **Only `lib/data` reads content.** No component imports `gray-matter` or
  touches `content/`. Grep test: `gray-matter` and `content/property.md` should
  appear only under `lib/data`.
- **`types/property.ts` is the contract.** Components depend on the `Property`
  type, not on the file format.
- **`getProperty()` is `async`** even though reading a local file is sync — so
  the future API version (which _is_ async) drops in without changing callers.

## The isolation layers in `/lib`

| Layer         | Hides                        | Swap later to…                       |
| ------------- | ---------------------------- | ------------------------------------ |
| `lib/data`    | where property content lives | Airbnb/VRBO API or a headless CMS    |
| `lib/images`  | where images are hosted      | Cloudinary / S3+CloudFront (set env) |
| `lib/booking` | how a guest books            | direct booking + calendar sync       |

Each is the single point of change for its concern.

## Booking + calendar sync (the future)

Today booking is deliberately low-tech:

- `lib/booking.buildInquiryMailtoUrl(property)` builds a `mailto:` link to the
  owner, used by the reservations page. That's the "make a booking"
  implementation.
- We never send guests off-site to book. The property's separate **Airbnb** and
  **VRBO** listings exist, but on this site they matter only as calendars to
  keep in sync.

The goal is direct booking with availability kept in sync across platforms so we
never double-book. The intended surface, to be built in `lib/booking`:

- `getSyncedCalendar()` — merge Airbnb + VRBO (+ direct) availability (likely via
  iCal feeds and/or platform APIs) into one calendar.
- `checkAvailability(query)` — is the property free for these dates?
- `createBooking(request)` — take a direct booking and push the block back to
  Airbnb/VRBO to keep their calendars in sync.

### How it plugs in without a rewrite

1. **Build the sync layer** in `lib/booking` (API clients, iCal sync, a small
   store for direct bookings). No UI changes yet.
2. **Enrich the property.** `lib/data.getProperty()` can call
   `getSyncedCalendar()` and attach availability to the returned object (extend
   `Property` with an optional `availability` field). Components that don't use
   it are unaffected.
3. **Upgrade the CTA.** The reservations page swaps its `mailto:` link for a
   date-picker + `createBooking()` flow. The rest of the site is untouched.

Because every step is behind an existing boundary, the migration is incremental:
mailto today, hybrid tomorrow, full direct booking later — same component tree.

## Content source migration (file → API)

Same idea for content. To move off the Markdown file, reimplement
`lib/data.getProperty()` to fetch from the API/CMS and map the response to
`Property`. The content file is retired; no component changes.

## Hosting

Standard Next.js App Router (v16) + Tailwind v4 + shadcn/ui. No custom server or
non-default config — deploys to **Vercel** as-is. A future CDN for images is
enabled by setting `NEXT_PUBLIC_IMAGE_BASE_URL` (see `lib/images`).
