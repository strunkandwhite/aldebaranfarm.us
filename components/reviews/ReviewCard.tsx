import { StarRating } from "./StarRating";
import type { Review } from "@/content/reviews";

/**
 * ReviewCard — a single guest review: stars, the quote, and attribution
 * (author · date · Google). A hairline-bordered panel using the shared border
 * token so it sits quietly alongside the rest of the site's minimal blocks.
 */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col gap-3 rounded-lg border border-border p-5">
      <StarRating rating={review.rating} className="text-sm" />

      <blockquote className="leading-relaxed">&ldquo;{review.quote}&rdquo;</blockquote>

      <figcaption className="mt-auto pt-2 text-sm">
        <span className="font-semibold">{review.author}</span>
        <span className="text-muted-foreground"> &middot; {review.date} &middot; via Google</span>
      </figcaption>
    </figure>
  );
}
