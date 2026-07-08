import type { Property } from "@/types/property";

/**
 * BOOKING LAYER.
 *
 * TODAY: guests book "old school" — they email the owner. The only live export
 * is `buildInquiryMailtoUrl()`, which the reservations page uses to open the
 * guest's mail client with a pre-filled inquiry.
 *
 * FUTURE: this module is where direct booking + cross-platform availability
 * sync will live. The stubs below sketch the intended surface so the UI can be
 * wired against it incrementally. When implemented, `lib/data.getProperty()`
 * can pull live availability from here, and the reservations page can switch
 * from a mailto link to a real booking flow — without restructuring the app.
 * (We never send guests off-site to book; the platform listings exist only as
 * calendars to sync against so we don't double-book.)
 *
 * See `docs/architecture.md` for the full integration plan.
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
export function buildInquiryMailtoUrl(
  property: Property,
  details: InquiryDetails = {},
): string {
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

// ---------------------------------------------------------------------------
// FUTURE — direct booking + calendar sync (STUBS, not yet implemented)
// ---------------------------------------------------------------------------

/** A single blocked/booked date range from an upstream platform. */
export interface CalendarBlock {
  start: string; // ISO date
  end: string; // ISO date
  source: "airbnb" | "vrbo" | "direct";
}

export interface AvailabilityQuery {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingRequest extends AvailabilityQuery {
  guestName: string;
  guestEmail: string;
  message?: string;
}

export interface BookingResult {
  status: "confirmed" | "pending" | "rejected";
  confirmationCode?: string;
}

/**
 * FUTURE: merge availability from Airbnb + VRBO (+ direct bookings) into one
 * calendar so we never double-book. Will likely pull iCal feeds and/or the
 * platform APIs and cache the result.
 */
export async function getSyncedCalendar(): Promise<CalendarBlock[]> {
  throw new Error(
    "Not implemented: calendar sync. See docs/architecture.md § Booking.",
  );
}

/** FUTURE: true availability check against the synced calendar. */
export async function checkAvailability(
  _query: AvailabilityQuery,
): Promise<boolean> {
  throw new Error("Not implemented: availability check.");
}

/**
 * FUTURE: create a real direct booking (and push the block back to Airbnb/VRBO
 * so their calendars stay in sync). Today, booking goes through
 * `buildInquiryMailtoUrl()` instead.
 */
export async function createBooking(
  _request: BookingRequest,
): Promise<BookingResult> {
  throw new Error("Not implemented: direct booking.");
}
