# lib/booking/

The booking layer. Isolates *how a guest books* from the rest of the app.

## Today (live)

- **`buildInquiryMailtoUrl(property, details?)`** — builds a `mailto:` link that
  pre-fills a booking inquiry to the owner. This is the current implementation
  of "make a booking". Used by the reservations page (`app/reservations`).

We never send guests off-site to book. The property's Airbnb/VRBO listings
matter here only as calendars to sync against (below) so we don't double-book.

## Future (stubs)

The rest of the module sketches the intended surface for **direct booking +
cross-platform availability sync**:

- `getSyncedCalendar()` — merge Airbnb + VRBO (+ direct) availability into one
  calendar so we never double-book.
- `checkAvailability(query)` — is the property free for these dates?
- `createBooking(request)` — take a direct booking and push the block back to
  Airbnb/VRBO.

These throw `Not implemented` for now. When built, `lib/data.getProperty()` can
enrich the property with live availability from here, and the reservations page
can move from a mailto link to a real booking flow. See `docs/architecture.md`.
