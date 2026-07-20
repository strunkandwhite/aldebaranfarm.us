# lib/seo

Structured-data (JSON-LD) builders — the one place that maps our data onto
schema.org vocabulary.

- `vacationRentalJsonLd(property, reviews, { galleryImages?, extraSameAs? })` —
  the property as a `VacationRental`/`LodgingBusiness` entity, shaped to
  Google's vacation-rental listing spec: identifier, geo coordinates, full
  address, 8+ photos (`galleryImages` supplies the gallery set), beds and
  amenities on the `containsPlace` Accommodation, listing links, aggregate
  review rating. Rendered on the home page.
- `faqPageJsonLd(groups)` — the FAQ content as a `FAQPage`. Rendered on /faqs.

Builders are pure (data in, object out) so they're unit-tested like the other
lib modules. Pages render the result through `components/shared/JsonLd`, which
handles safe serialization into a `<script type="application/ld+json">` tag.

The `bed` and `amenityFeature` fields are derived by pattern-matching the
content's free-text `beds`/`amenities` lines onto Google's fixed vocabulary —
if a new amenity or bed type is added to the content and should appear in
structured data, extend the pattern tables here.

Expectations: Google treats review markup that a business publishes about
itself as "self-serving", so the review stars may not show as rich results —
the markup is still valid and aids entity understanding. (Only reviews with an
ISO `datePublished` in `content/reviews.ts` are marked up individually; Google
requires the date on vacation-rental reviews.) Likewise, since August 2023
Google shows FAQ rich results only for authoritative government/health sites,
so the FAQPage markup mainly aids content understanding and other consumers,
not search dropdowns.
