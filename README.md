# Aldebaran Farm — aldebaranfarm.us

Marketing and booking-info site for [Aldebaran Farm](https://aldebaranfarm.us),
a historic vacation-rental property in Spring Green, Wisconsin. Six static
pages; guests reserve directly by email or phone (no online booking).

**Stack:** Next.js (App Router, TypeScript) · Tailwind CSS v4 · shadcn/ui ·
file-based content · deployed on Vercel.

## Development

```bash
pnpm install
pnpm dev      # dev server at http://localhost:3000
pnpm build    # production build (doubles as the type check)
pnpm lint     # ESLint
```

## Where things live

- `app/` — routes (Home, The House, Gallery, Things To Do, FAQs, Reservations)
- `content/` — editable site content (property data, rates, FAQs, gallery)
- `lib/` — isolation layers for data, images, and booking
- `docs/` — architecture, style guide, and the original project plan

Start with [`docs/architecture.md`](docs/architecture.md); most directories
also carry their own README.
