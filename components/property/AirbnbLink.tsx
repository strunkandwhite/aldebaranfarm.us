import { ExternalLink as ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/shared/ExternalLink";
import type { Property } from "@/types/property";

/**
 * AirbnbLink — a button that opens the property's Airbnb listing in a new
 * tab. An equally-weighted third way to book, alongside email and phone. See
 * docs/superpowers/specs/2026-07-09-airbnb-booking-option-design.md.
 */
export function AirbnbLink({ property }: { property: Property }) {
  return (
    <Button
      nativeButton={false}
      render={<ExternalLink href={property.airbnbUrl} data-track-destination="airbnb" />}
    >
      Book on Airbnb
      <ExternalLinkIcon data-icon="inline-end" />
    </Button>
  );
}
