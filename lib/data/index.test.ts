import { describe, expect, it } from "vitest";

import { parseProperty } from "./index";

const validFrontmatter = `---
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
amenities:
  - WiFi
history:
  - Built in 1861.
images:
  - src: /images/property/aldebaran_main_house.jpg
    alt: The main house
contactEmail: owner@example.com
contactPhone: (312) 401-2484
airbnbUrl: https://www.airbnb.com/rooms/30441325
vrboUrl: https://www.vrbo.com/1893752
---

The description body.
`;

describe("parseProperty", () => {
  it("parses valid frontmatter into a typed Property", () => {
    const property = parseProperty(validFrontmatter);
    expect(property.name).toBe("Aldebaran Farm");
    expect(property.location.streetAddress).toBe("6557 County T");
    expect(property.location.regionCode).toBe("WI");
    expect(property.description).toBe("The description body.");
  });

  it("rejects a missing required field, naming it", () => {
    expect(() => parseProperty(validFrontmatter.replace(/^tagline:.*\n/m, ""))).toThrow(/tagline/);
  });

  it("rejects a wrong-typed numeric field instead of rendering garbage", () => {
    expect(() =>
      parseProperty(validFrontmatter.replace("maxGuests: 11", "maxGuests: eleven"))
    ).toThrow(/maxGuests/);
  });

  it("rejects a beds list that is not a list of strings", () => {
    expect(() =>
      parseProperty(
        validFrontmatter.replace(/beds:\n  - Downstairs Bedroom 1 - king bed/, "beds: one string")
      )
    ).toThrow(/beds/);
  });

  it("rejects a location missing a nested field", () => {
    expect(() => parseProperty(validFrontmatter.replace(/^  city:.*\n/m, ""))).toThrow(/city/);
  });

  it("rejects an image without alt text", () => {
    expect(() => parseProperty(validFrontmatter.replace(/^    alt:.*\n/m, ""))).toThrow(/alt/);
  });
});
