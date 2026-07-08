/**
 * The canonical shape of the single rental property.
 *
 * This type is the CONTRACT between the data layer (`lib/data`) and every UI
 * component. Components import `Property` from here — never the raw content
 * file or the parser. When the content source is later swapped from a local
 * Markdown file to an Airbnb/VRBO API, this type stays the same and the UI
 * does not change. See `docs/architecture.md`.
 */

export interface PropertyLocation {
  /** e.g. "Spring Green" */
  city: string;
  /** State / province / region, e.g. "Wisconsin" */
  region: string;
  /** Optional country; defaults are handled in the UI, not here. */
  country?: string;
}

export interface PropertyImage {
  /**
   * Path RELATIVE TO /public, e.g. "/images/property/living-room.png".
   * Never reference this directly in a component — pass it through
   * `imageUrl()` from `lib/images` so a future move to a CDN is one change.
   */
  src: string;
  /** Human-readable alt text. Required for accessibility. */
  alt: string;
  /** Optional caption for gallery display. */
  caption?: string;
}

export interface Property {
  /**
   * Stable identifier. There is only one property today, but keeping a slug
   * makes the data layer API-shaped (a future `getProperty(slug)` is trivial).
   */
  slug: string;

  name: string;
  tagline: string;
  location: PropertyLocation;

  bedrooms: number;
  /** Number of dedicated lofted beds, surfaced in the quick-facts summary. */
  loftedBeds: number;
  bathrooms: number;
  /** Total guests the property sleeps. */
  maxGuests: number;

  /** Long-form description. Markdown source taken from the content file body. */
  description: string;

  /** Sleeping arrangements — one line per bed/room, shown on The House page. */
  beds: string[];
  amenities: string[];
  /** Long-form property history — one entry per paragraph (The House page). */
  history: string[];
  images: PropertyImage[];

  /** Owner inbox for "email to book" inquiries (used to build a mailto link). */
  contactEmail: string;
  /** Owner phone for booking inquiries (used to build a tel link). */
  contactPhone: string;
}
