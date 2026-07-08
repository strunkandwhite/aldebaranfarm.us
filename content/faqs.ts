/**
 * FAQ content (the /faqs page), grouped by topic. Edit here — the page renders
 * these groups and their Q&A pairs directly.
 */

import { cancellationPolicy } from "./rates";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  heading: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    heading: "Booking & Stay",
    items: [
      {
        q: "What are check-in and check-out times?",
        a: "Check-in is at 4:00 PM, check-out is at 10:00 AM. If you need an earlier arrival or later departure, just ask — we'll do our best to accommodate depending on the schedule.",
      },
      {
        q: "Is there a minimum stay?",
        a: "Yes, we require a minimum stay of 2 nights.",
      },
      {
        q: "What's your cancellation policy?",
        a: cancellationPolicy,
      },
    ],
  },
  {
    heading: "Location",
    items: [
      {
        q: "Where is Aldebaran located?",
        a: '6557 County T, Spring Green, WI. (Note: this is sometimes mistakenly listed as "County TZ" — the correct road is County T.)',
      },
      {
        q: "How far is the drive from Madison or Chicago?",
        a: "Aldebaran is about 1 hour from Madison and 3 hours from Chicago.",
      },
    ],
  },
  {
    heading: "The House",
    items: [
      {
        q: "What's in the kitchen?",
        a: "The kitchen is fully equipped: dishwasher, microwave, an auto-drip coffeemaker and filters, pots and pans, dishes, glasses, silverware, and kitchen utensils, plus basic staples like salt, pepper, and sugar. You'll also find an unpredictable assortment of spices, condiments, and teas left behind by past guests.",
      },
      {
        q: "Where's the nearest grocery store?",
        a: "Molter's Market in Spring Green, open until 8pm weekdays, 6pm Saturday, 5pm Sunday.",
      },
      {
        q: "Is there a TV?",
        a: "No, there's no TV at the house. We have plenty of books and board games.",
      },
      {
        q: "Is there phone service and wifi?",
        a: "Yes, there is WiFi. Cell reception is poor in the valley, so we maintain a landline for safety and convenience — we just ask that outgoing calls stay brief.",
      },
      {
        q: "Is the house good for kids?",
        a: "Aldebaran is a great place for kids. A few things worth knowing: the driveway isn't traffic-free and curves around a blind spot near the house, so children should treat it like a street. There's also a drop-off by the concrete slab near the back door, and the stairs inside are steep. We ask that kids stay in the main house and front yard, since the outbuildings out back aren't safe without supervision.",
      },
      {
        q: "Is the water safe to drink?",
        a: "Yes. Our water comes from our own private well and is tested regularly. There is also a Brita filter in the fridge.",
      },
      {
        q: "Will we see any wildlife?",
        a: "Aldebaran is a country house, and we share the valley with plenty of local creatures. Mice may come and go, and you might spot the odd insect around the windows. Occasionally a bat finds its way inside — it's uncommon, and instructions for handling it are in the house binder.",
      },
      {
        q: "What's provided, and what should we bring?",
        a: "We supply all towels and linens, plus a fully stocked kitchen with cookware, dishes, and basic staples. There should also be shampoo, conditioner, and soap in the bathrooms. Firewood is in the low stone building behind the house, and the grills are in the shed just north of the house. We do not supply charcoal for the grill, so bring your own.",
      },
    ],
  },
  {
    heading: "House Rules",
    items: [
      { q: "Do you allow pets?", a: "No, we don't allow pets on the property." },
      {
        q: "Is smoking allowed?",
        a: "Smoking is not allowed inside the house.",
      },
      {
        q: "Can we bring a tent or RV?",
        a: "No, we don't allow tents or RVs on the property.",
      },
      { q: "Are fireworks or shooting allowed?", a: "No." },
      {
        q: "How many people can gather at the house?",
        a: "We're happy for you to share Aldebaran with friends and family, but please limit any gathering to 20 people total, including everyone staying at the house. We also ask that noise and lights stay to a minimum after 10pm.",
      },
    ],
  },
];
