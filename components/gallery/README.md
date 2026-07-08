# components/gallery/

The photo gallery (the `/gallery` page).

- **`GalleryGrid.tsx`** — client component rendering the room-grouped thumbnail
  grid and a full-screen lightbox (Base UI Dialog) with prev/next + arrow-key
  navigation over the flattened photo list. Data-driven from
  `content/gallery.ts`; images resolve through `imageUrl()`.
