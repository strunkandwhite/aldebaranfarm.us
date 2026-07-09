import { cn } from "@/lib/utils";

/**
 * SectionHeading — the burgundy Playfair subheader used for sections within a
 * page ("Details & Amenities", "History", "The Outdoors", …). ~28pt in the mock.
 */
export function SectionHeading({
  children,
  className,
  as: Comp = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Comp
      className={cn("font-heading text-[24px] leading-snug text-primary sm:text-[28px]", className)}
    >
      {children}
    </Comp>
  );
}
