import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FramedImage } from "@/components/shared/FramedImage";
import { bookNowHref } from "@/components/layout/Nav";
import type { Property } from "@/types/property";

/**
 * Hero — the home page hero from the mock: a two-column layout with the framed
 * lead photo on the left and the intro (tagline heading, description, quick-facts
 * summary, and Book Now CTA) on the right.
 *
 * Part of the end-to-end data flow — everything here comes from
 * `content/property.md` via `lib/data.getProperty()`.
 */
export function Hero({ property }: { property: Property }) {
  const lead = property.images[0];

  const facts = [
    `Sleeps ${property.maxGuests}`,
    `${property.bedrooms} Bedroom${property.bedrooms === 1 ? "" : "s"}`,
    `${property.loftedBeds} Lofted Bed${property.loftedBeds === 1 ? "" : "s"}`,
    `${property.bathrooms} Bathroom${property.bathrooms === 1 ? "" : "s"}`,
  ].join(" • ");

  return (
    <section className="grid items-center gap-8 pt-12 pb-8 md:grid-cols-[22rem_1fr] md:gap-12 md:pt-20 md:pb-12 lg:gap-16">
      <FramedImage
        src={lead.src}
        alt={lead.alt}
        orientation="portrait"
        priority
        className="mx-auto w-full max-w-xs sm:max-w-sm md:mx-0 md:max-w-none"
      />

      <div>
        <h1 className="font-heading text-[24px] leading-snug text-primary sm:text-[28px]">
          {property.tagline}
        </h1>

        <p className="mt-6 text-base leading-relaxed text-foreground">
          {property.description}
        </p>

        <p className="mt-6 font-medium text-primary">{facts}</p>

        <Button
          render={<Link href={bookNowHref} />}
          nativeButton={false}
          className="mt-8 h-auto rounded-none px-8 py-3 font-heading text-base"
        >
          Book Now
        </Button>
      </div>
    </section>
  );
}
