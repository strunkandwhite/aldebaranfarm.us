/**
 * STRUCTURED DATA (SEO).
 *
 * Pure builders for the JSON-LD objects embedded on pages (via the shared
 * `JsonLd` component). Search engines read these to understand what the site
 * is — a single vacation-rental lodging — and to source rich results (FAQ
 * dropdowns, review stars). This module is the one place that knows how our
 * data maps onto schema.org vocabulary; pages pass in the data they already
 * have and render the result.
 */

import { imageUrl } from "@/lib/images";
import { siteUrl } from "@/lib/site";
import type { TextRun } from "@/components/shared/RichText";
import type { FaqGroup } from "@/content/faqs";
import type { GalleryImage } from "@/content/gallery";
import type { Review } from "@/content/reviews";
import type { Property } from "@/types/property";

/** A JSON-LD object ready to be serialized into a script tag. */
export type JsonLdObject = Record<string, unknown>;

/** Resolve an image path to an absolute URL (JSON-LD requires absolute URLs). */
function absoluteImageUrl(src: string): string {
  return new URL(imageUrl(src), siteUrl).toString();
}

/**
 * schema.org wants E.164-style phone numbers. The property is in the US, so a
 * bare 10-digit number gets the +1 country code.
 */
function internationalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

/**
 * Bed phrases used in the content's `beds` lines, mapped onto the bed-type
 * vocabulary Google's vacation-rental examples use (a "full" bed is a Double,
 * a "twin" is a Single). Each phrase occurrence counts as one bed.
 */
const BED_TYPES = [
  { phrase: /king/gi, typeOfBed: "King" },
  { phrase: /queen/gi, typeOfBed: "Queen" },
  { phrase: /full/gi, typeOfBed: "Double" },
  { phrase: /twin/gi, typeOfBed: "Single" },
];

/** The content's free-text bed lines as schema.org BedDetails totals. */
function bedDetails(beds: string[]): JsonLdObject[] {
  return BED_TYPES.flatMap(({ phrase, typeOfBed }) => {
    const numberOfBeds = beds.reduce((sum, line) => sum + (line.match(phrase)?.length ?? 0), 0);
    return numberOfBeds === 0 ? [] : [{ "@type": "BedDetails", numberOfBeds, typeOfBed }];
  });
}

/**
 * Google's fixed amenity vocabulary, keyed by patterns matched against the
 * content's free-text amenities list. An amenity that doesn't match anything
 * is simply not asserted (never emitted as `false`) — except the TV, whose
 * absence the content states outright in `amenitiesNote`.
 */
const AMENITY_PATTERNS = [
  { pattern: /a\/c|air.?cond/i, name: "ac" },
  { pattern: /\bheat\b/i, name: "heating" },
  { pattern: /washer/i, name: "washerDryer" },
  { pattern: /microwave/i, name: "microwave" },
  { pattern: /kitchen/i, name: "kitchen" },
  { pattern: /stove|\boven\b/i, name: "ovenStove" },
  { pattern: /wi-?fi/i, name: "wifi" },
  { pattern: /fireplace/i, name: "fireplace" },
  { pattern: /grill|barbecue/i, name: "outdoorGrill" },
];

/** The content's amenities as schema.org LocationFeatureSpecifications. */
function amenityFeatures(amenities: string[], amenitiesNote?: string): JsonLdObject[] {
  const features = AMENITY_PATTERNS.filter(({ pattern }) =>
    amenities.some((amenity) => pattern.test(amenity))
  ).map(({ name }) => ({ "@type": "LocationFeatureSpecification", name, value: true }));

  if (amenitiesNote !== undefined && /no tv/i.test(amenitiesNote)) {
    features.push({ "@type": "LocationFeatureSpecification", name: "tv", value: false });
  }
  return features;
}

export interface VacationRentalJsonLdOptions {
  /**
   * Gallery photos appended after the property's own images. Google requires
   * at least 8 photos on a vacation-rental listing, covering bedrooms,
   * bathrooms, and common areas — the gallery is where those live.
   */
  galleryImages?: GalleryImage[];
  /**
   * Profile URLs beyond the Airbnb/Vrbo listings already on the Property
   * (e.g. the Google Maps place link, which lives in `content/reviews.ts`
   * next to the reviews it attributes).
   */
  extraSameAs?: string[];
}

/**
 * The property as a schema.org VacationRental/LodgingBusiness entity.
 *
 * `reviews` feed the aggregateRating; when empty, rating fields are omitted
 * entirely rather than emitted as zeros. Only reviews carrying an ISO
 * `datePublished` appear in the `review` list itself — Google rejects
 * vacation-rental review markup without a date.
 */
export function vacationRentalJsonLd(
  property: Property,
  reviews: Review[],
  { galleryImages = [], extraSameAs = [] }: VacationRentalJsonLdOptions = {}
): JsonLdObject {
  const { streetAddress, city, regionCode, postalCode, country, latitude, longitude } =
    property.location;

  const datedReviews = reviews.filter((r) => r.datePublished !== undefined);
  const ratingFields =
    reviews.length === 0
      ? {}
      : {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue:
              Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) /
              10,
            reviewCount: reviews.length,
            bestRating: 5,
          },
          ...(datedReviews.length === 0
            ? {}
            : {
                review: datedReviews.map((r) => ({
                  "@type": "Review",
                  author: { "@type": "Person", name: r.author },
                  datePublished: r.datePublished,
                  reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
                  reviewBody: r.quote,
                })),
              }),
        };

  return {
    "@context": "https://schema.org",
    "@type": ["VacationRental", "LodgingBusiness"],
    // Google's closed vocabulary for the rental's building type.
    additionalType: "House",
    // Stable, content-independent listing ID (required by Google).
    identifier: property.slug,
    name: property.name,
    description: property.description,
    url: siteUrl,
    image: [...property.images, ...galleryImages].map((image) => absoluteImageUrl(image.src)),
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality: city,
      addressRegion: regionCode,
      postalCode,
      // Google wants the ISO 3166-1 alpha-2 code; the content spells it "USA".
      ...(country ? { addressCountry: country === "USA" ? "US" : country } : {}),
    },
    // Both coordinate forms: the vacation-rental spec reads top-level
    // latitude/longitude, while the local-business checks look for `geo`.
    latitude,
    longitude,
    geo: { "@type": "GeoCoordinates", latitude, longitude },
    telephone: internationalPhone(property.contactPhone),
    email: property.contactEmail,
    containsPlace: {
      "@type": "Accommodation",
      // Guests always book the whole house, never a room within it.
      additionalType: "EntirePlace",
      occupancy: { "@type": "QuantitativeValue", value: property.maxGuests },
      bed: bedDetails(property.beds),
      numberOfBedrooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      amenityFeature: amenityFeatures(property.amenities, property.amenitiesNote),
    },
    sameAs: [property.airbnbUrl, property.vrboUrl, ...extraSameAs],
    ...ratingFields,
  };
}

/** Flatten a rich-text answer to the plain text a schema.org Answer wants. */
function plainText(answer: string | TextRun[]): string {
  if (typeof answer === "string") {
    return answer;
  }
  return answer.map((run) => (typeof run === "string" ? run : run.text)).join("");
}

/** The FAQ page's Q&A pairs as a schema.org FAQPage (groups are flattened). */
export function faqPageJsonLd(groups: FaqGroup[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups
      .flatMap((group) => group.items)
      .map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: plainText(item.a) },
      })),
  };
}
