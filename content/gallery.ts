/**
 * Gallery content, grouped by room/area (the /gallery page).
 *
 * Generated from the property photo set. To recategorize, move an entry to a
 * different category's `images` array (and move the file under
 * public/images/gallery/<slug>/), or reorder within a category. Alt text is
 * generic per category — refine for specific standout shots as desired.
 */

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryCategory {
  title: string;
  slug: string;
  images: GalleryImage[];
}

export const galleryCategories: GalleryCategory[] = [
  {
    title: "Exterior & Grounds",
    slug: "exterior",
    images: [
      { src: "/images/gallery/exterior/tz-37.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-38.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-39.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-36.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-41.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-42.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-43.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-47.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-40.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-44.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-45.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
      { src: "/images/gallery/exterior/tz-46.jpg", alt: "Exterior & Grounds at Aldebaran Farm" },
    ],
  },
  {
    title: "Kitchen",
    slug: "kitchen",
    images: [
      { src: "/images/gallery/kitchen/tz-1.jpg", alt: "Kitchen at Aldebaran Farm" },
      { src: "/images/gallery/kitchen/tz-2.jpg", alt: "Kitchen at Aldebaran Farm" },
      { src: "/images/gallery/kitchen/tz-3.jpg", alt: "Kitchen at Aldebaran Farm" },
      { src: "/images/gallery/kitchen/tz-4.jpg", alt: "Kitchen at Aldebaran Farm" },
    ],
  },
  {
    title: "Living & Dining Room",
    slug: "living-dining",
    images: [
      {
        src: "/images/gallery/living-dining/tz-9.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-10.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-13.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-14.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-11.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-12.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-18.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-15.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-16.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-17.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
      {
        src: "/images/gallery/living-dining/tz-34.jpg",
        alt: "Living & Dining Room at Aldebaran Farm",
      },
    ],
  },
  {
    title: "Downstairs Bedrooms",
    slug: "downstairs-bedrooms",
    images: [
      {
        src: "/images/gallery/downstairs-bedrooms/tz-19.jpg",
        alt: "Downstairs Bedrooms at Aldebaran Farm",
      },
      {
        src: "/images/gallery/downstairs-bedrooms/tz-20.jpg",
        alt: "Downstairs Bedrooms at Aldebaran Farm",
      },
      {
        src: "/images/gallery/downstairs-bedrooms/tz-21.jpg",
        alt: "Downstairs Bedrooms at Aldebaran Farm",
      },
      {
        src: "/images/gallery/downstairs-bedrooms/tz-22.jpg",
        alt: "Downstairs Bedrooms at Aldebaran Farm",
      },
    ],
  },
  {
    title: "Upstairs Bedrooms",
    slug: "upstairs-bedrooms",
    images: [
      {
        src: "/images/gallery/upstairs-bedrooms/tz-27.jpg",
        alt: "Upstairs Bedrooms at Aldebaran Farm",
      },
      {
        src: "/images/gallery/upstairs-bedrooms/tz-28.jpg",
        alt: "Upstairs Bedrooms at Aldebaran Farm",
      },
      {
        src: "/images/gallery/upstairs-bedrooms/tz-29.jpg",
        alt: "Upstairs Bedrooms at Aldebaran Farm",
      },
      {
        src: "/images/gallery/upstairs-bedrooms/tz-30.jpg",
        alt: "Upstairs Bedrooms at Aldebaran Farm",
      },
      {
        src: "/images/gallery/upstairs-bedrooms/tz-31.jpg",
        alt: "Upstairs Bedrooms at Aldebaran Farm",
      },
    ],
  },
  {
    title: "Bathrooms & Laundry",
    slug: "bathrooms",
    images: [
      { src: "/images/gallery/bathrooms/tz-5.jpg", alt: "Bathrooms & Laundry at Aldebaran Farm" },
      { src: "/images/gallery/bathrooms/tz-6.jpg", alt: "Bathrooms & Laundry at Aldebaran Farm" },
      { src: "/images/gallery/bathrooms/tz-7.jpg", alt: "Bathrooms & Laundry at Aldebaran Farm" },
      { src: "/images/gallery/bathrooms/tz-33.jpg", alt: "Bathrooms & Laundry at Aldebaran Farm" },
      { src: "/images/gallery/bathrooms/tz-32.jpg", alt: "Bathrooms & Laundry at Aldebaran Farm" },
      { src: "/images/gallery/bathrooms/tz-8.jpg", alt: "Bathrooms & Laundry at Aldebaran Farm" },
    ],
  },
  {
    title: "Upstairs Loft",
    slug: "upstairs-loft",
    images: [
      { src: "/images/gallery/upstairs-loft/tz-23.jpg", alt: "Upstairs Loft at Aldebaran Farm" },
      { src: "/images/gallery/upstairs-loft/tz-24.jpg", alt: "Upstairs Loft at Aldebaran Farm" },
      { src: "/images/gallery/upstairs-loft/tz-25.jpg", alt: "Upstairs Loft at Aldebaran Farm" },
      { src: "/images/gallery/upstairs-loft/tz-26.jpg", alt: "Upstairs Loft at Aldebaran Farm" },
    ],
  },
  {
    title: "Screened Porch",
    slug: "screened-porch",
    images: [
      { src: "/images/gallery/screened-porch/tz-35.jpg", alt: "Screened Porch at Aldebaran Farm" },
    ],
  },
];
