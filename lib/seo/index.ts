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
import type { FaqGroup } from "@/content/faqs";
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
 * The property as a schema.org VacationRental/LodgingBusiness entity.
 *
 * `extraSameAs` lets the caller append profile URLs beyond the Airbnb/Vrbo
 * listings already on the Property (e.g. the Google Maps place link, which
 * lives in `content/reviews.ts` next to the reviews it attributes).
 * `reviews` feed the aggregateRating; when empty, rating fields are omitted
 * entirely rather than emitted as zeros.
 */
export function vacationRentalJsonLd(
  property: Property,
  reviews: Review[],
  extraSameAs: string[] = []
): JsonLdObject {
  const { streetAddress, city, regionCode, country } = property.location;

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
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.quote,
          })),
        };

  return {
    "@context": "https://schema.org",
    "@type": ["VacationRental", "LodgingBusiness"],
    name: property.name,
    description: property.description,
    url: siteUrl,
    image: property.images.map((image) => absoluteImageUrl(image.src)),
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality: city,
      addressRegion: regionCode,
      // Google wants the ISO 3166-1 alpha-2 code; the content spells it "USA".
      ...(country ? { addressCountry: country === "USA" ? "US" : country } : {}),
    },
    telephone: internationalPhone(property.contactPhone),
    email: property.contactEmail,
    containsPlace: {
      "@type": "Accommodation",
      occupancy: { "@type": "QuantitativeValue", maxValue: property.maxGuests },
      numberOfBedrooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
    },
    sameAs: [property.airbnbUrl, property.vrboUrl, ...extraSameAs],
    ...ratingFields,
  };
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
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
  };
}
