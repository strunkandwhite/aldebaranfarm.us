import { ExternalLink as ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/shared/ExternalLink";

/**
 * ListingLink — a button that opens one of the property's platform listings
 * (Airbnb, Vrbo, …) in a new tab. The reservations page presents these as
 * secondary paths below direct email/phone booking. The listing URL comes
 * from the Property (content/property.md) via the page.
 */
export function ListingLink({
  href,
  label,
  destination,
}: {
  href: string;
  label: string;
  destination: string;
}) {
  return (
    <Button
      nativeButton={false}
      render={<ExternalLink href={href} data-track-destination={destination} />}
    >
      {label}
      <ExternalLinkIcon data-icon="inline-end" />
    </Button>
  );
}
