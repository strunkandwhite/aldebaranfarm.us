import { getProperty } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/property/Hero";
import { Reviews } from "@/components/reviews/Reviews";

/**
 * The single-property landing page.
 *
 * The home page leads with the hero (a framed lead photo plus the property
 * intro and a Book Now CTA) followed by the guest-reviews section. The other
 * sections (gallery, amenities, things to do, FAQs, reservations) each live on
 * their own page.
 *
 * DATA FLOW: content/property.md -> lib/data.getProperty() -> typed `Property`
 * -> Hero. This is a Server Component, so `getProperty()` runs on the server.
 */
export default async function HomePage() {
  const property = await getProperty();

  return (
    <Container>
      <Hero property={property} />
      <Reviews />
    </Container>
  );
}
