import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type { Property, PropertyImage } from "@/types/property";

/**
 * DATA ACCESS LAYER — the ONLY module that knows the property content lives in
 * a local Markdown file.
 *
 * Every component and page gets the property through `getProperty()`. Because
 * this is the single choke point, swapping the source for the Airbnb/VRBO API
 * later means reimplementing THIS FILE only — the `Property` contract and all
 * UI stay unchanged. See `docs/architecture.md`.
 *
 * `getProperty()` is intentionally `async` even though reading a local file is
 * synchronous: the future API-backed implementation will be async, and having
 * callers already `await` it means that swap is invisible to the UI.
 */

const CONTENT_FILE = path.join(process.cwd(), "content", "property.md");

/** Fields we expect in the frontmatter, before validation/normalization. */
type PropertyFrontmatter = Omit<Property, "description">;

export async function getProperty(): Promise<Property> {
  return parseProperty(await fs.promises.readFile(CONTENT_FILE, "utf8"));
}

/**
 * Parse the raw content-file text into a validated Property. Pure — exported
 * separately from `getProperty()` so unit tests can feed it fixture strings.
 */
export function parseProperty(raw: string): Property {
  const { data, content } = matter(raw);

  const frontmatter = data as Partial<PropertyFrontmatter>;
  assertValidFrontmatter(frontmatter);

  return {
    ...frontmatter,
    // The Markdown body is the long-form description (rendered as plain text).
    description: content.trim(),
  };
}

/**
 * Runtime validation. The content file is authored by hand, so we fail loudly
 * and early — checking types and nested shapes, not just presence — rather
 * than letting `undefined` or a mistyped YAML scalar leak into the UI. Runs
 * at build time (static generation), so a bad edit fails the deploy while the
 * previous deploy stays live. A future API implementation would do the
 * equivalent check on the API response.
 */
function assertValidFrontmatter(
  fm: Partial<PropertyFrontmatter>
): asserts fm is PropertyFrontmatter {
  const fail = (message: string): never => {
    throw new Error(`content/property.md: ${message}`);
  };

  const stringFields = [
    "slug",
    "name",
    "tagline",
    "contactEmail",
    "contactPhone",
    "airbnbUrl",
    "vrboUrl",
  ] as const;
  for (const key of stringFields) {
    const value = fm[key];
    if (typeof value !== "string" || value.trim() === "") {
      fail(`\`${key}\` must be a non-empty string.`);
    }
  }

  const numberFields = ["bedrooms", "loftedBeds", "bathrooms", "maxGuests"] as const;
  for (const key of numberFields) {
    if (typeof fm[key] !== "number" || !Number.isFinite(fm[key])) {
      fail(`\`${key}\` must be a number.`);
    }
  }

  const stringListFields = ["beds", "amenities", "history"] as const;
  for (const key of stringListFields) {
    const value = fm[key];
    if (
      !Array.isArray(value) ||
      value.length === 0 ||
      value.some((item) => typeof item !== "string")
    ) {
      fail(`\`${key}\` must be a non-empty list of strings.`);
    }
  }

  if (fm.amenitiesNote !== undefined && typeof fm.amenitiesNote !== "string") {
    fail("`amenitiesNote` must be a string when present.");
  }

  const location = fm.location;
  if (typeof location !== "object" || location === null) {
    fail("`location` must be an object.");
  }
  const locationStringFields = [
    "streetAddress",
    "city",
    "region",
    "regionCode",
    "postalCode",
  ] as const;
  for (const key of locationStringFields) {
    const value = (location as unknown as Record<string, unknown>)[key];
    if (typeof value !== "string" || value.trim() === "") {
      fail(`\`location.${key}\` must be a non-empty string.`);
    }
  }

  const locationNumberFields = ["latitude", "longitude"] as const;
  for (const key of locationNumberFields) {
    const value = (location as unknown as Record<string, unknown>)[key];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      fail(`\`location.${key}\` must be a number.`);
    }
  }

  if (!Array.isArray(fm.images) || fm.images.length === 0) {
    fail("must define at least one image.");
  }
  for (const image of fm.images as Partial<PropertyImage>[]) {
    if (typeof image.src !== "string" || image.src === "") {
      fail("every image needs a string `src`.");
    }
    if (typeof image.alt !== "string" || image.alt === "") {
      fail(`image \`${image.src}\` needs non-empty \`alt\` text.`);
    }
  }
}
