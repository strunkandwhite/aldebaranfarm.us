/**
 * Guest reviews (Google) content.
 *
 * Hand-curated: paste a few of the best real Google reviews below, keep the
 * aggregate (`ratingAverage` / `ratingCount`) in sync by hand, and the badge
 * links out to the full Google listing (`googleReviewsUrl`). This matches the
 * rest of the site's content model — edit the file, redeploy — and loads
 * instantly. Reviews change slowly, so a manual refresh now and then is all it
 * needs.
 */

export interface Review {
  /** Reviewer's name as it appears on Google. */
  author: string;
  /** Human-readable month/year, e.g. "August 2024". */
  date: string;
  /** Star rating, 1–5. */
  rating: number;
  /** The review text. Trim very long reviews to a few sentences. */
  quote: string;
}

/**
 * The Google rating aggregate shown in the badge. Read these off the live Google
 * listing and update them when you refresh the quotes below. Leave both at 0 to
 * hide the stars (the badge then shows a plain "Read our Google reviews" link).
 */
export const ratingAverage = 0.0;
export const ratingCount = 0;

/**
 * Link out to the full Google listing (and where guests can leave a review).
 * This is the canonical Maps deep link for the Aldebaran Farm place (by CID).
 */
export const googleReviewsUrl =
  "https://www.google.com/maps?cid=3949785469219734696";

export const reviews: Review[] = [
  {
    author: "Pete K.",
    date: "4 years ago ",
    rating: 5,
    quote:
      "We had a great family reunion at this rustic farmhouse nestled in the rolling Wisconsin “Driftless” area. Convenient for group and individual adventures such as the Frank Lloyd Wright attractions, bicycling, hiking, the Aldo Leopold Center, Madison, and the small towns with their unique flairs. Highly recommend staying there. Hosts were great, welcoming and friendly. Will definitely come back when we return to the area. A place to create good new memories.  A view from behind the house looking out is one of those we will treasure.",
  },
  {
    author: "Lisa S.",
    date: "4 years ago ",
    rating: 5,
    quote:
      "Magical Airbnb if you want to experience Frank Lloyd Wright's Wisconsin countryside! You can see Taliesin from the front porch. Quiet except for the birdsong. Unplug, unwind. I would definitely visit again.",
  },
  {
    author: "Linda M.",
    date: "4 years ago ",
    rating: 5,
    quote:
      "We really felt like we were going back in time at Aldebaran. The house is rustic and charming, with just the right amount of amenities for us--fully stocked kitchen and bathrooms, and less technology so we could really disconnect and relax away from the world. Comfy beds and so many areas in the house to relax. Touches of Frank Lloyd Wright's style in the home, which was renovated by his son-in-law who studied with him. The land around the home is stunning and untouched, with beautiful views of the Taliesin barn across the valley and a short walk from Unity Chapel. Spring Green is a cute town with fun things to do. We had a wonderful time at Aldebaran--thank you!",
  },
];
