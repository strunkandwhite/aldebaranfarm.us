import { cn } from "@/lib/utils";

/**
 * PageTitle — the centered Playfair page heading used at the top of each inner
 * page (FAQs, The House, Gallery, …). Burgundy on cream, ~40pt in the mock.
 */
export function PageTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "pt-6 text-center font-heading text-[32px] leading-tight text-primary sm:text-[40px] md:pt-10",
        className
      )}
    >
      {children}
    </h1>
  );
}
