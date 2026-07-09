import Script from "next/script";

import { ExternalLink } from "@/components/shared/ExternalLink";
import type { Property } from "@/types/property";

const LISTING_ID_PATTERN = /\/rooms\/(\d+)/;

/**
 * AirbnbEmbed — Airbnb's official embeddable listing widget, generated from
 * the host dashboard (Listings -> listing editor -> View -> Share -> Embed ->
 * Copy HTML). The airbnb_jssdk script hydrates the .airbnb-embed-frame div
 * client-side into a live preview card; the two links below are the no-JS /
 * script-blocked fallback (ad blockers commonly block this script), rendered
 * via the shared `ExternalLink` component (safe target/rel + tracking
 * defaults) rather than Airbnb's original raw anchors.
 *
 * The fallback description line is built from typed Property fields rather
 * than Airbnb's snapshotted "★4.82" text, which would go stale in source.
 */
export function AirbnbEmbed({ property }: { property: Property }) {
  const match = property.airbnbUrl.match(LISTING_ID_PATTERN);
  if (!match) return null;

  const listingId = match[1];
  const fallbackHref = `https://www.airbnb.com/rooms/${listingId}`;
  const fallbackDescription = [
    property.location.city,
    `${property.bedrooms} bedroom${property.bedrooms === 1 ? "" : "s"}`,
    `${property.bathrooms} bathroom${property.bathrooms === 1 ? "" : "s"}`,
  ].join(" · ");

  return (
    <div
      className="airbnb-embed-frame"
      data-id={listingId}
      data-view="home"
      data-hide-price="true"
      style={{ width: 450, maxWidth: "100%", height: 300, margin: "auto" }}
    >
      <ExternalLink href={fallbackHref} data-track-destination="airbnb">
        View On Airbnb
      </ExternalLink>
      <ExternalLink
        href={fallbackHref}
        rel="nofollow noopener noreferrer"
        data-track-destination="airbnb"
      >
        {fallbackDescription}
      </ExternalLink>
      <Script
        id="airbnb-jssdk"
        src="https://www.airbnb.com/embeddable/airbnb_jssdk"
        strategy="lazyOnload"
      />
    </div>
  );
}
