"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { EVENTS, trackEvent } from "@/lib/analytics";
import { imageUrl } from "@/lib/images";
import { SectionHeading } from "@/components/layout/SectionHeading";
import type { GalleryCategory } from "@/content/gallery";

/**
 * GalleryGrid — renders the room-grouped photo grid and a full-screen lightbox.
 *
 * Thumbnails are uniform 4:3 tiles (object-cover). Clicking one opens a lightbox
 * (Base UI Dialog: focus trap, scroll lock, Escape-to-close) over the FLATTENED
 * list of all photos, so prev/next and the arrow keys browse the whole gallery.
 */
export function GalleryGrid({ categories }: { categories: GalleryCategory[] }) {
  const flat = categories.flatMap((c) => c.images);
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  // Global index offset where each category begins in the flattened list.
  const offsets: number[] = [];
  let running = 0;
  for (const c of categories) {
    offsets.push(running);
    running += c.images.length;
  }

  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + flat.length) % flat.length)),
    [flat.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % flat.length)),
    [flat.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    // Listen in the capture phase: Base UI's Dialog stops keydown propagation
    // before it reaches the bubble phase, so a bubble-phase listener never fires.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, prev, next]);

  const current = index !== null ? flat[index] : null;

  // Photo indexes to warm while the lightbox is open, so prev/next swaps are
  // instant instead of showing the previous photo while the new one loads.
  const preloadIndexes =
    index === null || flat.length <= 1
      ? []
      : [...new Set([(index + 1) % flat.length, (index - 1 + flat.length) % flat.length])].filter(
          (i) => i !== index
        );

  return (
    <div className="space-y-12">
      {categories.map((cat, ci) => (
        <section key={cat.slug}>
          <SectionHeading>{cat.title}</SectionHeading>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {cat.images.map((img, ii) => (
              <button
                key={img.src}
                type="button"
                onClick={() => {
                  setIndex(offsets[ci] + ii);
                  trackEvent(EVENTS.galleryPhotoOpen, { category: cat.title });
                }}
                aria-label={`View ${img.alt}`}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Image
                  src={imageUrl(img.src)}
                  alt={img.alt}
                  fill
                  quality={60}
                  // The first row is above the fold and contains the page's
                  // LCP element — load it eagerly at high priority.
                  priority={offsets[ci] + ii < 4}
                  fetchPriority={offsets[ci] + ii < 4 ? "high" : undefined}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </section>
      ))}

      <Dialog.Root
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) setIndex(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/90 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Popup
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-12 focus:outline-none sm:p-6 sm:pb-12"
            onClick={() => setIndex(null)}
          >
            <Dialog.Title className="sr-only">Photo gallery</Dialog.Title>

            {current && (
              <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={imageUrl(current.src)}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />

                {preloadIndexes.map((i) => (
                  // Invisible (but laid-out) copies of the neighboring photos,
                  // with identical props to the visible Image so the browser
                  // requests the exact same optimized URL and warms the cache.
                  <Image
                    key={flat[i].src}
                    src={imageUrl(flat[i].src)}
                    alt=""
                    aria-hidden
                    fill
                    loading="eager"
                    sizes="100vw"
                    className="invisible object-contain"
                  />
                ))}
              </div>
            )}

            <Dialog.Close
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            >
              <X className="size-6" />
            </Dialog.Close>

            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 sm:left-4"
            >
              <ChevronLeft className="size-7" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 sm:right-4"
            >
              <ChevronRight className="size-7" />
            </button>

            {index !== null && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
                {index + 1} / {flat.length}
              </p>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
