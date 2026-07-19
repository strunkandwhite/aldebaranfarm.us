# lib/seo

Structured-data (JSON-LD) builders — the one place that maps our data onto
schema.org vocabulary.

- `vacationRentalJsonLd(property, reviews, extraSameAs?)` — the property as a
  `VacationRental`/`LodgingBusiness` entity (address, images, occupancy,
  listing links, aggregate review rating). Rendered on the home page.
- `faqPageJsonLd(groups)` — the FAQ content as a `FAQPage`. Rendered on /faqs.

Builders are pure (data in, object out) so they're unit-tested like the other
lib modules. Pages render the result through `components/shared/JsonLd`, which
handles safe serialization into a `<script type="application/ld+json">` tag.

Expectations: Google treats review markup that a business publishes about
itself as "self-serving", so the review stars may not show as rich results —
the markup is still valid and aids entity understanding. (Reviews also omit
`datePublished`: the content's `date` field holds display strings like
"September 2025", not ISO dates.) Likewise, since August 2023 Google shows FAQ
rich results only for authoritative government/health sites, so the FAQPage
markup mainly aids content understanding and other consumers, not search
dropdowns.
