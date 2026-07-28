# components/reviews

The home page's guest-reviews section.

- `Reviews` — the "Guest Reviews" section: heading + responsive card grid.
- `ReviewCard` — one review: star rating, quote, attribution ("author · date · via <platform>", where the platform links to the listing the review came from).
- `StarRating` — five brand-burgundy stars with fractional support, announced via `aria-label`.

Data flow: `app/page.tsx` imports the curated reviews from `content/reviews.ts`, derives the Airbnb/Vrbo attribution URLs from the `Property` (so listing URLs live only in `content/property.md`), and passes both down as props. Components here never import content values themselves.
