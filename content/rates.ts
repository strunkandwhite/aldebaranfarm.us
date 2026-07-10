/**
 * Rates & Reservations content (the /reservations page).
 *
 * Structured, editable copy for the rate table and booking policies. Contact
 * details (email/phone) live on the `Property` (see content/property.md), so the
 * reservations page pulls those from `getProperty()` and the rate/policy copy
 * from here.
 */

export interface RateRow {
  /** Short label, e.g. "Weekend/Holiday". */
  label: string;
  /** The qualifying details shown after the label. */
  detail: string;
  /** Peak-season price, formatted (e.g. "$1,200"). */
  peak: string;
  /** Off-peak price, formatted (e.g. "$1,000"). */
  offPeak: string;
}

export const reservationIntro =
  "Aldebaran is available for rental year-round. Reservations made directly by email or phone get our best rate, since we don't have to pay service fees.";

export const peakDefinition =
  'Higher rates (shown below as "Peak") apply Memorial Day through Labor Day, Thanksgiving, and Christmas Eve through New Year\'s Day. All other dates are "Off-Peak." These rates apply to reservations booked directly by email or phone.';

export const alsoListedIntro =
  "Aldebaran Farm can also be booked on Airbnb and Vrbo with additional fees.";

export const rateTable: RateRow[] = [
  {
    label: "Weekend/Holiday",
    detail: "3 nights starting Thursday, Friday, or Saturday.",
    peak: "$1,200",
    offPeak: "$1,000",
  },
  {
    label: "Week (7 nights)",
    detail: "Starting any day except Saturday or Sunday",
    peak: "$2,000",
    offPeak: "$1,800",
  },
  {
    label: "Weekday (per night)",
    detail: "Monday–Thursday, 2-night minimum",
    peak: "$300",
    offPeak: "$250",
  },
];

export const taxNote = "Wisconsin sales tax of 5.5% will be added to all rates.";

export const cancellationPolicy =
  "Cancellations made 30 days or more before arrival receive a full refund. Cancellations within 30 days of arrival are refunded 50% of the total, and cancellations within 14 days are non-refundable.";
