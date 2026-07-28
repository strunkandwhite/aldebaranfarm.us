import { getProperty } from "@/lib/data";
import { vacationRentalJsonLd } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/property/Hero";
import { Reviews } from "@/components/reviews/Reviews";
import { JsonLd } from "@/components/shared/JsonLd";
import { galleryCategories } from "@/content/gallery";
import {
  googleReviewsUrl,
  reviews,
  type ReviewSource,
  type ReviewSourceInfo,
} from "@/content/reviews";

/**
 * The single-property landing page.
 *
 * The home page leads with the hero (a framed lead photo plus the property
 * intro and a Book Now CTA) followed by the guest-reviews section. The other
 * sections (gallery, amenities, things to do, FAQs, reservations) each live on
 * their own page.
 *
 * DATA FLOW: content/property.md -> lib/data.getProperty() -> typed `Property`
 * -> Hero. Reviews come from content/reviews.ts; their Airbnb/Vrbo attribution
 * links derive from the Property so listing URLs live in exactly one place.
 * This is a Server Component, so `getProperty()` runs on the server.
 */
export default async function HomePage() {
  const property = await getProperty();

  const reviewSources: Record<ReviewSource, ReviewSourceInfo> = {
    google: { label: "Google", url: googleReviewsUrl },
    airbnb: { label: "Airbnb", url: property.airbnbUrl },
    vrbo: { label: "Vrbo", url: property.vrboUrl },
  };

  return (
    <Container>
      <JsonLd
        data={vacationRentalJsonLd(property, reviews, {
          // Google wants ≥8 listing photos covering bedrooms/bathrooms/common
          // areas; the gallery is where the full photo set lives.
          galleryImages: galleryCategories.flatMap((category) => category.images),
          extraSameAs: [googleReviewsUrl],
        })}
      />
      <Hero property={property} />
      <Reviews reviews={reviews} sources={reviewSources} />
    </Container>
  );
}
