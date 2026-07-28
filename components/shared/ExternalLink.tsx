import { EVENTS } from "@/lib/analytics/events";

/**
 * ExternalLink — a reusable anchor for outbound links (Airbnb, VRBO, maps, …)
 * with safe `rel`/`target` defaults. Cross-cutting, so it lives in `shared`.
 *
 * Spreads any extra props onto the `<a>` so it can be used polymorphically as
 * a Button's `render` target (Base UI injects className/data-slot/children).
 * `target`/`rel` come AFTER the spread on purpose: call sites can override
 * the default `data-track`, but not the tab-isolation attributes.
 */
export function ExternalLink({
  href,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { href: string }) {
  return (
    <a
      href={href}
      data-track={EVENTS.outboundClick}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
