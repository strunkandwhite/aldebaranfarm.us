import type { Metadata } from "next";
import Link from "next/link";

import { getProperty } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageTitle } from "@/components/layout/PageTitle";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { RateTable } from "@/components/property/RateTable";
import {
  reservationIntro,
  peakDefinition,
  rateTable,
  taxNote,
  cancellationPolicy,
} from "@/content/rates";

export const metadata: Metadata = {
  title: "Rates & Reservations — Aldebaran Farm",
  description:
    "Peak and off-peak rates for Aldebaran Farm in Spring Green, Wisconsin. Reserve directly by email or phone.",
};

/**
 * Rates & Reservations page. Contact details come from the property data
 * (`getProperty()`); rate table and policy copy come from `content/rates.ts`.
 */
export default async function ReservationsPage() {
  const property = await getProperty();
  const telHref = `tel:+1${property.contactPhone.replace(/\D/g, "")}`;

  return (
    <Container>
      <div className="pt-6 md:pt-10">
        <PageTitle>Rates &amp; Reservations</PageTitle>
      </div>

      <div className="mx-auto max-w-2xl pb-16 pt-8 md:pt-12">
        <p>{reservationIntro}</p>

        <p className="mt-4">
          <span className="font-semibold">Email:</span>{" "}
          <a
            href={`mailto:${property.contactEmail}`}
            className="underline underline-offset-4 hover:opacity-70"
          >
            {property.contactEmail}
          </a>
        </p>
        <p className="mt-2">
          <span className="font-semibold">Phone:</span>{" "}
          <a
            href={telHref}
            className="underline underline-offset-4 hover:opacity-70"
          >
            {property.contactPhone}
          </a>
        </p>

        <p className="mt-6">
          Please read through our{" "}
          <Link
            href="/faqs"
            className="underline underline-offset-4 hover:opacity-70"
          >
            FAQs
          </Link>{" "}
          before reserving — it covers house rules, what&apos;s provided, and
          other details worth knowing ahead of time.
        </p>

        <SectionHeading className="mt-12">Rates</SectionHeading>
        <p className="mt-4">{peakDefinition}</p>

        <RateTable rows={rateTable} className="mt-6" />

        <p className="mt-6">{taxNote}</p>

        <p className="mt-8 font-semibold">Cancellation Policy</p>
        <p className="mt-1 leading-relaxed">{cancellationPolicy}</p>
      </div>
    </Container>
  );
}
