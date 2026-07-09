import Link from "next/link";
import Image from "next/image";

import { Container } from "./Container";
import { leftNavLinks, rightNavLinks, bookNowHref } from "./Nav";
import { ReviewsBadge } from "@/components/reviews/ReviewsBadge";
import { ExternalLink } from "@/components/shared/ExternalLink";
import { imageUrl } from "@/lib/images";

/** Google Maps deep link to the property's location. */
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=6557+County+T%2C+Spring+Green%2C+WI";

const footerLinks = [
  ...leftNavLinks,
  ...rightNavLinks,
  { href: bookNowHref, label: "Rates & Reservations" },
];

/**
 * Footer — site footer with the wordmark, quick links, and contact details.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 font-heading text-2xl text-primary">
            <Image
              src={imageUrl("/images/brand/logo.png")}
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-sm"
            />
            Aldebaran Farm
          </Link>
          <p className="mt-1 text-sm text-foreground">
            <ExternalLink
              href={mapsUrl}
              className="underline-offset-4 hover:underline"
            >
              6557 County T, Spring Green, WI
            </ExternalLink>
          </p>
          <p className="text-sm text-foreground">
            <a
              href="mailto:aldebaran.farm.rental@gmail.com"
              className="underline-offset-4 hover:underline"
            >
              aldebaran.farm.rental@gmail.com
            </a>{" "}
            &middot;{" "}
            <a href="tel:+13124012484" className="underline-offset-4 hover:underline">
              (312) 401-2484
            </a>
          </p>
          <div className="mt-3">
            <ReviewsBadge />
          </div>
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

      <Container className="mt-8">
        <p className="text-xs text-foreground">&copy; {new Date().getFullYear()} Aldebaran Farm</p>
      </Container>
    </footer>
  );
}
