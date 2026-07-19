import { afterEach, describe, expect, it, vi } from "vitest";

import { faqPageJsonLd, vacationRentalJsonLd } from "./index";

afterEach(() => {
  vi.unstubAllEnvs();
});
import type { FaqGroup } from "@/content/faqs";
import type { Review } from "@/content/reviews";
import type { Property } from "@/types/property";

const property = {
  name: "Aldebaran Farm",
  description: "A historic countryside retreat.",
  location: {
    streetAddress: "6557 County T",
    city: "Spring Green",
    region: "Wisconsin",
    regionCode: "WI",
    country: "USA",
  },
  bedrooms: 4,
  bathrooms: 2,
  maxGuests: 11,
  images: [{ src: "/images/property/main-house.jpg", alt: "The main house" }],
  contactEmail: "aldebaran.farm.rental@gmail.com",
  contactPhone: "(312) 401-2484",
  airbnbUrl: "https://www.airbnb.com/rooms/30441325",
  vrboUrl: "https://www.vrbo.com/1893752",
} as Property;

const reviews: Review[] = [
  { author: "Linda M.", rating: 5, quote: "Wonderful stay.", source: "google" },
  { author: "Julie", rating: 4, quote: "Very comfortable.", source: "airbnb" },
];

describe("vacationRentalJsonLd", () => {
  it("maps the property onto a VacationRental/LodgingBusiness entity", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toEqual(["VacationRental", "LodgingBusiness"]);
    expect(jsonLd.name).toBe("Aldebaran Farm");
    expect(jsonLd.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "6557 County T",
      addressLocality: "Spring Green",
      addressRegion: "WI",
      addressCountry: "US",
    });
    expect(jsonLd.telephone).toBe("+13124012484");
    expect(jsonLd.containsPlace).toMatchObject({
      occupancy: { maxValue: 11 },
      numberOfBedrooms: 4,
      numberOfBathroomsTotal: 2,
    });
  });

  it("emits absolute image URLs (JSON-LD requires them)", () => {
    // Pin the image base so a CDN base exported in the dev's shell can't
    // change the expected URL. (siteUrl can't be stubbed the same way — it's
    // captured at module load — so this assertion assumes NEXT_PUBLIC_SITE_URL
    // is unset in the test environment, as it is for every lib test.)
    vi.stubEnv("NEXT_PUBLIC_IMAGE_BASE_URL", "");
    const jsonLd = vacationRentalJsonLd(property, reviews);
    expect(jsonLd.image).toEqual(["https://aldebaranfarm.us/images/property/main-house.jpg"]);
  });

  it("averages review ratings into aggregateRating", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews);
    expect(jsonLd.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 4.5,
      reviewCount: 2,
      bestRating: 5,
    });
    expect(jsonLd.review).toHaveLength(2);
  });

  it("omits rating fields entirely when there are no reviews", () => {
    const jsonLd = vacationRentalJsonLd(property, []);
    expect(jsonLd).not.toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("review");
  });

  it("appends extra sameAs URLs after the listing URLs", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews, ["https://maps.google.com/?cid=123"]);
    expect(jsonLd.sameAs).toEqual([
      "https://www.airbnb.com/rooms/30441325",
      "https://www.vrbo.com/1893752",
      "https://maps.google.com/?cid=123",
    ]);
  });
});

describe("faqPageJsonLd", () => {
  it("flattens groups into a single FAQPage mainEntity", () => {
    const groups: FaqGroup[] = [
      { heading: "Booking", items: [{ q: "Minimum stay?", a: "Two nights." }] },
      { heading: "House", items: [{ q: "Is there a TV?", a: "No." }] },
    ];
    const jsonLd = faqPageJsonLd(groups);
    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Minimum stay?",
        acceptedAnswer: { "@type": "Answer", text: "Two nights." },
      },
      {
        "@type": "Question",
        name: "Is there a TV?",
        acceptedAnswer: { "@type": "Answer", text: "No." },
      },
    ]);
  });
});
