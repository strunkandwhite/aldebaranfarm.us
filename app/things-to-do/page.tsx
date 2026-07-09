import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PageTitle } from "@/components/layout/PageTitle";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { FramedImage } from "@/components/shared/FramedImage";
import { RichText } from "@/components/shared/RichText";
import { inTown, outdoors, architecture, mapCta } from "@/content/things-to-do";

export const metadata: Metadata = {
  title: "Things To Do — Aldebaran Farm",
  description:
    "Favorite things to do near Aldebaran Farm in Spring Green, Wisconsin: downtown shops, Driftless hiking and paddling, Frank Lloyd Wright's Taliesin, and American Players Theatre.",
};

/**
 * Things To Do page: In Town, The Outdoors (with activity subsections), and
 * Architecture & Theater, then a link to the owners' recommendations map.
 * Content (with inline links) comes from `content/things-to-do.ts`.
 */
export default function ThingsToDoPage() {
  return (
    <Container>
      <div className="pt-6 md:pt-10">
        <PageTitle>Things To Do</PageTitle>
      </div>

      {/* In Town — text only, full container width */}
      <section className="py-8 md:py-10">
        <SectionHeading>{inTown.heading}</SectionHeading>
        <p className="mt-4 leading-relaxed">
          <RichText runs={inTown.body} />
        </p>
      </section>

      {/* The Outdoors — text left, portrait photo right */}
      <section className="grid items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-12 lg:gap-16">
        <div>
          <SectionHeading>{outdoors.heading}</SectionHeading>
          <p className="mt-4 leading-relaxed">{outdoors.intro}</p>
          <div className="mt-6 space-y-5">
            {outdoors.activities.map((activity) => (
              <div key={activity.name}>
                <p className="font-semibold">{activity.name}</p>
                <p className="mt-1 leading-relaxed">
                  <RichText runs={activity.body} />
                </p>
              </div>
            ))}
          </div>
        </div>

        <FramedImage
          src="/images/things-to-do/aldebaran_outdoors.jpg"
          alt="Kayaking on the Wisconsin River near Aldebaran Farm"
          orientation="portrait"
          className="order-first mx-auto w-full max-w-xs sm:max-w-sm md:order-none md:mx-0 md:max-w-none"
          sizes="(min-width: 768px) 45vw, 85vw"
        />
      </section>

      {/* Architecture & Theater — landscape photo left, text right */}
      <section className="grid items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-12 lg:gap-16">
        <FramedImage
          src="/images/things-to-do/aldebaran_architecture.jpg"
          alt="A window wall framing the valley view at Taliesin"
          orientation="landscape"
          className="mx-auto w-full max-w-lg md:mx-0 md:max-w-none"
          sizes="(min-width: 768px) 45vw, 85vw"
        />

        <div>
          <SectionHeading>{architecture.heading}</SectionHeading>
          <div className="mt-4 space-y-4 leading-relaxed">
            {architecture.paragraphs.map((paragraph, i) => (
              <p key={i}>
                <RichText runs={paragraph} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations map — link + embedded Google My Maps */}
      <section className="pb-16 pt-4">
        <p className="text-center leading-relaxed">
          <RichText runs={mapCta} />
        </p>
        {/*
          The My Maps embed has a ~67px header bar showing the map's title and
          author (name + avatar) that Google gives no option to hide. We crop it
          off: a fixed-height overflow-hidden box with the iframe made taller and
          shifted up by the header height, so the header is clipped while the map
          fills the frame. Google's "©Google / Terms" attribution stays visible
          at the bottom.
        */}
        <div className="relative mt-6 h-[480px] overflow-hidden rounded-lg border border-border">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1Pir8XA5ZBdTADb010WpOWV1a0W2qGUQ&ehbc=2E312F"
            title="Map of our favorite spots around Aldebaran Farm"
            loading="lazy"
            className="absolute inset-x-0 -top-[68px] h-[548px] w-full border-0"
          />
        </div>
      </section>
    </Container>
  );
}
