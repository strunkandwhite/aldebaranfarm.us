import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PageTitle } from "@/components/layout/PageTitle";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { QAItem } from "@/components/shared/QAItem";
import { faqGroups } from "@/content/faqs";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Frequently asked questions about staying at Aldebaran Farm: booking, location, the house, and house rules.",
};

/**
 * FAQs page — topic groups, each with a set of question/answer pairs from
 * `content/faqs.ts`. Content is capped to a readable measure and centered.
 */
export default function FaqsPage() {
  return (
    <Container>
      <PageTitle>FAQs</PageTitle>

      <div className="mx-auto max-w-3xl space-y-10 pb-16 pt-8 md:space-y-12 md:pt-12">
        {faqGroups.map((group) => (
          <section key={group.heading}>
            <SectionHeading>{group.heading}</SectionHeading>
            <div className="mt-4 space-y-5">
              {group.items.map((item) => (
                <QAItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
