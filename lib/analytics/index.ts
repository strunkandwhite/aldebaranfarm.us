/**
 * ANALYTICS VENDOR ISOLATION LAYER.
 *
 * This is the ONLY file that imports `track` from `@vercel/analytics`. Every
 * custom event in the app goes through `trackEvent()` below instead of calling
 * the vendor SDK directly, so swapping Vercel Analytics for another provider
 * (Plausible, PostHog, …) means reimplementing this one file — no component
 * changes required.
 */

import { track } from "@vercel/analytics";

/**
 * Canonical event names. Reference these instead of typing string literals so
 * a rename is a one-place edit.
 */
export const EVENTS = {
  bookNowClick: "book_now_click",
  inquiryEmailClick: "inquiry_email_click",
  inquiryPhoneClick: "inquiry_phone_click",
  galleryPhotoOpen: "gallery_photo_open",
  outboundClick: "outbound_click",
} as const;

/**
 * Fire a custom analytics event. Wrapped in try/catch because analytics must
 * never break the UI — a blocked script, an ad blocker, or a vendor outage
 * should never surface as a user-facing error.
 *
 * Note: custom events require a Vercel Pro plan. On Hobby they're silently
 * dropped; page views and bounce rate still work.
 */
export function trackEvent(name: string, props?: Record<string, string | number | boolean>): void {
  try {
    track(name, props);
  } catch {
    // Analytics must never break the UI.
  }
}
