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
- **`AirbnbLink.tsx`** — Reservations: a button that opens the property's
  Airbnb listing in a new tab (reuses `components/shared/ExternalLink`).
- **`VrboLink.tsx`** — Reservations: a button that opens the property's Vrbo
  listing in a new tab (reuses `components/shared/ExternalLink`).
