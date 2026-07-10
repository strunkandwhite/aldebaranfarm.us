# Style Guide — Aldebaran Farm

Brand tokens are defined and wired. Theme lives in **`app/globals.css`** (Tailwind v4
`@theme` + `:root`); fonts load in **`app/layout.tsx`**. shadcn/ui primitives read the
semantic tokens, so restyling tokens restyles the whole component library at once.

Source values are from the Figma style-guide mock. Hex is the design source of truth; the
CSS uses OKLCH approximations — **confirm/fine-tune against Figma** as pages are built.

## Colors

| Name     | Hex       | CSS value               | Semantic role                                                | Utility           |
| -------- | --------- | ----------------------- | ------------------------------------------------------------ | ----------------- |
| Burgundy | `#770A15` | `#770a15`               | `--foreground`, `--primary`, `--ring` (text, buttons, links) | `brand-burgundy`  |
| Cream    | `#F4EDE1` | `oklch(0.955 0.012 85)` | `--background`, `--card`                                     | `brand-cream`     |
| Sand     | `#E6DAC6` | `oklch(0.89 0.022 80)`  | `--secondary`, borders                                       | `brand-sand`      |
| Sage     | `#6C7F63` | `oklch(0.56 0.045 135)` | `--accent`                                                   | `brand-sage`      |
| Shadow   | `#E8DED2` | `#e8ded2`               | `--color-brand-shadow` — the `FramedImage` offset block      | `bg-brand-shadow` |

- **All text is `#770A15` (burgundy) by default** — both `--foreground` (body) and
  `--primary` (headings, links, button fill) are set to it. Use a different text color only
  when specifically intended; avoid `text-muted-foreground` for normal copy.
- Raw hues are also exposed as Tailwind utilities: `bg-brand-burgundy`, `text-brand-sage`, etc.

## Typography

| Style          | Font             | Size | Usage                     |
| -------------- | ---------------- | ---- | ------------------------- |
| Homepage title | Playfair Display | 60pt | Home hero wordmark        |
| Header         | Playfair Display | 40pt | Page titles (`PageTitle`) |
| Subheader      | Playfair Display | 28pt | Section headings          |
| Menu links     | Playfair Display | 20pt | Nav                       |
| Body           | Helvetica Neue*  | 16pt | Paragraph text            |

- Headings → `--font-heading` (Playfair Display, loaded via `next/font/google`).
  `h1–h4` default to it in the base layer; use `font-heading` elsewhere.
- \*Body → `--font-sans`: **self-hosted Helvetica Neue**, loaded via `next/font/local` in
  `app/layout.tsx`. Weights 400/500/700 live in `app/fonts/HelveticaNeue-*.woff2` (extracted
  from `HelveticaNeue.ttc` and converted to woff2). A system stack (`-apple-system`,
  `Segoe UI`, `Arial`, …) is the fallback during the swap window / if the files fail to load.
- ⚠️ **Licensing:** Helvetica Neue is a proprietary Monotype/Linotype typeface. Serving it
  publicly requires a web-embedding license — confirm coverage before going to production.
  To revert to a no-license setup, drop `fontSans`/the `app/fonts` files and set `--font-sans`
  to the system stack.

## Links

One "underline = link" language, since link color equals body text (#770A15):

- **Prose / inline links** (within body copy): underlined at rest
  (`underline underline-offset-4`) — required for accessibility, since color alone
  doesn't distinguish them from surrounding text. Hover fades to 70% opacity.
  Shared via `proseLinkClass` in `components/shared/links.ts`.
- **Nav links** (header, mobile drawer; grouped, their placement signals
  link-ness): no underline at rest, **underline on hover**
  (`underline-offset-4 hover:underline`). Shared via `navLinkClass` in the
  same file. The footer's quick links use their own, smaller version of the
  same treatment (see `Footer.tsx`) rather than sharing the constant.
- **Primary actions** (Book Now, View Gallery) are filled burgundy buttons, not
  links: the `brand` variant of `Button` (`components/ui/button.tsx`) — square
  corners, Playfair, filled `--primary` — is the canonical CTA, paired with
  the `brand-sm`/`brand-lg` sizes rather than the default shadcn sizes.

## Radius

`--radius: 0.25rem` — squared-off, matching the mock's near-rectangular buttons. The
`--radius-sm/md/lg/xl…` scale derives from it.

## Brand assets

- [x] Wordmark is text (Playfair `Aldebaran Farm`) in `Header`. The footer
      pairs it with a small logo image (`/images/brand/logo.png`) beside the
      text wordmark, rather than text alone.
- [x] Favicon set → `app/favicon.ico` (16/32/48), `app/icon.png` + `app/apple-icon.png`
      (180px), from the client-supplied mark. A 512px source would let us add a crisp
      Android/PWA icon later.
- [x] OG / social image → `public/images/brand/og-image.jpg` (1200×630), referenced in
      `app/layout.tsx` metadata (Open Graph + Twitter).
- Dark mode is left at the shadcn grayscale default — the design is light-only, so no
  dark toggle is shipped; tune the `.dark` block only if one is ever added.

## Deploy note

`app/layout.tsx` sets `metadataBase` / canonical URLs from `NEXT_PUBLIC_SITE_URL`
(fallback `https://aldebaranfarm.us`). Set that env var to the real production domain on
Vercel so OG image URLs, `robots.txt`, and `sitemap.xml` are absolute and correct.
