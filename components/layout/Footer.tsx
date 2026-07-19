import Link from "next/link";
import Image from "next/image";

import { Container } from "./Container";
import { leftNavLinks, rightNavLinks } from "./Nav";
import { ExternalLink } from "@/components/shared/ExternalLink";
import { EVENTS } from "@/lib/analytics/events";
import { buildInquiryMailtoUrl, buildInquiryTelUrl } from "@/lib/booking";
import { getProperty } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { bookNowHref } from "@/lib/site";

const footerLinks = [
  ...leftNavLinks,
  ...rightNavLinks,
  { href: bookNowHref, label: "Rates & Reservations" },
];

/**
 * Footer — site footer with the wordmark, quick links, and contact details.
 * Contact info and the address come from the Property (single source of
 * truth: content/property.md) — never hard-code them here.
 */
export async function Footer() {
  const property = await getProperty();
  const { streetAddress, city, regionCode } = property.location;
  const addressLine = `${streetAddress}, ${city}, ${regionCode}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`;

  return (
    <footer className="mt-auto border-t border-border py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-between">
        <div className="flex flex-col">
          <div>
            <Link href="/" className="flex items-center gap-2 font-heading text-2xl text-primary">
              <Image
                src={imageUrl("/images/brand/logo.png")}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-sm"
              />
              {property.name}
            </Link>
            {/* py-1 keeps each contact link at the 24px minimum touch-target height. */}
            <p className="mt-1 text-sm text-foreground">
              <ExternalLink
                href={mapsUrl}
                className="inline-block py-1 underline-offset-4 hover:underline"
              >
                {addressLine}
              </ExternalLink>
            </p>
            <p className="text-sm text-foreground">
              <a
                href={buildInquiryMailtoUrl(property)}
                data-track={EVENTS.inquiryEmailClick}
                data-track-location="footer"
                className="inline-block py-1 underline-offset-4 hover:underline"
              >
                {property.contactEmail}
              </a>{" "}
              &middot;{" "}
              <a
                href={buildInquiryTelUrl(property)}
                data-track={EVENTS.inquiryPhoneClick}
                data-track-location="footer"
                className="inline-block py-1 underline-offset-4 hover:underline"
              >
                {property.contactPhone}
              </a>
            </p>
          </div>

          <p className="mt-6 text-xs text-foreground sm:mt-auto">
            &copy; {new Date().getFullYear()} {property.name}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2 text-sm sm:items-end">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
