import Image from "next/image";

import { imageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * FramedImage — the recurring photo treatment from the mock: an image with a
 * #E8DED2 block offset behind its lower-left, giving a matted, framed feel.
 *
 * To keep the site visually consistent, every framed photo renders in a FIXED
 * aspect-ratio frame per orientation (portrait 2:3, landscape 3:2) and uses
 * `object-cover`, so all images of the same orientation are the SAME SIZE
 * regardless of the source file's dimensions. If a source's aspect ratio does
 * not match its frame it will be center-cropped to fill — swap to a matching
 * ratio, or crop the source, to avoid losing content.
 *
 * Cross-cutting visual, so it lives in `shared`. All srcs resolve through
 * `imageUrl()` so a future CDN move is a one-file change.
 *
 * The #E8DED2 block is offset down-left, but its footprint is RESERVED INSIDE the
 * component's own box: the photo is inset from the left/bottom by `OFFSET` and the
 * block fills the remaining lower-left area. So the whole treatment stays within
 * `className`'s bounds and never overflows onto the page edge — page padding and
 * layout gaps then space it predictably. The photo is a later, positioned sibling
 * than the block, so it paints on top with no z-index needed.
 */
const ASPECT = {
  portrait: "aspect-[2/3]",
  landscape: "aspect-[3/2]",
} as const;

/** How far the shadow block peeks past the photo (left & bottom). */
const OFFSET = "2rem";

export function FramedImage({
  src,
  alt,
  orientation = "landscape",
  className,
  priority,
  sizes = "(min-width: 768px) 22rem, 85vw",
}: {
  src: string;
  alt: string;
  orientation?: keyof typeof ASPECT;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="absolute bottom-0 left-0 bg-brand-shadow"
        style={{ width: `calc(100% - ${OFFSET})`, height: `calc(100% - ${OFFSET})` }}
      />
      <div
        className={cn("relative overflow-hidden", ASPECT[orientation])}
        style={{ marginLeft: OFFSET, marginBottom: OFFSET }}
      >
        <Image
          src={imageUrl(src)}
          alt={alt}
          fill
          priority={priority}
          // `priority` alone doesn't set the browser fetch priority; hint it
          // explicitly so the LCP image wins bandwidth over scripts/styles.
          fetchPriority={priority ? "high" : undefined}
          quality={priority ? 50 : 60}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </div>
  );
}
