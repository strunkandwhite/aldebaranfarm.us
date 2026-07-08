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
  const raw = await fs.promises.readFile(CONTENT_FILE, "utf8");
  const { data, content } = matter(raw);

  const frontmatter = data as Partial<PropertyFrontmatter>;
  assertValidFrontmatter(frontmatter);

  return {
    ...frontmatter,
    // The Markdown body is the long-form description.
    description: content.trim(),
  };
}

/**
 * Minimal runtime validation. The content file is authored by hand, so we fail
 * loudly and early if a required field is missing or malformed rather than
 * letting `undefined` leak into the UI. A future API implementation would do
 * the equivalent check on the API response.
 */
function assertValidFrontmatter(
  fm: Partial<PropertyFrontmatter>,
): asserts fm is PropertyFrontmatter {
  const required: (keyof PropertyFrontmatter)[] = [
    "slug",
    "name",
    "tagline",
    "location",
    "bedrooms",
    "loftedBeds",
    "bathrooms",
    "maxGuests",
    "beds",
    "amenities",
    "history",
    "images",
    "contactEmail",
    "contactPhone",
  ];

  const missing = required.filter((key) => fm[key] === undefined);
  if (missing.length > 0) {
    throw new Error(
      `content/property.md is missing required field(s): ${missing.join(", ")}`,
    );
  }

  if (!Array.isArray(fm.images) || fm.images.length === 0) {
    throw new Error("content/property.md must define at least one image.");
  }

  for (const image of fm.images as PropertyImage[]) {
    if (!image.src || !image.alt) {
      throw new Error(
        "Every image in content/property.md needs both `src` and `alt`.",
      );
    }
  }
}
