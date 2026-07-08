# public/images/property/

The property's photos, served locally for now.

- `living-room.png`, `bedroom.png`, `exterior.png` — **placeholder** images
  (generated two-tone fills, not real photography). Replace with real photos.

Referenced from `content/property.md` (`images[].src`, paths relative to
`/public`). Always render through `imageUrl()` from `lib/images` so a future CDN
move is a one-file change.
