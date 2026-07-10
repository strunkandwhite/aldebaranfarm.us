import type { Property } from "@/types/property";

/**
 * BOOKING LAYER.
 *
 * TODAY: guests book "old school" — they email the owner. The only live export
 * is `buildInquiryMailtoUrl()`, which the reservations page uses to open the
 * guest's mail client with a pre-filled inquiry.
 *
 * ALSO LIVE: the reservations page links out to the property's Airbnb and
 * Vrbo listings (see `ListingLink` in `components/property`) as secondary
 * paths — the page leads with direct email/phone booking, which gets guests
 * the best rate.
 *
 * FUTURE: direct booking + Airbnb/VRBO calendar sync is a future concern that
 * will live in this module when built. The intended surface is described in
 * `docs/architecture.md`; platform listings matter here as calendars to sync
 * against.
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

  const detailLines = [
    details.checkIn ? `Check-in: ${details.checkIn}` : null,
    details.checkOut ? `Check-out: ${details.checkOut}` : null,
    details.guests ? `Guests: ${details.guests}` : null,
    details.message ? `\n${details.message}` : null,
  ].filter((line): line is string => line !== null);

  const lines = [
    `Hi, I'd like to inquire about staying at ${property.name}.`,
    ...(detailLines.length > 0 ? ["", ...detailLines] : []),
  ];

  // RFC 6068 requires percent-encoding (%20 for spaces). URLSearchParams must
  // NOT be used here: it produces form-encoding, where spaces become "+", and
  // spec-compliant mail clients (Apple Mail, iOS, Outlook) render those
  // pluses literally in the draft.
  const query = [
    `subject=${encodeURIComponent(subject)}`,
    `body=${encodeURIComponent(lines.join("\n"))}`,
  ].join("&");

  return `mailto:${encodeURIComponent(property.contactEmail)}?${query}`;
}

/**
 * Build a `tel:` URL for the owner's booking phone line. Tolerates any US
 * formatting in the content file — "(312) 401-2484", "+1 312…", "1-312…" all
 * normalize to the same E.164 target.
 */
export function buildInquiryTelUrl(property: Property): string {
  const digits = property.contactPhone.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return `tel:+1${national}`;
}
