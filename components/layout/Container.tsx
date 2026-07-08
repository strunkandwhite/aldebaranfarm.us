import { cn } from "@/lib/utils";

/**
 * Container — centers content and applies a consistent max width + horizontal
 * padding. Wrap page sections in this so gutters stay uniform site-wide.
 *
 * Placeholder: spacing/max-width will be tuned when brand tokens land.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
