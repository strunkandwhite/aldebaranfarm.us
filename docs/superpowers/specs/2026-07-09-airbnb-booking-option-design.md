# Airbnb booking option on Rates & Reservations

## Context

The site's stated architecture principle has been "we never send guests
off-site to book" — the only booking path is the email/phone inquiry built by
`lib/booking.buildInquiryMailtoUrl()`. We're reconsidering that principle as a
test run: add a way for guests to book directly through the property's
existing Airbnb listing, accepting that this sends them off-site (in a new
tab).

Research findings that shaped this design:

- Airbnb has no public API for individual hosts (partner-only, closed to new
  applicants) and no public oEmbed endpoint (`airbnb.com/oembed.json` 404s).
  A "live availability" custom-built widget isn't achievable without becoming
  a channel-manager customer (Lodgify, OwnerRez, etc.) — out of scope for this
  test run.
- Airbnb does offer a host-only "embed your listing" feature
  (`airbnb.com/help/article/923`), reached via the host dashboard's listing
  preview → Share → Embed → Copy HTML. It's been hard for hosts to locate
  across multiple dashboard redesigns, but it still works — the user
  retrieved the real snippet for this listing.
- The listing is confirmed as `https://www.airbnb.com/rooms/30441325`
  ("Aldebaran Farm, Spring Green: history with a view").

The retrieved embed snippet:

```html
<div
  class="airbnb-embed-frame"
  data-id="30441325"
  data-view="home"
  data-hide-price="true"
  style="width: 450px; height: 300px; margin: auto"
>
  <a href="https://www.airbnb.com/rooms/30441325?guests=1&adults=1&s=66&source=embed_widget"
    >View On Airbnb</a
  >
  <a
    href="https://www.airbnb.com/rooms/30441325?guests=1&adults=1&s=66&source=embed_widget"
    rel="nofollow"
    >Home in Spring Green · ★4.82 · 4 bedrooms · 6 beds · 2 baths</a
  >
  <script async src="https://www.airbnb.com/embeddable/airbnb_jssdk"></script>
</div>
```

The script hydrates the frame div client-side; the two anchors are the
no-JS/loading fallback (relevant since ad blockers commonly block Airbnb's
embed script).

## Goal

Add an Airbnb booking option to the Rates & Reservations page as a **third,
equally-weighted option** alongside the existing Email/Phone inquiry rows —
both a custom-styled button and Airbnb's official embed widget, side by side,
as a test run to compare the two before deciding whether to keep one, both,
or neither.

## Design

### 1. Data layer

Add one field to the `Property` contract, following the existing
`contactEmail`/`contactPhone` pattern:

- `types/property.ts`: add `airbnbUrl: string` to the `Property` interface.
- `content/property.md`: add `airbnbUrl: https://www.airbnb.com/rooms/30441325`
  to the frontmatter.

Both new components derive the listing ID from this URL via a small regex
(`/rooms\/(\d+)/`) rather than hardcoding `30441325` a second time — one
source of truth for the listing identity.

### 2. Components (`components/property/`)

Two new components, matching the existing pattern where property components
take a typed `Property` as a prop:

- **`AirbnbLink.tsx`** — a custom-styled link built from the existing `Button`
  primitive (`variant="outline"`, to read as secondary to the primary
  email/phone flow), with a `lucide-react` external-link icon. Opens
  `property.airbnbUrl` in a new tab (`target="_blank" rel="noopener noreferrer"`).
  Instrumented with `data-track="outbound_click" data-track-destination="airbnb"`,
  reusing the existing (currently unused) `EVENTS.outboundClick` — no changes
  to `lib/analytics` needed.

- **`AirbnbEmbed.tsx`** — reproduces the official embed snippet as JSX rather
  than raw HTML:
  - The `airbnb-embed-frame` div, with `data-id` computed from
    `property.airbnbUrl`, plus `data-view="home"` and `data-hide-price="true"`.
  - The two fallback anchors, preserved from the real snippet, **with
    `target="_blank" rel="nofollow noopener noreferrer"` added** — the
    original snippet omits `target="_blank"`, but since these anchors are
    what a user actually clicks when the widget script is blocked, and the
    whole point of this test is off-site links opening in a new tab, they
    need it explicitly.
  - The SDK script loaded via `next/script`: `id="airbnb-jssdk"`,
    `strategy="lazyOnload"` (non-critical, below-the-fold third-party
    content — consistent with the site's existing Lighthouse/LCP discipline).
  - No CSP is configured in `next.config.ts`, so nothing blocks loading a
    script from `airbnb.com`.

### 3. Page change (`app/reservations/page.tsx`)

Add a third row in the existing inquiry block, after the Email and Phone
rows, presenting `AirbnbLink` and `AirbnbEmbed` together (e.g. "Or book
directly on Airbnb:" followed by both components) as equally-weighted
alternatives to email/phone.

### 4. Documentation updates

Replace "we never send guests off-site to book" with language reflecting the
new reality — direct email/phone remains the primary, commission-free path;
Airbnb (button + widget) is now offered as a secondary, off-site alternative
— in:

- `docs/architecture.md` (the "Booking + calendar sync" section)
- `lib/booking/README.md` and the header comment in `lib/booking/index.ts`
- The project `CLAUDE.md` bullet under `lib/booking`

## Out of scope

- Live availability/calendar sync (`getSyncedCalendar()`,
  `checkAvailability()`, `createBooking()` from the future-booking surface in
  `docs/architecture.md`) — untouched by this change.
- Any channel-manager/PMS integration (Lodgify, OwnerRez, etc.).
- Removing or changing the existing email/phone inquiry flow.

## Testing

- `pnpm typecheck`, `pnpm lint` after implementation.
- Manual verification on a Vercel preview deployment: confirm both the custom
  button and the embed widget render, links open in a new tab, and the
  embed's script loads without CSP/console errors.
