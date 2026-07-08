# public/

Static assets served at the site root by Next.js (a file at
`public/images/property/exterior.png` is served at `/images/property/exterior.png`).

- **`images/property/`** — the property's photos (placeholders for now).
- **`images/brand/`** — logo, og-image, and other brand assets (to be added).

Reference images through `imageUrl()` from `lib/images`, never by hard-coded path.
The `*.svg` files at the root are Next.js scaffold leftovers and can be deleted.
