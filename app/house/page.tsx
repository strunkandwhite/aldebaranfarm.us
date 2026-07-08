import type { Metadata } from "next";

import { getProperty } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageTitle } from "@/components/layout/PageTitle";
import { DetailsAndAmenities } from "@/components/property/DetailsAndAmenities";
import { History } from "@/components/property/History";

export const metadata: Metadata = {
  title: "The House — Aldebaran Farm",
  description:
    "Details, amenities, and history of the main house at Aldebaran Farm — a historic 1861 home in Spring Green, Wisconsin, sleeping 11 across 4 bedrooms.",
};

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
      <div className="pt-6 md:pt-10">
        <PageTitle>The House</PageTitle>
      </div>

      <DetailsAndAmenities property={property} />
      <History property={property} />
    </Container>
  );
}
