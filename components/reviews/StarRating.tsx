import { cn } from "@/lib/utils";

/**
 * StarRating — five stars in the brand burgundy, with support for a fractional
 * value (e.g. a 4.9 aggregate) via a clipped overlay of filled stars over faint
 * ones. Presentational: the numeric value is announced through `aria-label`.
 */
export function StarRating({ rating, className }: { rating: number; className?: string }) {
  const clamped = Math.max(0, Math.min(5, rating));
  const pct = (clamped / 5) * 100;

  return (
    <span
      role="img"
      aria-label={`${clamped} out of 5 stars`}
      className={cn(
        "relative inline-block leading-none tracking-[0.15em] whitespace-nowrap select-none",
        className
      )}
    >
      <span aria-hidden className="text-primary/20">
        ★★★★★
      </span>
      <span
        aria-hidden
        className="absolute inset-0 overflow-hidden text-primary"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}
