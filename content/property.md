---
# ---------------------------------------------------------------------------
# THE single property's content.
#
# This file is the current SOURCE OF TRUTH for the property. It is read ONLY by
# `lib/data/getProperty()` — no component reads this file directly. To swap the
# source for an external API later, you only reimplement `lib/data`; the
# frontmatter fields below map 1:1 to the `Property` type in `types/property.ts`.
#
# Everything above the second `---` is YAML frontmatter (structured fields).
# Everything below it is the `description` body (rendered as plain text — keep
# it a single plain paragraph).
# ---------------------------------------------------------------------------

slug: aldebaran-farm
name: Aldebaran Farm
tagline: A Historic Retreat in Spring Green

location:
  streetAddress: 6557 County T
  city: Spring Green
  region: Wisconsin
  regionCode: WI
  country: USA

bedrooms: 4
loftedBeds: 1
bathrooms: 2
maxGuests: 11

beds:
  - Downstairs Bedroom 1 - king bed
  - Downstairs Bedroom 2 - queen bed
  - Upstairs Bedroom 1 - full bed + twin bed
  - Upstairs Bedroom 2 - queen bed + twin bed
  - Upstairs loft - twin bed
amenities:
  - 100% solar powered
  - Central A/C
  - Heat
  - Washer/dryer
  - Dishwasher
  - Microwave
  - Refrigerator
  - Burr coffee grinder and auto-drip coffeemaker
  - Full kitchen with stove and oven
  - WiFi
  - Wood-burning fireplace
  - Outdoor barbecue grills (please supply your own charcoal)
  - Outdoor firepit
  - Books and board games
amenitiesNote: Please note there is NO TV.

# House rules live in content/faqs.ts (rendered as Q&A on the FAQs page).

history:
  - >-
    This house, built in 1861, was the home of Frank Lloyd Wright's uncle James
    Lloyd-Jones. Wright spent boyhood summers here, working on his uncle's farm and
    falling in love with the valley where he would later build his own home. It's
    said that from the upper front window of the house, young Wright could see the
    sites of Taliesin, the masterpiece he built for himself; and Unity Chapel, whose
    ceiling represents his first work as an architect; and Hillside School, which he
    designed for his aunts and later made the headquarters of his architectural
    fellowship. Taliesin and the school, obscured by trees, are no longer visible
    from the Main House at Aldebaran but can be seen from other parts of the property.
    Still clearly visible from the Main House is Midway Barn, which lies halfway
    between the school and Taliesin.
  - >-
    In 1943, the James Lloyd-Jones property was purchased by the architect William
    Wesley Peters, Wright's associate and son-in-law, who renovated the Main House
    and the Great Barn. Peters, who considered himself an acolyte of the great man,
    named the farm Aldebaran, which is Arabic for "the follower" and the name of a
    bright red star in the eye of the constellation Taurus.
  - >-
    The property, which comprises several buildings and about 18 acres, was later
    owned by Robert and Derry Graves, who sold it to the present owners in 2003.
    Robert and Derry had a hand in many Spring Green community enterprises, including
    the Gard Theatre, the American Players Theatre, and the Wyoming Valley School.
    Until his death in 2011, Robert, who was a landscape architect for Wright in the
    late 1950s, tended to the valley lovingly and worked to protect its beauty.

# Paths are relative to /public. Always render these through `imageUrl()`.
images:
  - src: /images/property/aldebaran_main_house.jpg
    alt: The tree-lined drive at Aldebaran Farm with the main house beyond
    caption: The approach to the main house

contactEmail: aldebaran.farm.rental@gmail.com
contactPhone: (312) 401-2484
airbnbUrl: https://www.airbnb.com/rooms/30441325
vrboUrl: https://www.vrbo.com/1893752
---

Tucked into the rolling hills of Wisconsin's Driftless region, Aldebaran Farm is
a historic countryside retreat in Spring Green, just across the road from Frank
Lloyd Wright's Taliesin. The spacious main house welcomes families and friends
year-round to relax, reconnect, and gather together. Just minutes from American
Players Theatre, the Wisconsin River, and downtown Spring Green, it's the perfect
home base for a peaceful getaway.
