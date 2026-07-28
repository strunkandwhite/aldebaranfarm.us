# components/property/

Property-specific presentation components. Those that show property data take a
typed `Property` (from `lib/data.getProperty()`) as a prop — none of them read
content or know where the data came from.

- **`Hero.tsx`** — home-page hero: framed photo, name, tagline, quick facts,
  Book Now CTA. _(the wired end-to-end data-flow example)_
- **`DetailsAndAmenities.tsx`** — The House: bed configuration, amenities list,
  "View Gallery" link.
- **`History.tsx`** — The House: history paragraphs + historic photo.
- **`RateTable.tsx`** — Reservations: the Peak/Off-Peak rate table (rows come
  from `content/rates.ts`).
- **`ListingLink.tsx`** — Reservations: a button that opens one of the
  property's platform listings (Airbnb, Vrbo) in a new tab, presented as a
  secondary path below direct email/phone booking (reuses
  `components/shared/ExternalLink`).
