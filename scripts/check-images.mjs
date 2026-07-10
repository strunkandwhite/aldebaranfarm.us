#!/usr/bin/env node
/**
 * Image-reference check. No static tool (tsc/eslint/knip) verifies that the
 * `/images/...` paths in content and components exist under `public/` — a
 * typo or a file move silently breaks the live gallery. This script:
 *   1. FAILS (exit 1) if any referenced /images/... path has no file.
 *   2. WARNS about orphaned files under public/images that nothing references
 *      (report only — deleting photos is the owner's call).
 * Runs in pre-commit after knip.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
// NOT lib/ or types/: they contain no real image references, only doc-comment
// EXAMPLE paths (e.g. lib/images cites "/images/property/exterior.svg"),
// which would be false "missing file" failures.
const SCAN_DIRS = ["app", "components", "content"];
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".md", ".css"]);
// An /images/... path preceded by a quote, backtick, open paren, or
// whitespace. Whitespace matters: property.md's YAML frontmatter references
// images UNQUOTED (`src: /images/property/…`) — a quotes-only pattern misses
// them, so their files would be false-positive "orphans" and a typo in them
// would go uncaught.
const IMAGE_REF = /["'`(\s](\/images\/[^"'`)?\s]+)/g;
// Only image files count for the orphan report (READMEs etc. are fine).
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".gif"]);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const references = new Set();
for (const dir of SCAN_DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    if (!SCAN_EXTENSIONS.has(path.extname(file))) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(IMAGE_REF)) {
      references.add(match[1]);
    }
  }
}

const missing = [...references].filter((ref) => !fs.existsSync(path.join(PUBLIC_DIR, ref)));

const imagesDir = path.join(PUBLIC_DIR, "images");
const allFiles = fs.existsSync(imagesDir)
  ? [...walk(imagesDir)]
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .map((file) => "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/"))
  : [];
const orphans = allFiles.filter((file) => !references.has(file));

if (orphans.length > 0) {
  console.warn(`⚠ ${orphans.length} file(s) under public/images are referenced nowhere:`);
  for (const orphan of orphans) console.warn(`   ${orphan}`);
}

if (missing.length > 0) {
  console.error(`✗ ${missing.length} referenced image path(s) do not exist under public/:`);
  for (const ref of missing) console.error(`   ${ref}`);
  process.exit(1);
}

console.log(
  `✓ ${references.size} image references all resolve (${orphans.length} orphans warned).`
);
