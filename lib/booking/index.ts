import type { Property } from "@/types/property";

/**
 * BOOKING LAYER.
 *
 * TODAY: guests book "old school" — they email the owner. The only live export
 * is `buildInquiryMailtoUrl()`, which the reservations page uses to open the
 * guest's mail client with a pre-filled inquiry.
 *
 * FUTURE: direct booking + Airbnb/VRBO calendar sync is a future concern that
 * will live in this module when built. The intended surface is described in
 * `docs/architecture.md` — we never send guests off-site to book; platform
 * listings matter only as calendars to sync against.
 */

// ---------------------------------------------------------------------------
// LIVE TODAY — email-to-book
// ---------------------------------------------------------------------------

export interface InquiryDetails {
  checkIn?: string; // ISO date, optional until we have a date picker
  checkOut?: string; // ISO date
  guests?: number;
  message?: string;
}

/**
 * Build a `mailto:` URL that pre-fills a booking inquiry to the owner.
 * This is the current implementation of "make a booking".
 */
export function buildInquiryMailtoUrl(property: Property, details: InquiryDetails = {}): string {
  const subject = `Booking inquiry — ${property.name}`;

  const lines = [
    `Hi, I'd like to inquire about staying at ${property.name}.`,
    "",
    details.checkIn ? `Check-in: ${details.checkIn}` : null,
    details.checkOut ? `Check-out: ${details.checkOut}` : null,
    details.guests ? `Guests: ${details.guests}` : null,
    details.message ? `\n${details.message}` : null,
  ].filter((line): line is string => line !== null);

  const params = new URLSearchParams({
    subject,
    body: lines.join("\n"),
  });

  return `mailto:${property.contactEmail}?${params.toString()}`;
}
