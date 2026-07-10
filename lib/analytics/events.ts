/**
 * Canonical analytics event names — the values used in `data-track`
 * attributes (handled by `TrackedClicks`) and direct `trackEvent()` calls.
 * Reference these instead of typing string literals so a rename is a
 * one-place edit. Kept in its own vendor-free module so Server Components
 * can import it without pulling `@vercel/analytics` into the server graph.
 */
export const EVENTS = {
  bookNowClick: "book_now_click",
  inquiryEmailClick: "inquiry_email_click",
  inquiryPhoneClick: "inquiry_phone_click",
  galleryPhotoOpen: "gallery_photo_open",
  outboundClick: "outbound_click",
} as const;
