# Aldebaran Farm — Project Plan

Single-property marketing/booking-info website for **Aldebaran Farm** (Spring Green, WI).
No online booking — guests reserve by email/phone via the Reservations page. Built to allow
a future Airbnb/VRBO API + calendar-sync layer to drop in without a rewrite.

**Stack:** Next.js (App Router, TypeScript) · Tailwind CSS v4 + shadcn/ui · file-based
content · local images · deployed on Vercel.

---

## Design system

From the style-guide mock. Theme is configured in `app/globals.css` (`@theme`) with fonts in
`app/layout.tsx`. See `docs/style-guide.md` for the shipped values.

### Colors (starter hex — confirm against Figma tokens)

| Token            | Approx. value | Use                                          |
| ---------------- | ------------- | -------------------------------------------- |
| `brand.burgundy` | `#7A0C1C`     | Headings, nav text, links, "Book Now" button |
| `brand.cream`    | `#F4EDE1`     | Page background                              |
| `brand.sand`     | `#E6DAC6`     | Image frames / offset shadow blocks          |
| `brand.sage`     | `#6C7F63`     | Secondary accent                             |

### Typography

- **Playfair Display** (Google Font) — headings.
  - Homepage title 60pt · Page headers 40pt · Subheaders 28pt · Menu links 20pt
- **Body 16pt** — Helvetica Neue per the mock. See Font strategy below.

---

## Font strategy (Helvetica Neue)

> **Outcome:** the site shipped with Option 2's mechanics but not its license —
> self-hosted `HelveticaNeue-*.woff2` files (extracted from the macOS `.ttc`)
> load via `next/font/local` in `app/layout.tsx`, with the Option 1 system
> stack as fallback. A web-embedding license has **not** been confirmed; this
> must be resolved (buy the license, or drop the files and rely on the system
> stack) before the licensing risk is acceptable for production. See
> `docs/style-guide.md`.

Original analysis, kept for context:

Helvetica Neue is a proprietary Monotype/Linotype typeface. The copy installed on macOS is
licensed for local use **only** — it does **not** include web-embedding rights. Self-hosting
the Mac system file (uploading the `.ttf`/`.woff2` and serving via `@font-face`) would render
correctly but is a **license violation**, and the font file would be publicly downloadable
from the site. Options, in order of recommendation:

1. **System stack (recommended — free, legal, matches the mock on Apple devices).**
   Use `font-family: -apple-system, "Helvetica Neue", Arial, sans-serif` for body. On
   Mac/iOS this renders as the real Helvetica Neue; on other platforms it falls back to a
   near-identical grotesque. No files served, no licensing needed.
2. **Purchase a Helvetica Neue web license** from Monotype and self-host the licensed
   `.woff2`. Legal and pixel-consistent across all platforms; has a cost.
3. **Free look-alike served everywhere** (e.g. Inter or a Helvetica-class open font) for
   perfectly consistent cross-platform rendering at no cost.

Uploading the macOS font file for public web serving is **not** a supported option.
Decision needed before Phase 1 finalizes; default to Option 1 unless told otherwise.

---

## Site map & navigation

Shared header on every page:
`The House` · `Things To Do` · **Aldebaran Farm** (centered logo → `/`) · `FAQs` ·
**Book Now** (→ `/reservations`).

| Route           | Page                                    |
| --------------- | --------------------------------------- |
| `/`             | Home                                    |
| `/house`        | The House — details, amenities, history |
| `/gallery`      | Gallery — photos grouped by room        |
| `/things-to-do` | Things To Do                            |
| `/faqs`         | FAQs                                    |
| `/reservations` | Rates & Reservations (Book Now)         |

---

## Shared components

- `Header` / `Nav` — centered wordmark, evenly-spaced links, Book Now CTA. Responsive:
  full row at ≥820px (iPad portrait and up); below 820px (phones/small tablets) links
  collapse into a hamburger drawer (`MobileNav`, Base UI Dialog — slides in from the right,
  X to close, Esc/backdrop close)
- `Footer`
- `Container` — section/layout wrapper
- `PageTitle` — centered Playfair heading
- `SectionHeading` — burgundy subheader
- `FramedImage` — image with the sand-colored offset shadow block used throughout
- `Button` (shadcn, themed burgundy) — primary "Book Now"
- Page-specific: `QAItem`, `RateTable`, `AmenityList`, `GalleryGrid`, `Lightbox`

---

## Responsiveness (applies to EVERY page)

The mocks are desktop-only, but **every page must be built mobile- and tablet-friendly as it
is created** — responsiveness is not deferred to the polish phase. For each page:

- Design for phone (~375px), tablet/iPad (768px & 1024px), and desktop. Use fluid layouts
  and Tailwind breakpoints (`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280).
- Multi-column sections (hero, house details, things-to-do, gallery) collapse to a single
  column on small screens; type scales down; images (`FramedImage`) stay within their frames.
- Navigation uses the hamburger drawer below 820px (see `MobileNav`); this is already global
  via `Header`, so pages just need their own content to reflow.
- Tap targets ≥44px, no horizontal scroll/overflow, and readable line lengths on mobile.

The Phase 8 polish pass is a final audit/refinement — not the first time responsiveness is
considered.

## Pages

### 1. Home (`/`)

Two-column hero: `FramedImage` (property/path photo) + intro block — "A Historic Retreat in
Spring Green", description, `Sleeps 11 • 4 Bedrooms • 1 Lofted Bed • 2 Bathrooms`, Book Now CTA.

### 2. The House (`/house`)

- **Details & Amenities** — bed configuration + amenities list + "Please note there is NO TV"
  - "View Gallery →" link.
- Property photo (`FramedImage`).
- **History** — 3 paragraphs + historic sepia photo.
- Bed config: Sleeps 11 / 4 bedrooms / 1 lofted bed / 2 full baths — Downstairs Bedroom 1
  (queen), Downstairs Bedroom 2 (queen), Upstairs Bedroom 1 (full + twin), Upstairs Bedroom 2
  (queen + twin), Upstairs loft (twin), Screened sleeping porch (twin, not in sleep count).
- Amenities: Solar Power, Central A/C, Heat, Washer/dryer, Dishwasher, Microwave,
  Refrigerator, Coffee grinder + auto-drip coffeemaker, Full kitchen w/ stove & oven, WiFi,
  Wood-burning fireplace, Outdoor barbecue grills, Outdoor firepit, Books & board games. NO TV.

### 3. Gallery (`/gallery`)

- `GalleryGrid` grouped by **category** (Kitchen, Downstairs Full Bath, Living Room/Dining
  Room, Downstairs Bedroom 1, …). Data-driven so dropping photos into a category folder makes
  them appear — no per-photo layout work (handles the incomplete mock).
- `Lightbox` on click (recommended; not in mock but expected).

### 4. Things To Do (`/things-to-do`)

- **In Town**, **The Outdoors** (Hiking / Biking / Kayaking & Canoeing / Tubing / Fishing with
  outbound links), **Architecture & Theater** — mixed text + `FramedImage`. Google Maps link
  at the bottom.

### 5. FAQs (`/faqs`)

- Grouped Q&A: **Booking & Stay**, **Location**, **The House**, **House Rules** — rendered
  from a data file via `QAItem`.

### 6. Rates & Reservations (`/reservations`)

- Contact block — email `aldebaran.farm.rental@gmail.com` (mailto), phone `(312) 401-2484`
  (tel). Address: 6557 County T, Spring Green, WI.
- `RateTable` — Peak / Off-Peak columns:
  - Weekend/Holiday (3 nights, start Thu/Fri/Sat): $1,200 / $1,000
  - Week (7 nights): $2,000 / $1,800
  - Weekday per night (Mon–Thu, 2-night min): $300 / $250
- Peak = Memorial Day–Labor Day, Thanksgiving, Christmas Eve–New Year's Day. + 5.5% WI sales
  tax note + Cancellation Policy (full refund ≥30 days out, 50% within 30, non-refundable
  within 14).

---

## Content & data model

Editable content lives under `/content`, read through `lib/data/*` so a future API can replace
the source:

- `content/property.md` — name, tagline, sleeps, bed config, amenities[], history[]
- `content/rates.ts` — rate rows + peak-season rules + tax + cancellation policy
- `content/faqs.ts` — grouped Q&A
- `content/things-to-do.ts` — sections + link lists
- `content/gallery.ts` — category → image list (or inferred from folders)

## Photo assets

`/public/images/gallery/<category>/` (kitchen, downstairs-bath, living-dining, bedroom-1, …),
plus `/public/images/hero`, `/history`, `/things-to-do`, `/brand`. Served via `next/image`.

---

## Build phases

1. **Design system & fonts** — brand tokens in `app/globals.css`, Playfair Display + body font
   strategy in `app/layout.tsx`, confirm palette. Update `docs/style-guide.md`.
2. **Shared layout** — Header/Nav (centered logo), Footer, Container, PageTitle,
   SectionHeading, FramedImage, themed Button. The frame all six pages share.
3. **Home page** — first full page end-to-end (validates the system).
4. **The House** — page + property data model (beds / amenities / history).
5. **Reservations** (`RateTable`) + **FAQs** (`QAItem`) — plus their data files.
6. **Things To Do** — sections + outbound link lists.
7. **Gallery** — category grid + lightbox; ingest uploaded photos.
8. **Polish** — responsive/mobile, SEO metadata + OG image, favicon, accessibility pass.
9. **Deploy to Vercel** — connect repo, domain, verify.

## Open items

- **Font license** (see Font strategy outcome) — self-hosted Helvetica Neue
  shipped; web-embedding license still unconfirmed.
- **Mobile designs** — mocks are desktop only; responsive behavior uses sensible defaults
  unless mobile layouts are provided.
- **Photo upload** — organize source photos by room category for the gallery.
