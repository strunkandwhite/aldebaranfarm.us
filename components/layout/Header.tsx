import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { leftNavLinks, rightNavLinks, navLinkClass } from "./Nav";
import { bookNowHref } from "@/lib/site";
import { EVENTS } from "@/lib/analytics/events";

/**
 * Header — responsive site header.
 *
 * At 820px and above (iPad portrait and up): every item (the left links, the
 * centered "Aldebaran Farm" wordmark, the right link, and the Book Now CTA) is a
 * DIRECT sibling of a single `justify-between` row, so the gaps between all of
 * them are identical.
 *
 * Below 820px (phones/small tablets): the wordmark stays inline and the links
 * collapse into a hamburger drawer (see `MobileNav`).
 */
export function Header() {
  return (
    <header className="bg-background">
      <Container className="py-6">
        {/* Desktop (xl+): full evenly-spaced nav */}
        <nav aria-label="Primary" className="hidden items-center justify-between min-[820px]:flex">
          {leftNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}

          <Link href="/" className="font-heading text-4xl text-primary xl:text-5xl">
            Aldebaran Farm
          </Link>

          {rightNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}

          <Button
            render={
              <Link
                href={bookNowHref}
                data-track={EVENTS.bookNowClick}
                data-track-location="header"
              />
            }
            nativeButton={false}
            className="h-auto rounded-none px-5 py-2 font-heading text-base"
          >
            Book Now
          </Button>
        </nav>

        {/* Phones & small tablets (< 820px): wordmark + hamburger drawer */}
        <div className="flex items-center justify-between min-[820px]:hidden">
          <Link href="/" className="font-heading text-3xl text-primary sm:text-4xl">
            Aldebaran Farm
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
