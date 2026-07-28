# Gallery lightbox: use more viewport real estate

**Date:** 2026-07-20 · **Status:** approved

## Problem

The expanded gallery photo is capped at `max-w-5xl` (1024px) and `h-[80vh]`,
leaving most of a desktop viewport unused. Sources are now 3000px wide, so the
lightbox can fill the screen without going soft.

## Design (approved: "near-full with gutter")

All changes in `components/gallery/GalleryGrid.tsx`:

1. **Popup padding** becomes the gutter: `p-4 sm:p-8` → `p-4 sm:p-6`.
2. **Photo container** fills the padded popup: `h-[80vh] w-full max-w-5xl` →
   `h-full w-full`. `object-contain` keeps the photo letterboxed inside it, so
   3:2 landscape photos on widescreen monitors leave natural side gutters and
   the chevrons/close/counter stay off the subject.
3. **`sizes`** on the visible image **and** the invisible preload copies:
   `(min-width: 1024px) 1024px, 100vw` → `100vw`. The preload copies must keep
   props identical to the visible image so they warm the exact optimized URL
   that prev/next will request.

Quality stays at the default 75 (the lightbox tier in `next.config.ts`).

## Perf

Lightbox requests grow from ~1024px to up to the 3000px source (~0.5–1MB AVIF
on large/retina screens). User-triggered only — page load and LCP are
untouched; each optimized size is CDN-cached after first request. Grid
thumbnails unchanged.

## Verification

Dev server: open the lightbox at ~375px, 768px, and desktop widths; arrow
through photos; confirm via the network panel that the visible image and the
neighbor preloads request the same `/_next/image` URLs at the larger width.
