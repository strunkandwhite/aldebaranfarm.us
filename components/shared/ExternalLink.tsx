/**
 * ExternalLink — a reusable anchor for outbound links (Airbnb, VRBO, maps, …)
 * with safe `rel`/`target` defaults. Cross-cutting, so it lives in `shared`.
 *
 * Spreads any extra props onto the `<a>` so it can be used polymorphically as a
 * Button's `render` target (Base UI injects className/data-slot/children).
 */
export function ExternalLink({
  href,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
