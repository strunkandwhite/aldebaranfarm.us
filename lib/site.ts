/**
 * SITE CONFIG — the single non-UI home for site-wide constants, matching the
 * "each concern has one point of change" pattern of the other lib/ modules.
 */

/**
 * Site URL used for absolute metadata (OG image, sitemap, robots). Set
 * NEXT_PUBLIC_SITE_URL to the production domain at deploy; the fallback is
 * the production domain.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aldebaranfarm.us";

/**
 * Every indexable route, feeding sitemap.xml. Add an entry when adding a
 * page. (The header/footer nav in `components/layout/Nav.tsx` is a curated
 * subset — /gallery, for example, is reached from The House page — so the
 * two lists are intentionally separate.)
 */
export const routes = ["", "/house", "/gallery", "/things-to-do", "/faqs", "/reservations"];

/** The Book Now call-to-action target (email/phone reservations page). */
export const bookNowHref = "/reservations";
