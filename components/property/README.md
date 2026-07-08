# components/property/

Property-specific presentation components. Each takes a typed `Property`
(from `lib/data.getProperty()`) as a prop — none of them read content or know
where the data came from.

- **`Hero.tsx`** — name, tagline, quick facts. _(part of the wired example)_
- **`Gallery.tsx`** — photos, resolved through `imageUrl()`.
- **`Amenities.tsx`** — amenities list.
- **`LocationMap.tsx`** — location + placeholder for a map embed.
- **`Reviews.tsx`** — placeholder (reviews arrive with the API layer).
- **`BookingCta.tsx`** — the booking CTA: a `mailto:` "Book by email" button
  plus outbound Airbnb/VRBO links. _(fully wired end-to-end)_

Most are intentionally minimal placeholders — structure and data flow, not final
styling. `Hero` and `BookingCta` are the wired end-to-end example.
