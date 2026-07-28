import { StarRating } from "./StarRating";
import { ExternalLink } from "@/components/shared/ExternalLink";
import { proseLinkClass } from "@/components/shared/links";
import type { Review, ReviewSource, ReviewSourceInfo } from "@/content/reviews";

/**
 * ReviewCard — a single guest review: stars, the quote, and attribution
 * (author · date · via <platform>), where the platform name links out to the
 * listing it came from. A hairline-bordered panel using the shared border token
 * so it sits quietly alongside the rest of the site's minimal blocks.
 */
export function ReviewCard({
  review,
  sources,
}: {
  review: Review;
  sources: Record<ReviewSource, ReviewSourceInfo>;
}) {
  const source = sources[review.source];

  return (
    <figure className="flex h-full flex-col gap-3 rounded-lg border border-border p-5">
      <StarRating rating={review.rating} className="text-sm" />

      <blockquote className="leading-relaxed">&ldquo;{review.quote}&rdquo;</blockquote>

      <figcaption className="mt-auto pt-2 text-sm">
        <span className="font-semibold">{review.author}</span>
        <span className="text-muted-foreground">
          {review.date ? <> &middot; {review.date}</> : null} &middot; via{" "}
          <ExternalLink href={source.url} className={proseLinkClass}>
            {source.label}
          </ExternalLink>
        </span>
      </figcaption>
    </figure>
  );
}
