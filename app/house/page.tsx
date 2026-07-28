import type { Metadata } from "next";

import { getProperty } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageTitle } from "@/components/layout/PageTitle";
import { DetailsAndAmenities } from "@/components/property/DetailsAndAmenities";
import { History } from "@/components/property/History";

export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty();
  const { city, region } = property.location;
  return {
    title: "The House",
    description: `Details, amenities, and history of the main house at ${property.name} — a historic 1861 home in ${city}, ${region}, sleeping ${property.maxGuests} across ${property.bedrooms} bedrooms.`,
  };
}

/**
 * The House page: sleeping arrangements & amenities, then the property's history.
 *
 * DATA FLOW: content/property.md -> lib/data.getProperty() -> typed `Property`
 * -> the two sections. Server Component, so `getProperty()` runs on the server.
 */
export default async function HousePage() {
  const property = await getProperty();

  return (
    <Container>
      <PageTitle>The House</PageTitle>

      <DetailsAndAmenities property={property} />
      <History property={property} />
    </Container>
  );
}
