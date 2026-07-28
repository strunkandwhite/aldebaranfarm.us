# public/images/brand/

Brand assets. The logo source of truth is a 1500×1500 PSD (black line art on
white) kept outside the repo at
`~/Library/Mobile Documents/com~apple~CloudDocs/docs/misc/aldebaran logo.psd`.
The site colorway is derived from it: crop inside the outer frame, then map
black → white and white → brand burgundy `#770A15`.

- `logo.png` — 180×180 site mark (header, footer; also `app/icon.png` /
  `app/apple-icon.png`).
- `logo-720.png` — 720×720 version for external profiles (e.g. Google
  Business Profile, which wants ≥720px and ≥10KB). Not referenced by the
  site itself.
- `og-image.jpg` — 1200×630 social share image referenced from
  `app/layout.tsx` metadata.
