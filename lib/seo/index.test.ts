import { afterEach, describe, expect, it, vi } from "vitest";

import { faqPageJsonLd, vacationRentalJsonLd } from "./index";

afterEach(() => {
  vi.unstubAllEnvs();
});
import type { FaqGroup } from "@/content/faqs";
import type { Review } from "@/content/reviews";
import type { Property } from "@/types/property";

const property = {
  slug: "aldebaran-farm",
  name: "Aldebaran Farm",
  description: "A historic countryside retreat.",
  location: {
    streetAddress: "6557 County T",
    city: "Spring Green",
    region: "Wisconsin",
    regionCode: "WI",
    postalCode: "53588",
    country: "USA",
    latitude: 43.130228,
    longitude: -90.056299,
  },
  bedrooms: 4,
  bathrooms: 2,
  maxGuests: 11,
  beds: [
    "Downstairs Bedroom 1 - king bed",
    "Downstairs Bedroom 2 - queen bed",
    "Upstairs Bedroom 1 - full bed + twin bed",
    "Upstairs loft - twin bed",
  ],
  amenities: ["Central A/C", "WiFi", "Full kitchen with stove and oven"],
  amenitiesNote: "Please note there is NO TV.",
  images: [{ src: "/images/property/main-house.jpg", alt: "The main house" }],
  contactEmail: "aldebaran.farm.rental@gmail.com",
  contactPhone: "(312) 401-2484",
  airbnbUrl: "https://www.airbnb.com/rooms/30441325",
  vrboUrl: "https://www.vrbo.com/1893752",
} as Property;

const reviews: Review[] = [
  { author: "Linda M.", rating: 5, quote: "Wonderful stay.", source: "google" },
  {
    author: "Julie",
    rating: 4,
    quote: "Very comfortable.",
    source: "airbnb",
    datePublished: "2025-09",
  },
];

describe("vacationRentalJsonLd", () => {
  it("maps the property onto a VacationRental/LodgingBusiness entity", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toEqual(["VacationRental", "LodgingBusiness"]);
    expect(jsonLd.additionalType).toBe("House");
    expect(jsonLd.identifier).toBe("aldebaran-farm");
    expect(jsonLd.name).toBe("Aldebaran Farm");
    expect(jsonLd.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "6557 County T",
      addressLocality: "Spring Green",
      addressRegion: "WI",
      postalCode: "53588",
      addressCountry: "US",
    });
    expect(jsonLd.latitude).toBe(43.130228);
    expect(jsonLd.longitude).toBe(-90.056299);
    expect(jsonLd.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 43.130228,
      longitude: -90.056299,
    });
    expect(jsonLd.telephone).toBe("+13124012484");
    expect(jsonLd.containsPlace).toMatchObject({
      additionalType: "EntirePlace",
      occupancy: { "@type": "QuantitativeValue", value: 11 },
      numberOfBedrooms: 4,
      numberOfBathroomsTotal: 2,
    });
  });

  it("totals the free-text bed lines into BedDetails per bed type", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews);
    expect((jsonLd.containsPlace as { bed: unknown }).bed).toEqual([
      { "@type": "BedDetails", numberOfBeds: 1, typeOfBed: "King" },
      { "@type": "BedDetails", numberOfBeds: 1, typeOfBed: "Queen" },
      { "@type": "BedDetails", numberOfBeds: 1, typeOfBed: "Double" },
      { "@type": "BedDetails", numberOfBeds: 2, typeOfBed: "Single" },
    ]);
  });

  it("maps free-text amenities onto Google's amenity vocabulary", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews);
    expect((jsonLd.containsPlace as { amenityFeature: unknown }).amenityFeature).toEqual([
      { "@type": "LocationFeatureSpecification", name: "ac", value: true },
      { "@type": "LocationFeatureSpecification", name: "kitchen", value: true },
      { "@type": "LocationFeatureSpecification", name: "ovenStove", value: true },
      { "@type": "LocationFeatureSpecification", name: "wifi", value: true },
      // "Please note there is NO TV." asserts the tv amenity as absent.
      { "@type": "LocationFeatureSpecification", name: "tv", value: false },
    ]);
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

  it("appends gallery images after the property's own (Google wants 8+ photos)", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_BASE_URL", "");
    const jsonLd = vacationRentalJsonLd(property, reviews, {
      galleryImages: [{ src: "/images/gallery/kitchen/tz-1.jpg", alt: "Kitchen" }],
    });
    expect(jsonLd.image).toEqual([
      "https://aldebaranfarm.us/images/property/main-house.jpg",
      "https://aldebaranfarm.us/images/gallery/kitchen/tz-1.jpg",
    ]);
  });

  it("averages review ratings into aggregateRating", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews);
    expect(jsonLd.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 4.5,
      reviewCount: 2,
      bestRating: 5,
    });
  });

  it("marks up only reviews that carry an ISO datePublished", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews);
    expect(jsonLd.review).toEqual([
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Julie" },
        datePublished: "2025-09",
        reviewRating: { "@type": "Rating", ratingValue: 4, bestRating: 5 },
        reviewBody: "Very comfortable.",
      },
    ]);
  });

  it("omits the review list entirely when no review has a datePublished", () => {
    const jsonLd = vacationRentalJsonLd(property, [reviews[0]]);
    expect(jsonLd).toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("review");
  });

  it("omits rating fields entirely when there are no reviews", () => {
    const jsonLd = vacationRentalJsonLd(property, []);
    expect(jsonLd).not.toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("review");
  });

  it("appends extra sameAs URLs after the listing URLs", () => {
    const jsonLd = vacationRentalJsonLd(property, reviews, {
      extraSameAs: ["https://maps.google.com/?cid=123"],
    });
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

  it("flattens rich-text answers (inline links) to plain text", () => {
    const groups: FaqGroup[] = [
      {
        heading: "House",
        items: [
          {
            q: "Where's the nearest grocery store?",
            a: [{ text: "River Valley Market", href: "https://example.com/" }, " in Spring Green."],
          },
        ],
      },
    ];
    const jsonLd = faqPageJsonLd(groups);
    expect(jsonLd.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Where's the nearest grocery store?",
        acceptedAnswer: { "@type": "Answer", text: "River Valley Market in Spring Green." },
      },
    ]);
  });
});
