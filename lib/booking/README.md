# lib/booking/

The booking layer. Isolates _how a guest books_ from the rest of the app.

## Today (live)

- **`buildInquiryMailtoUrl(property, details?)`** — builds a `mailto:` link that
  pre-fills a booking inquiry to the owner. This is the current implementation
  of "make a booking". Used by the reservations page (`app/reservations`).

Guests can also book directly through the property's Airbnb listing
(`AirbnbLink` in `components/property`) or Vrbo listing (`VrboLink` in
`components/property`) — both presented as equally-weighted
alternatives alongside `buildInquiryMailtoUrl` above, which remains
commission-free for the guest. See
`docs/superpowers/specs/2026-07-09-airbnb-booking-option-design.md`. The
Airbnb/VRBO listings also matter here as calendars to sync against (below) so
we don't double-book.

## Future

**Direct booking + cross-platform availability sync** will live in this module
when built:

- Merge Airbnb + VRBO (+ direct) availability into one calendar so we never
  double-book.
- Check availability for a given date range.
- Take a direct booking and push the block back to Airbnb/VRBO.

When built, `lib/data.getProperty()` can enrich the property with live
availability from here, and the reservations page can move from a mailto link
to a real booking flow. See `docs/architecture.md` for the integration plan.
