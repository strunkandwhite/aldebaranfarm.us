import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PageTitle } from "@/components/layout/PageTitle";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { galleryCategories } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery — Aldebaran Farm",
  description:
    "Photos of Aldebaran Farm in Spring Green, Wisconsin — the kitchen, living and dining rooms, bedrooms, baths, and the grounds.",
};

/**
 * Gallery page — room-grouped photo grids with a lightbox. Categories/images
 * come from `content/gallery.ts`; the interactive grid + lightbox is a client
 * component (`GalleryGrid`).
 */
export default function GalleryPage() {
  return (
    <Container>
      <div className="pt-6 md:pt-10">
        <PageTitle>Gallery</PageTitle>
      </div>

      <div className="pb-16 pt-8 md:pt-12">
        <GalleryGrid categories={galleryCategories} />
      </div>
    </Container>
  );
}
