import Link from "next/link";

import { Container } from "./Container";
import { leftNavLinks, rightNavLinks, bookNowHref } from "./Nav";

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
          <Link href="/" className="font-heading text-2xl text-primary">
            Aldebaran Farm
          </Link>
          <p className="mt-1 text-sm text-foreground">
            6557 County T, Spring Green, WI
          </p>
          <p className="text-sm text-foreground">
            <a href="mailto:aldebaran.farm.rental@gmail.com" className="underline-offset-4 hover:underline">
              aldebaran.farm.rental@gmail.com
            </a>{" "}
            &middot;{" "}
            <a href="tel:+13124012484" className="underline-offset-4 hover:underline">
              (312) 401-2484
            </a>
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2 text-sm sm:items-end">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="mt-8">
        <p className="text-xs text-foreground">
          &copy; {new Date().getFullYear()} Aldebaran Farm
        </p>
      </Container>
    </footer>
  );
}
