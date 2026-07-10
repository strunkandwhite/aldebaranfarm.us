import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FramedImage } from "@/components/shared/FramedImage";
import { SectionHeading } from "@/components/layout/SectionHeading";
import type { Property } from "@/types/property";

/**
 * DetailsAndAmenities — The House page's first section: the framed exterior photo
 * on the left with the sleeping arrangements, amenities, and a gallery link on the
 * right. Mirrors the home hero's spacing rhythm (gap-8 / md:gap-12 / lg:gap-16).
 *
 * Responsive: two columns on md+, stacked (photo then details) on small screens.
 */
export function DetailsAndAmenities({ property }: { property: Property }) {
  const sleepsLine = `Sleeps ${property.maxGuests} comfortably in ${property.bedrooms} bedrooms / ${property.loftedBeds} lofted bed / ${property.bathrooms} full bathrooms`;

  return (
    <section className="grid items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-12 lg:gap-16">
      <FramedImage
        src="/images/property/aldebaran_details.jpg"
        alt="The main house at Aldebaran Farm, framed by oak trees"
        orientation="landscape"
        // First section on /house — this photo is the page's LCP element.
        priority
        className="mx-auto w-full max-w-lg md:mx-0 md:max-w-none"
        sizes="(min-width: 768px) 45vw, 85vw"
      />

      <div>
        <SectionHeading>Details &amp; Amenities</SectionHeading>

        <p className="mt-4">{sleepsLine}</p>

        <ul className="mt-4 list-disc space-y-1 pl-5">
          {property.beds.map((bed) => (
            <li key={bed}>{bed}</li>
          ))}
        </ul>

        <p className="mt-6 font-medium">Amenities:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {property.amenities.map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
        </ul>

        <p className="mt-6">Please note there is NO TV.</p>

        <Button
          variant="brand"
          size="brand-lg"
          render={<Link href="/gallery" />}
          nativeButton={false}
          className="mt-6"
        >
          View Gallery &rarr;
        </Button>
      </div>
    </section>
  );
}
