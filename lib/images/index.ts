/**
 * IMAGE PATH HELPER.
 *
 * Every image src in the app should be resolved through `imageUrl()` instead of
 * being hard-coded. Today images live locally in `/public/images`, so this is a
 * near-passthrough. When we move assets to a CDN (Cloudinary, S3/CloudFront,
 * etc.), this ONE file changes — no component has to be touched.
 *
 * To point at a CDN, set `NEXT_PUBLIC_IMAGE_BASE_URL` (e.g.
 * "https://cdn.example.com") in the environment. Local dev leaves it unset and
 * paths resolve against `/public` as usual.
 */

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

/**
 * Resolve a property image path (relative to `/public`, e.g.
 * "/images/property/exterior.svg") to a full URL.
 *
 * - Absolute URLs (already on a CDN) are returned untouched.
 * - Relative paths are prefixed with `NEXT_PUBLIC_IMAGE_BASE_URL` when set.
 */
export function imageUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) {
    return src;
  }
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `${IMAGE_BASE_URL}${normalized}`;
}
