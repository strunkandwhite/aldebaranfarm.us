# components/

React components, grouped by role:

- **`ui/`** — shadcn/ui primitives (button, card, …). Generated; restyled via
  design tokens in `app/globals.css`. Don't hand-edit unless customizing a
  primitive.
- **`layout/`** — structural chrome (Header, Footer, Nav, Container).
- **`property/`** — property-specific sections (Hero, Gallery, Amenities,
  LocationMap, Reviews, BookingCta). Each receives a typed `Property`.
- **`shared/`** — small cross-cutting building blocks (e.g. ExternalLink).

**Data rule:** components receive data as props (a `Property`). They never read
`content/` or call `gray-matter`. Only `lib/data` knows the source. See
`docs/architecture.md`.
