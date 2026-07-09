import { ExternalLink as ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/shared/ExternalLink";
import type { Property } from "@/types/property";

/**
 * VrboLink — a button that opens the property's Vrbo listing in a new tab.
 * An equally-weighted way to book, alongside email, phone, and Airbnb. Unlike
 * Airbnb, Vrbo has no confirmed official embed widget, so this link stands on
 * its own. See docs/superpowers/specs/2026-07-09-airbnb-booking-option-design.md.
 */
export function VrboLink({ property }: { property: Property }) {
  return (
    <Button
      nativeButton={false}
      render={<ExternalLink href={property.vrboUrl} data-track-destination="vrbo" />}
    >
      Book on Vrbo
      <ExternalLinkIcon data-icon="inline-end" />
    </Button>
  );
}
