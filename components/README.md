# components/

React components, grouped by role:

- **`ui/`** — shadcn/ui primitives (button). Generated; restyled via design
  tokens in `app/globals.css`. Don't hand-edit unless customizing a primitive.
- **`layout/`** — structural chrome (Header, Nav, MobileNav, Footer, Container,
  PageTitle, SectionHeading).
- **`property/`** — property-specific sections (Hero, DetailsAndAmenities,
  History, RateTable). Data-bearing ones receive a typed `Property`.
- **`gallery/`** — the photo grid + lightbox (GalleryGrid).
- **`reviews/`** — the home page's guest-reviews section (Reviews, ReviewCard,
  StarRating).
- **`shared/`** — small cross-cutting building blocks (ExternalLink,
  FramedImage, QAItem, RichText).
- **`analytics/`** — analytics plumbing (TrackedClicks), mounted once in the
  root layout.

**Data rule:** components receive data as props (a `Property`). They never
import content values themselves (type-only imports from `content/` are fine —
the data contracts are co-located with the data), nor call `gray-matter`. Only
`lib/data` knows the source. See `docs/architecture.md`.
