import { SectionHeading } from "@/components/layout/SectionHeading";
import { ReviewCard } from "./ReviewCard";
import { ReviewsBadge } from "./ReviewsBadge";
import { reviews } from "@/content/reviews";

/**
 * Reviews — the guest-reviews section shown on the home page, directly below the
 * hero: a "Guest Reviews" heading, the Google rating aggregate, and a row of
 * review cards. Follows the same section rhythm as the rest of the site
 * (SectionHeading + mt-4/mt-6 spacing).
 */
export function Reviews() {
  return (
    <section className="pt-4 pb-16 md:pt-6 md:pb-24">
      <SectionHeading>Guest Reviews</SectionHeading>

      <div className="mt-3">
        <ReviewsBadge />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </section>
  );
}
