import type { Metadata } from "next";
import Link from "next/link";

import { buildInquiryMailtoUrl, buildInquiryTelUrl } from "@/lib/booking";
import { getProperty } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageTitle } from "@/components/layout/PageTitle";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { RateTable } from "@/components/property/RateTable";
import { ListingLink } from "@/components/property/ListingLink";
import { proseLinkClass } from "@/components/shared/links";
import {
  reservationIntro,
  peakDefinition,
  rateTable,
  taxNote,
  cancellationPolicy,
  alsoListedIntro,
} from "@/content/rates";
import { EVENTS } from "@/lib/analytics/events";

export const metadata: Metadata = {
  title: "Rates & Reservations",
  description:
    "Peak and off-peak rates for direct bookings at Aldebaran Farm in Spring Green, Wisconsin — also listed on Airbnb and Vrbo.",
};

/**
 * Rates & Reservations page. Contact details come from the property data
 * (`getProperty()`); rate table and policy copy come from `content/rates.ts`.
 */
export default async function ReservationsPage() {
  const property = await getProperty();
  const telHref = buildInquiryTelUrl(property);

  return (
    <Container>
      <PageTitle>Rates &amp; Reservations</PageTitle>

      <div className="mx-auto max-w-2xl pb-16 pt-8 md:pt-12">
        <p>{reservationIntro}</p>

        <p className="mt-4">
          <span className="font-bold">Email:</span>{" "}
          <a
            href={buildInquiryMailtoUrl(property)}
            data-track={EVENTS.inquiryEmailClick}
            className={proseLinkClass}
          >
            {property.contactEmail}
          </a>
        </p>
        <p className="mt-2">
          <span className="font-bold">Phone:</span>{" "}
          <a href={telHref} data-track={EVENTS.inquiryPhoneClick} className={proseLinkClass}>
            {property.contactPhone}
          </a>
        </p>

        <p className="mt-6">
          Please read through our{" "}
          <Link href="/faqs" className={proseLinkClass}>
            FAQs
          </Link>{" "}
          before reserving — it covers house rules, what&apos;s provided, and other details worth
          knowing ahead of time.
        </p>

        <SectionHeading className="mt-10">Rates</SectionHeading>
        <p className="mt-4">{peakDefinition}</p>

        <RateTable rows={rateTable} className="mt-6" />

        <p className="mt-6">{taxNote}</p>

        <SectionHeading as="h3" className="mt-8">
          Also Listed on Airbnb &amp; Vrbo
        </SectionHeading>
        <p className="mt-4">{alsoListedIntro}</p>

        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <ListingLink href={property.airbnbUrl} label="Book on Airbnb" destination="airbnb" />
          <ListingLink href={property.vrboUrl} label="Book on Vrbo" destination="vrbo" />
        </div>

        <p className="mt-8 font-bold">Cancellation Policy</p>
        <p className="mt-1 leading-relaxed">{cancellationPolicy}</p>
      </div>
    </Container>
  );
}
