/**
 * Primary navigation model. The header lays every item out as a direct sibling
 * in a single evenly-spaced row (links + wordmark + Book Now CTA), so the links
 * are split into the group before the wordmark and the group after it here.
 * Single-property site, so these are section/page links, not listings.
 */
export const leftNavLinks = [
  { href: "/house", label: "The House" },
  { href: "/things-to-do", label: "Things To Do" },
] as const;

export const rightNavLinks = [{ href: "/faqs", label: "FAQs" }] as const;

/** Shared styling for a nav link (Playfair, burgundy, underline on hover). */
export const navLinkClass = "font-heading text-lg text-primary underline-offset-4 hover:underline";
