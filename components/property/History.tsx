import { FramedImage } from "@/components/shared/FramedImage";
import { SectionHeading } from "@/components/layout/SectionHeading";
import type { Property } from "@/types/property";

/**
 * History — The House page's second section: the long-form property history on
 * the left with the historical photo on the right. Same spacing rhythm as the
 * details section.
 *
 * Responsive: two columns on md+, stacked (text then photo) on small screens.
 */
export function History({ property }: { property: Property }) {
  return (
    <section className="grid items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-12 lg:gap-16">
      <div>
        <SectionHeading>History</SectionHeading>
        <div className="mt-4 space-y-4 leading-relaxed">
          {property.history.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <FramedImage
        src="/images/property/aldebaran_history.jpg"
        alt="A historical photograph of the house at Aldebaran Farm with family and a horse"
        orientation="landscape"
        className="order-first mx-auto w-full max-w-lg md:order-none md:mx-0 md:max-w-none"
        sizes="(min-width: 768px) 45vw, 85vw"
      />
    </section>
  );
}
