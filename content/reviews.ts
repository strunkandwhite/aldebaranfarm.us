/**
 * Guest reviews content.
 *
 * Hand-curated from the property's Google, Airbnb, and Vrbo listings. Each review
 * names its `source` platform; the "via …" attribution on the card links out to
 * that listing. Edit the file, redeploy — matches the rest of the site's content
 * model and loads instantly.
 */

/** The platform a review came from — drives the "via …" attribution link. */
export type ReviewSource = "google" | "airbnb" | "vrbo";

export interface Review {
  /** Reviewer's name as it appears on the source platform. */
  author: string;
  /** Human-readable date, e.g. "September 2025". Optional — omit if unknown. */
  date?: string;
  /** Star rating, 1–5. Convert other scales (e.g. Vrbo's 10/10) to 5. */
  rating: number;
  /** The review text. Trim very long reviews to a few sentences. */
  quote: string;
  /** Which listing the review came from. */
  source: ReviewSource;
}

/**
 * Canonical Google Maps deep link for the Aldebaran Farm place (by CID) — used
 * for the "via Google" attribution.
 */
export const googleReviewsUrl = "https://www.google.com/maps?cid=3949785469219734696";

/**
 * Display label + outbound listing URL for each source. The Airbnb/Vrbo URLs
 * mirror `content/property.md` (airbnbUrl / vrboUrl).
 */
export const reviewSources: Record<ReviewSource, { label: string; url: string }> = {
  google: { label: "Google", url: googleReviewsUrl },
  airbnb: { label: "Airbnb", url: "https://www.airbnb.com/rooms/30441325" },
  vrbo: { label: "Vrbo", url: "https://www.vrbo.com/1893752" },
};

export const reviews: Review[] = [
  {
    author: "Linda M.",
    date: "4 years ago",
    rating: 5,
    source: "google",
    quote:
      "We really felt like we were going back in time at Aldebaran. The house is rustic and charming, with just the right amount of amenities for us--fully stocked kitchen and bathrooms, and less technology so we could really disconnect and relax away from the world. Comfy beds and so many areas in the house to relax. Touches of Frank Lloyd Wright's style in the home, which was renovated by his son-in-law who studied with him. The land around the home is stunning and untouched, with beautiful views of the Taliesin barn across the valley and a short walk from Unity Chapel. Spring Green is a cute town with fun things to do. We had a wonderful time at Aldebaran--thank you!",
  },
  {
    author: "Julie",
    date: "September 2025",
    rating: 5,
    source: "airbnb",
    quote:
      "I already booked our return stay in 2026!  We were delighted to find this comfortable, well supplied home for our American Players Theatre trip. The house was roomy enough for the four of us, beautifully situated in the Frank Lloyd Wright Taliesin farmlands. We fell into easy conversations over meals and after the plays in space that is designed for reflection.  I would guess it's not for everyone - no television, remote - but it was perfect for us.  Michael and his wife Mary were welcoming and accommodating hosts.",
  },
  {
    // Originally 10/10 on Vrbo — converted to 5 stars for a consistent star row.
    author: "Anne L.",
    date: "August 2023",
    rating: 5,
    source: "vrbo",
    quote:
      "I booked the house for a long weekend we always spend with my husband, his brothers and their families. We weren't the first ones to arrive and when we did they were like \"you guys, I can't believe how amazing this place is\". There was plenty of room for everyone, even the 5 kids. There was room for all of us to eat together at the huge table, and we spent evenings sitting on the front porch while the kids ran up and down the hill catching lightning bugs. The house was close to sights and things to do, but felt very rural in the best way. 100% would come stay again.",
  },
];
