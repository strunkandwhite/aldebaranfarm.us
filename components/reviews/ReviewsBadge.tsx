import { StarRating } from "./StarRating";
import { ExternalLink } from "@/components/shared/ExternalLink";
import { cn } from "@/lib/utils";
import { ratingAverage, ratingCount, googleReviewsUrl } from "@/content/reviews";

/**
 * ReviewsBadge — a compact "★★★★★ 4.9 · N reviews on Google" link out to the
 * full Google listing. Used as a persistent trust signal in the footer and in
 * the home-page reviews section.
 *
 * The rating/count are hand-maintained in `content/reviews.ts`. Until they're
 * set (both left at 0), the badge degrades to a plain "Read our Google reviews"
 * link rather than showing empty stars.
 */
export function ReviewsBadge({
  showCount = true,
  className,
}: {
  showCount?: boolean;
  className?: string;
}) {
  const hasRatings = ratingCount > 0;

  return (
    <ExternalLink
      href={googleReviewsUrl}
      className={cn(
        "inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline",
        className
      )}
    >
      {hasRatings ? (
        <>
          <StarRating rating={ratingAverage} className="text-[0.95em]" />
          <span>
            <span className="font-semibold">{ratingAverage}</span>
            {showCount && (
              <span className="text-muted-foreground"> &middot; {ratingCount} reviews</span>
            )}{" "}
            on Google
          </span>
        </>
      ) : (
        <span>Read our Google reviews &rarr;</span>
      )}
    </ExternalLink>
  );
}
