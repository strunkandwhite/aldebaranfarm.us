import type { TextRun } from "@/components/shared/RichText";

/**
 * Things To Do content (the /things-to-do page).
 *
 * Prose is authored as arrays of "runs" (plain strings + inline links) so links
 * can sit inside sentences. See `RichText`.
 */

export const inTown = {
  heading: "In Town",
  body: [
    "Downtown Spring Green is worth a wander. Start at ",
    { text: "Arcadia Books", href: "https://www.readinutopia.com/" },
    ", an independent bookstore and cafe with a well-chosen selection of new releases, classics, and just about everything in between, plus coffee and a good spot to sit and read. From there, downtown has a handful of local shops, galleries, and restaurants within easy walking distance.",
  ] as TextRun[],
};

export interface Activity {
  name: string;
  body: TextRun[];
}

export const outdoors = {
  heading: "The Outdoors",
  intro:
    "The Driftless Area around Aldebaran is made for spending time outside. Here are a few of our favorite spots, all within a short drive:",
  activities: [
    {
      name: "Hiking",
      body: [
        { text: "Tower Hill State Park", href: "https://www.stateparks.com/tower_hill.html" },
        " is close by and has trails leading up to the old Shot Tower, with views over the Wisconsin River bluffs. ",
        { text: "Governor Dodge State Park", href: "https://dnr.wisconsin.gov/topic/parks/govdodge" },
        ", one of the state's largest, has nearly 40 miles of trails winding past two lakes and a waterfall at Stephens Falls. ",
        { text: "White Mound County Park", href: "https://www.co.sauk.wi.us/parksandrecreation/white-mound-county-park" },
        ", the largest park in Sauk County, has an easy lakeside trail that's good for families. ",
        { text: "Devil's Lake State Park", href: "https://dnr.wisconsin.gov/topic/parks/devilslake" },
        " is a bit further out but worth the drive, with quartzite bluffs rising above the water.",
      ],
    },
    {
      name: "Biking",
      body: [
        "A marked bike route runs from Hillside School to Dodgeville, connecting to the Military Ridge State Trail, which passes near Governor Dodge for those who want to make a longer day of it.",
      ],
    },
    {
      name: "Kayaking & Canoeing",
      body: [
        "The Wisconsin River is typically slow-moving and gentle, with no rapids along its length, so it suits paddlers of any experience level. A couple of local outfitters handle rentals and shuttle service, so you don't need to bring your own boat: ",
        { text: "Wisconsin Canoe Company", href: "https://thebestcanoecompanyever.com/" },
        " and ",
        { text: "Wisconsin Riverside Resort", href: "https://www.wiriverside.com/canoes-tubes-kayaks/" },
        ", both based in Spring Green.",
      ],
    },
    {
      name: "Tubing",
      body: [
        "The same outfitters rent tubes for a slower float down the river, if you'd rather drift than paddle.",
      ],
    },
    {
      name: "Fishing",
      body: [
        "The river holds a good number of gamefish and panfish, including smallmouth bass, walleye, and northern pike. If you'd rather go with a guide than fish on your own, ",
        { text: "Round River Adventures", href: "https://www.roundriveradventures.com/" },
        " and ",
        { text: "Black Earth Angling Co.", href: "https://www.blackearthangling.com/" },
        " both run guided trips on the Lower Wisconsin River nearby. Everyone fishing needs a Wisconsin fishing license, available online through the DNR's ",
        { text: "Go Wild", href: "https://dnr.wisconsin.gov/gowild" },
        " portal.",
      ],
    },
  ] as Activity[],
};

export const architecture = {
  heading: "Architecture & Theater",
  paragraphs: [
    [
      "Aldebaran sits just down the road from ",
      { text: "Taliesin", href: "http://taliesinpreservation.org/" },
      ", Frank Lloyd Wright's home and estate, and it's an easy walk or short drive from the farm. Tickets sell out during peak season, so we recommend booking ahead.",
    ],
    [
      "The ",
      { text: "American Players Theatre", href: "https://americanplayers.org/" },
      " is also nearby. Its outdoor amphitheater is set on 110 acres of woods and meadows and runs its season from June through November. Many guests picnic on the grounds before a show. You can order a picnic in advance through APT's Hubbard Avenue Diner (by 4pm the day before your show), or pick something up in town.",
    ],
  ] as TextRun[][],
};

export const mapCta: TextRun[] = [
  "For a full list of recommendations, here's a ",
  { text: "google map", href: "https://maps.app.goo.gl/wTCEa937xL92YzRt5" },
  " of our favorite spots.",
];
