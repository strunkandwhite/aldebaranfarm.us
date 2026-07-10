# Deep Clean Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all findings from the 2026-07-09 deep-clean audit — one live booking-link bug, source-of-truth consolidation (footer contact info, listing URLs, analytics event names, site config), doc drift from the reviews feature, plus security headers, gallery preload, image-reference checking, and a minimal test suite for the two pure-logic lib modules.

**Architecture:** No new architectural patterns — every fix strengthens the existing ones (`lib/data → Property → props`, `imageUrl()`, delegated `data-track` analytics, per-concern `lib/` modules). New additions: `lib/site.ts` (site config), `lib/analytics/events.ts` (vendor-free event names), `scripts/check-images.mjs` (build-time image-reference check), and Vitest for `lib/booking`, `lib/images`, `lib/data` unit tests.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui (Base UI), gray-matter, Vitest (new, dev-only).

## Global Constraints

- Use **pnpm** for everything.
- **Always `git -C /Users/arpanet/dev/aldebaranfarm.us <cmd>`** — never `cd` into the repo for git commands. This applies to every agent.
- The repo is a **blobless clone** (`--filter=blob:none`): historical-blob reads lazy-fetch from GitHub. Normal status/add/commit/diff-against-HEAD works offline-fast.
- All work on branch `deep-clean-fixes` (created in Task 0). One commit per task. Never use `--no-verify` — the pre-commit hook (lint-staged, knip, tsc, and later tests + image check) is the quality gate.
- Commit messages: why-focused, 1–2 sentences, ending with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Visual output must be **pixel-identical** except where a task explicitly says otherwise (the only intentional visual change: ReviewCard's link underline offset goes from `underline-offset-2` to the shared `underline-offset-4`).
- `components/ui/button.tsx` is generated shadcn code; Task 10's brand variant is a **deliberate customization** (sanctioned by CLAUDE.md) — change nothing else in that file.
- Light-only design; don't introduce dark-mode styles.
- Don't modify anything under `docs/superpowers/plans/` or `docs/superpowers/specs/` (historical records) — except checking off boxes in THIS plan.

## Finding → Task map

| Audit finding                                                                                                                                                                                                                        | Task |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| C1 mailto `+` encoding bug; I10 booking test; M tel: inline in page                                                                                                                                                                  | 1    |
| M imageUrl trailing-slash/protocol-relative join                                                                                                                                                                                     | 2    |
| M siteUrl in layout; M sitemap route list; M Hero imports bookNowHref from Nav                                                                                                                                                       | 3    |
| I11 frontmatter shape validation; I13 street address model; M placeholder images + stale NOTE; M description-is-Markdown comment                                                                                                     | 4    |
| C4 EVENTS not wired to data-track; M ExternalLink rel/target overridable                                                                                                                                                             | 5    |
| C2 footer hard-codes contact info; M footer links un-instrumented                                                                                                                                                                    | 6    |
| C3 reviews components import content/; I6 listing URLs duplicated in reviews.ts                                                                                                                                                      | 7    |
| I12 property facts frozen in metadata; M title template no-op; M sitemap lastModified; owner: link previews showed "Spring Green, Wisconsin" as the title                                                                            | 8    |
| I7 no security headers                                                                                                                                                                                                               | 9    |
| I17 brand CTA copy-paste; I18 prose-link class dup + deviation; I19 page-header boilerplate; M AirbnbLink/VrboLink twins; M unused spacing tokens                                                                                    | 10   |
| M "NO TV" in JSX; M sleepsLine pluralization; owner: "slightly higher rates" → "higher rates"; owner: remove the recommendations map entirely (resolves the map-ID-duplication finding and supersedes the click-to-load-facade idea) | 11   |
| I8 lightbox preload; M things-to-do LCP priority; M shadcn in dependencies                                                                                                                                                           | 12   |
| I9 image existence check + orphan report                                                                                                                                                                                             | 13   |
| C5 stale comments/docs; I14 reviews undocumented; I15 "equally-weighted" claim; I16 /images grep-test wording; M doc small-drift items; CLAUDE.md test-suite line                                                                    | 14   |
| Audit report + final verification                                                                                                                                                                                                    | 15   |

**Deliberately NOT addressed** (record in the Task 15 audit report): the FAQ answer's street-address prose (narrative content with extra context — conscious duplication, kept); restyling footer links to `navLinkClass` (docs corrected instead — the smaller footer treatment is intentional). Resolved by owner decision rather than code fixes: the map-ID-duplication and click-to-load-facade findings (recommendations map removed entirely, Task 11) and the orphaned gallery photos (deleted, Task 13 — recoverable from git history).

---

### Task 0: Branch + git hooks

**Files:** none (repo state only)

- [ ] **Step 1: Confirm clean master and create the branch**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us status --short   # expect: empty
git -C /Users/arpanet/dev/aldebaranfarm.us checkout master
git -C /Users/arpanet/dev/aldebaranfarm.us pull
git -C /Users/arpanet/dev/aldebaranfarm.us checkout -b deep-clean-fixes
```

- [ ] **Step 2: Re-arm husky** (the `.git` dir was restored after `pnpm install`, so `core.hooksPath` was never set)

```bash
cd /Users/arpanet/dev/aldebaranfarm.us && pnpm prepare
git -C /Users/arpanet/dev/aldebaranfarm.us config core.hooksPath   # expect: .husky/_
```

---

### Task 1: Test infrastructure + booking URL fixes

**Files:**

- Create: `vitest.config.ts`, `lib/booking/index.test.ts`
- Modify: `package.json` (devDep + script), `lib/booking/index.ts`, `app/reservations/page.tsx:33`, `.husky/pre-commit`

**Interfaces:**

- Consumes: `Property` from `types/property.ts` (unchanged in this task).
- Produces: `buildInquiryMailtoUrl(property, details?)` — same signature, RFC 6068-correct output. NEW `buildInquiryTelUrl(property: Property): string` returning `tel:+1<10 digits>`. Later tasks (6) import both from `@/lib/booking`.

- [ ] **Step 1: Install vitest and wire scripts**

```bash
cd /Users/arpanet/dev/aldebaranfarm.us && pnpm add -D vitest
```

In `package.json` scripts, add: `"test": "vitest run"`.

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      // lib/data imports "server-only", which throws outside a React Server
      // bundle. Stub it for unit tests.
      "server-only": path.resolve(__dirname, "test/server-only-stub.ts"),
    },
  },
});
```

Create `test/server-only-stub.ts` containing exactly:

```ts
export {};
```

- [ ] **Step 2: Write the failing test** — `lib/booking/index.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { buildInquiryMailtoUrl, buildInquiryTelUrl } from "./index";
import type { Property } from "@/types/property";

const property = {
  name: "Aldebaran Farm",
  contactEmail: "aldebaran.farm.rental@gmail.com",
  contactPhone: "(312) 401-2484",
} as Property;

describe("buildInquiryMailtoUrl", () => {
  it("percent-encodes per RFC 6068 — spaces are %20, never +", () => {
    const url = buildInquiryMailtoUrl(property);
    expect(url.startsWith("mailto:")).toBe(true);
    expect(url).not.toContain("+");
    expect(url).toContain("%20");
  });

  it("round-trips subject and body exactly, including all optional fields", () => {
    const url = buildInquiryMailtoUrl(property, {
      checkIn: "2026-08-01",
      checkOut: "2026-08-04",
      guests: 6,
      message: "We have a dog.",
    });
    const query = url.split("?")[1];
    const params = Object.fromEntries(
      query.split("&").map((pair) => pair.split("=").map((part) => decodeURIComponent(part)))
    );
    expect(params.subject).toBe("Booking inquiry — Aldebaran Farm");
    expect(params.body).toBe(
      [
        "Hi, I'd like to inquire about staying at Aldebaran Farm.",
        "",
        "Check-in: 2026-08-01",
        "Check-out: 2026-08-04",
        "Guests: 6",
        "",
        "We have a dog.",
      ].join("\n")
    );
  });

  it("omits optional fields that aren't provided", () => {
    const url = buildInquiryMailtoUrl(property);
    const body = decodeURIComponent(url.split("body=")[1]);
    expect(body).toBe("Hi, I'd like to inquire about staying at Aldebaran Farm.");
  });
});

describe("buildInquiryTelUrl", () => {
  it("normalizes a formatted US number", () => {
    expect(buildInquiryTelUrl(property)).toBe("tel:+13124012484");
  });

  it("does not double the country code when the number already has one", () => {
    expect(buildInquiryTelUrl({ ...property, contactPhone: "+1 (312) 401-2484" })).toBe(
      "tel:+13124012484"
    );
    expect(buildInquiryTelUrl({ ...property, contactPhone: "1-312-401-2484" })).toBe(
      "tel:+13124012484"
    );
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `pnpm test`
Expected: FAIL — `buildInquiryTelUrl` is not exported, and the `+`-encoding assertions fail against the `URLSearchParams` implementation.

- [ ] **Step 4: Fix the implementation** — in `lib/booking/index.ts`, replace the `params`/`return` block of `buildInquiryMailtoUrl` (lines 48–53) with:

```ts
// RFC 6068 requires percent-encoding (%20 for spaces). URLSearchParams must
// NOT be used here: it produces form-encoding, where spaces become "+", and
// spec-compliant mail clients (Apple Mail, iOS, Outlook) render those
// pluses literally in the draft.
const query = [
  `subject=${encodeURIComponent(subject)}`,
  `body=${encodeURIComponent(lines.join("\n"))}`,
].join("&");

return `mailto:${encodeURIComponent(property.contactEmail)}?${query}`;
```

Append to the same file:

```ts
/**
 * Build a `tel:` URL for the owner's booking phone line. Tolerates any US
 * formatting in the content file — "(312) 401-2484", "+1 312…", "1-312…" all
 * normalize to the same E.164 target.
 */
export function buildInquiryTelUrl(property: Property): string {
  const digits = property.contactPhone.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return `tel:+1${national}`;
}
```

Also in this file's header comment (lines 10–13), replace the "ALSO LIVE" paragraph with (the "equally-weighted" claim no longer matches the shipped page):

```ts
 * ALSO LIVE: the reservations page links out to the property's Airbnb and
 * Vrbo listings (see `ListingLink` in `components/property`) as secondary
 * paths — the page leads with direct email/phone booking, which gets guests
 * the best rate.
```

(Note: `ListingLink` is created in Task 10; at this point in history the components are still `AirbnbLink`/`VrboLink`. Write the comment as above anyway — it becomes exact within this branch, and pre-commit doesn't check prose.)

- [ ] **Step 5: Use the tel builder in the reservations page** — in `app/reservations/page.tsx`, add `buildInquiryTelUrl` to the existing `@/lib/booking` import and replace line 33:

```ts
const telHref = buildInquiryTelUrl(property);
```

- [ ] **Step 6: Add tests to the pre-commit gate** — `.husky/pre-commit` becomes:

```sh
pnpm exec lint-staged --no-stash
pnpm knip
pnpm tsc --noEmit
pnpm test
```

- [ ] **Step 7: Verify**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm knip`
Expected: all pass. (If knip flags `vitest` or `vitest.config.ts`, add `"vitest"` to nothing — knip's vitest plugin should auto-detect the config; if it genuinely errors, add `"ignore": ["test/server-only-stub.ts"]` to `knip.json` rather than ignoring the dependency.)

- [ ] **Step 8: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Fix mailto links garbling spaces as '+' in mail clients and add tested tel/mailto builders

URLSearchParams form-encodes, but RFC 6068 mailto URLs need percent-encoding; guests on Apple Mail/iOS/Outlook saw 'Booking+inquiry+—+Aldebaran+Farm'. Adds Vitest as the harness for lib/ unit tests.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: imageUrl hardening + tests

**Files:**

- Create: `lib/images/index.test.ts`
- Modify: `lib/images/index.ts`

**Interfaces:**

- Produces: `imageUrl(src: string): string` — same signature; now strips trailing slashes from the base, passes through protocol-relative (`//…`) URLs, and reads the env var per-call so tests can stub it. (Next.js still statically inlines `process.env.NEXT_PUBLIC_IMAGE_BASE_URL` because the member expression stays literal.)

- [ ] **Step 1: Write the failing test** — `lib/images/index.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { imageUrl } from "./index";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("imageUrl", () => {
  it("passes paths through unchanged when no base URL is set", () => {
    expect(imageUrl("/images/property/house.jpg")).toBe("/images/property/house.jpg");
  });

  it("normalizes a missing leading slash", () => {
    expect(imageUrl("images/property/house.jpg")).toBe("/images/property/house.jpg");
  });

  it("prefixes the CDN base", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_BASE_URL", "https://cdn.example.com");
    expect(imageUrl("/images/a.jpg")).toBe("https://cdn.example.com/images/a.jpg");
  });

  it("tolerates a trailing slash on the base (no double slash)", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_BASE_URL", "https://cdn.example.com/");
    expect(imageUrl("/images/a.jpg")).toBe("https://cdn.example.com/images/a.jpg");
  });

  it("returns absolute and protocol-relative URLs untouched", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_BASE_URL", "https://cdn.example.com");
    expect(imageUrl("https://elsewhere.example/x.jpg")).toBe("https://elsewhere.example/x.jpg");
    expect(imageUrl("//cdn.example.com/x.jpg")).toBe("//cdn.example.com/x.jpg");
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `pnpm test` — the trailing-slash, protocol-relative, and stubbed-env cases fail (env is currently read at module scope, and the base isn't normalized).

- [ ] **Step 3: Fix the implementation** — replace lines 14–29 of `lib/images/index.ts` (delete the module-scope `IMAGE_BASE_URL` const) with:

```ts
/**
 * Resolve a property image path (relative to `/public`, e.g.
 * "/images/property/exterior.svg") to a full URL.
 *
 * - Absolute (`https://…`) and protocol-relative (`//…`) URLs are returned
 *   untouched.
 * - Relative paths are prefixed with `NEXT_PUBLIC_IMAGE_BASE_URL` when set
 *   (trailing slashes on the base are tolerated).
 *
 * The env var is read per-call (still statically inlined by Next.js at build
 * time) so unit tests can stub it.
 */
export function imageUrl(src: string): string {
  if (/^(https?:)?\/\//i.test(src)) {
    return src;
  }
  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "").replace(/\/+$/, "");
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `${base}${normalized}`;
}
```

- [ ] **Step 4: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip` — all pass.

- [ ] **Step 5: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Harden imageUrl base joining before any CDN migration relies on it

A trailing slash on NEXT_PUBLIC_IMAGE_BASE_URL produced '//' URLs and protocol-relative sources were double-prefixed — exactly the untested branch the module exists for.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: `lib/site.ts` — one home for site config

**Files:**

- Create: `lib/site.ts`
- Modify: `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `components/layout/Nav.tsx`, `components/layout/Header.tsx`, `components/layout/MobileNav.tsx`, `components/layout/Footer.tsx`, `components/property/Hero.tsx`

**Interfaces:**

- Produces: `siteUrl: string`, `routes: string[]`, `bookNowHref: string` — all from `@/lib/site`. Tasks 6 and 8 consume these.
- `components/layout/Nav.tsx` keeps `leftNavLinks`, `rightNavLinks`, `navLinkClass` (navLinkClass moves in Task 10) but no longer exports `bookNowHref`.

- [ ] **Step 1: Create `lib/site.ts`**

```ts
/**
 * SITE CONFIG — the single non-UI home for site-wide constants, matching the
 * "each concern has one point of change" pattern of the other lib/ modules.
 */

/**
 * Site URL used for absolute metadata (OG image, sitemap, robots). Set
 * NEXT_PUBLIC_SITE_URL to the production domain at deploy; the fallback is
 * the production domain.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aldebaranfarm.us";

/**
 * Every indexable route, feeding sitemap.xml. Add an entry when adding a
 * page. (The header/footer nav in `components/layout/Nav.tsx` is a curated
 * subset — /gallery, for example, is reached from The House page — so the
 * two lists are intentionally separate.)
 */
export const routes = ["", "/house", "/gallery", "/things-to-do", "/faqs", "/reservations"];

/** The Book Now call-to-action target (email/phone reservations page). */
export const bookNowHref = "/reservations";
```

- [ ] **Step 2: Update consumers**

- `app/layout.tsx`: delete lines 46–51 (the `siteUrl` doc comment + export); add `import { siteUrl } from "@/lib/site";` with the other imports.
- `app/robots.ts` and `app/sitemap.ts`: change `import { siteUrl } from "./layout";` to `import { siteUrl } from "@/lib/site";`. In `app/sitemap.ts` also replace the local `routes` const (line 5) with adding `routes` to the lib/site import: `import { routes, siteUrl } from "@/lib/site";`. (Leave `lastModified` alone here — Task 8 removes it.)
- `components/layout/Nav.tsx`: delete lines 14–15 (the `bookNowHref` comment + export).
- `components/layout/Header.tsx`: import becomes `import { leftNavLinks, rightNavLinks, navLinkClass } from "./Nav";` plus `import { bookNowHref } from "@/lib/site";`.
- `components/layout/MobileNav.tsx`: same split — `import { leftNavLinks, rightNavLinks, navLinkClass } from "./Nav";` plus `import { bookNowHref } from "@/lib/site";`.
- `components/layout/Footer.tsx`: `import { leftNavLinks, rightNavLinks } from "./Nav";` plus `import { bookNowHref } from "@/lib/site";`.
- `components/property/Hero.tsx`: replace `import { bookNowHref } from "@/components/layout/Nav";` with `import { bookNowHref } from "@/lib/site";`.

- [ ] **Step 3: Verify** — `pnpm typecheck && pnpm lint && pnpm knip && pnpm build` — all pass; build still emits 13 static routes.

- [ ] **Step 4: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Move site config out of the root layout into lib/site

robots/sitemap were importing config from a route layout (coupling them to font loading and CSS side effects), and bookNowHref lived in the nav component despite being a route constant consumed across component groups.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Property model gains the street address; frontmatter validation checks shapes

**Files:**

- Create: `lib/data/index.test.ts`
- Modify: `types/property.ts`, `lib/data/index.ts`, `content/property.md`
- Delete: `public/images/property/living-room.png`, `public/images/property/bedroom.png`

**Interfaces:**

- Produces: `PropertyLocation` gains `streetAddress: string` and `regionCode: string`. NEW export `parseProperty(raw: string): Property` from `@/lib/data` (pure; `getProperty()` now reads the file and delegates to it). Task 6 consumes `property.location.streetAddress/city/regionCode`.

- [ ] **Step 1: Extend the types** — in `types/property.ts`, `PropertyLocation` becomes:

```ts
export interface PropertyLocation {
  /** Street address, e.g. "6557 County T". Published pre-booking by design. */
  streetAddress: string;
  /** e.g. "Spring Green" */
  city: string;
  /** State / province / region, e.g. "Wisconsin" */
  region: string;
  /** Short region code for compact display, e.g. "WI" */
  regionCode: string;
  /** Optional country; defaults are handled in the UI, not here. */
  country?: string;
}
```

Also fix three stale doc comments in this file:

- `description` (line 51): change to `/** Long-form description — plain text (a single paragraph) taken from the content file body. */`
- `airbnbUrl` (lines 65–68): change the second sentence to `Used to build a direct link to the listing.` (the embed widget was tried and dropped — see docs/architecture.md).
- `PropertyImage.src` (line 22): the example path cites `living-room.png`, which Step 6 deletes — change the example to `"/images/property/aldebaran_main_house.jpg"`.

- [ ] **Step 2: Write the failing tests** — `lib/data/index.test.ts`:

```ts
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
```

- [ ] **Step 3: Run to verify it fails** — `pnpm test` — `parseProperty` is not exported.

- [ ] **Step 4: Implement** — in `lib/data/index.ts`:

Replace `getProperty` (lines 28–40) with:

```ts
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
```

Replace `assertValidFrontmatter` (lines 42–84) entirely with:

```ts
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

  const location = fm.location;
  if (typeof location !== "object" || location === null) {
    fail("`location` must be an object.");
  }
  const locationStringFields = ["streetAddress", "city", "region", "regionCode"] as const;
  for (const key of locationStringFields) {
    const value = (location as Record<string, unknown>)[key];
    if (typeof value !== "string" || value.trim() === "") {
      fail(`\`location.${key}\` must be a non-empty string.`);
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
```

- [ ] **Step 5: Update `content/property.md`**

- Under `location:`, add `streetAddress: 6557 County T` (first line) and `regionCode: WI` (after `region`).
- Delete the two placeholder image entries (`living-room.png` and `bedroom.png`, lines 86–91) and the stale NOTE comment lines 80–81 (`# NOTE: the lead image below is the real hero photo…`), keeping the `# Paths are relative to /public…` comment line.
- In the header comment (line 11), change `Everything below it is the Markdown \`description\` body.`to`Everything below it is the \`description\` body (rendered as plain text — keep it a single plain paragraph).`

- [ ] **Step 6: Delete the orphaned placeholder files** (verify nothing references them first; `exterior.png` is a third scaffold placeholder that was already referenced nowhere)

```bash
grep -rn "living-room.png\|bedroom.png\|exterior.png" app components content lib   # expect: no matches after Step 5
rm public/images/property/living-room.png public/images/property/bedroom.png public/images/property/exterior.png
```

- [ ] **Step 7: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip && pnpm build` — all pass (the build exercises the new validation against the real content file).

- [ ] **Step 8: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Validate frontmatter shapes (not just presence) and give the street address a typed home

'maxGuests: eleven' previously passed validation and rendered garbage; the address existed only as hard-coded strings in the footer and FAQ. Also drops the long-stale placeholder scaffold images.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Analytics EVENTS actually govern the `data-track` path; ExternalLink hardening

**Files:**

- Create: `lib/analytics/events.ts`
- Modify: `lib/analytics/index.ts`, `components/layout/Header.tsx`, `components/layout/MobileNav.tsx`, `components/property/Hero.tsx`, `app/reservations/page.tsx`, `components/shared/ExternalLink.tsx`

**Interfaces:**

- Produces: `EVENTS` from `@/lib/analytics/events` (vendor-free — safe for Server Components). `@/lib/analytics` re-exports it, so `GalleryGrid`'s existing import keeps working. Task 6 (Footer) consumes `EVENTS` from `@/lib/analytics/events`.

- [ ] **Step 1: Create `lib/analytics/events.ts`** (move the const verbatim from `index.ts`, new doc comment):

```ts
/**
 * Canonical analytics event names — the values used in `data-track`
 * attributes (handled by `TrackedClicks`) and direct `trackEvent()` calls.
 * Reference these instead of typing string literals so a rename is a
 * one-place edit. Kept in its own vendor-free module so Server Components
 * can import it without pulling `@vercel/analytics` into the server graph.
 */
export const EVENTS = {
  bookNowClick: "book_now_click",
  inquiryEmailClick: "inquiry_email_click",
  inquiryPhoneClick: "inquiry_phone_click",
  galleryPhotoOpen: "gallery_photo_open",
  outboundClick: "outbound_click",
} as const;
```

- [ ] **Step 2: Slim `lib/analytics/index.ts`** — delete the `EVENTS` const (lines 13–23) and add at the top, after the vendor import:

```ts
export { EVENTS } from "./events";
```

- [ ] **Step 3: Wire every `data-track` literal to the constant.** In each file, add `import { EVENTS } from "@/lib/analytics/events";` and replace:

- `components/layout/Header.tsx:43`: `data-track="book_now_click"` → `data-track={EVENTS.bookNowClick}`
- `components/layout/MobileNav.tsx:55`: same replacement
- `components/property/Hero.tsx:47`: same replacement
- `app/reservations/page.tsx:48`: `data-track="inquiry_email_click"` → `data-track={EVENTS.inquiryEmailClick}`
- `app/reservations/page.tsx:58`: `data-track="inquiry_phone_click"` → `data-track={EVENTS.inquiryPhoneClick}`

- [ ] **Step 4: ExternalLink — use the constant AND make the security attrs unoverridable** — `components/shared/ExternalLink.tsx` body becomes:

```tsx
import { EVENTS } from "@/lib/analytics/events";

/**
 * ExternalLink — a reusable anchor for outbound links (Airbnb, VRBO, maps, …)
 * with safe `rel`/`target` defaults. Cross-cutting, so it lives in `shared`.
 *
 * Spreads any extra props onto the `<a>` so it can be used polymorphically as
 * a Button's `render` target (Base UI injects className/data-slot/children).
 * `target`/`rel` come AFTER the spread on purpose: call sites can override
 * the default `data-track`, but not the tab-isolation attributes.
 */
export function ExternalLink({
  href,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { href: string }) {
  return (
    <a
      href={href}
      data-track={EVENTS.outboundClick}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 5: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip && pnpm build`. Then confirm the rendered HTML is unchanged: `grep -o 'data-track="[a-z_]*"' .next/server/app/index.html | sort | uniq -c` should still show `book_now_click` (and `outbound_click` on external links).

- [ ] **Step 6: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Make the EVENTS registry actually govern data-track attributes

Four of five event names existed only as raw string literals across five files, so the registry's promised one-place rename was false. Also locks ExternalLink's target/rel against prop-spread override.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Footer reads the Property instead of hard-coding contact info

**Files:**

- Modify: `components/layout/Footer.tsx`

**Interfaces:**

- Consumes: `getProperty()` (Task 4's location fields), `buildInquiryMailtoUrl`/`buildInquiryTelUrl` (Task 1), `EVENTS` (Task 5), `bookNowHref` (Task 3).
- Produces: `Footer` becomes an **async** Server Component (no prop changes — `app/layout.tsx` needs no edit; React supports async components in the layout body).

- [ ] **Step 1: Rewrite `components/layout/Footer.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";

import { Container } from "./Container";
import { leftNavLinks, rightNavLinks } from "./Nav";
import { ExternalLink } from "@/components/shared/ExternalLink";
import { EVENTS } from "@/lib/analytics/events";
import { buildInquiryMailtoUrl, buildInquiryTelUrl } from "@/lib/booking";
import { getProperty } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { bookNowHref } from "@/lib/site";

const footerLinks = [
  ...leftNavLinks,
  ...rightNavLinks,
  { href: bookNowHref, label: "Rates & Reservations" },
];

/**
 * Footer — site footer with the wordmark, quick links, and contact details.
 * Contact info and the address come from the Property (single source of
 * truth: content/property.md) — never hard-code them here.
 */
export async function Footer() {
  const property = await getProperty();
  const { streetAddress, city, regionCode } = property.location;
  const addressLine = `${streetAddress}, ${city}, ${regionCode}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`;

  return (
    <footer className="mt-auto border-t border-border py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-between">
        <div className="flex flex-col">
          <div>
            <Link href="/" className="flex items-center gap-2 font-heading text-2xl text-primary">
              <Image
                src={imageUrl("/images/brand/logo.png")}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-sm"
              />
              {property.name}
            </Link>
            <p className="mt-1 text-sm text-foreground">
              <ExternalLink href={mapsUrl} className="underline-offset-4 hover:underline">
                {addressLine}
              </ExternalLink>
            </p>
            <p className="text-sm text-foreground">
              <a
                href={buildInquiryMailtoUrl(property)}
                data-track={EVENTS.inquiryEmailClick}
                data-track-location="footer"
                className="underline-offset-4 hover:underline"
              >
                {property.contactEmail}
              </a>{" "}
              &middot;{" "}
              <a
                href={buildInquiryTelUrl(property)}
                data-track={EVENTS.inquiryPhoneClick}
                data-track-location="footer"
                className="underline-offset-4 hover:underline"
              >
                {property.contactPhone}
              </a>
            </p>
          </div>

          <p className="mt-6 text-xs text-foreground sm:mt-auto">
            &copy; {new Date().getFullYear()} {property.name}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2 text-sm sm:items-end">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
```

Notes: the email link now opens the pre-filled inquiry template (same as the reservations page) instead of a bare mailto — deliberate upgrade, and it means one mailto implementation. Both contact links are now instrumented with `data-track-location="footer"` so footer conversions stop undercounting.

- [ ] **Step 2: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip && pnpm build`. Then: `grep -c "6557 County T" .next/server/app/index.html` → still ≥1 (address renders), and `grep -rn "aldebaran.farm.rental@gmail.com\|401-2484\|6557 County T" components/ app/ lib/` → **no matches** (all copies now flow from content).

- [ ] **Step 3: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Footer pulls contact info and address from getProperty() instead of hard-coding them

Editing property.md updated the reservations page but silently left stale contact details in the site-wide footer — the exact drift the data layer exists to prevent. Footer inquiry links are now tracked like their reservations twins.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Reviews flow through props; listing URLs derive from the Property

**Files:**

- Modify: `content/reviews.ts`, `app/page.tsx`, `components/reviews/Reviews.tsx`, `components/reviews/ReviewCard.tsx`

**Interfaces:**

- Consumes: `Property.airbnbUrl` / `Property.vrboUrl`.
- Produces: `content/reviews.ts` exports `ReviewSource`, `Review`, `ReviewSourceInfo { label: string; url: string }`, `googleReviewsUrl`, `reviews` — and NO LONGER exports `reviewSources`. `Reviews({ reviews, sources })` and `ReviewCard({ review, sources })` where `sources: Record<ReviewSource, ReviewSourceInfo>`.

- [ ] **Step 1: `content/reviews.ts`** — replace the `reviewSources` block (lines 32–40) with:

```ts
/** Display label + outbound listing URL for a review source. */
export interface ReviewSourceInfo {
  label: string;
  url: string;
}
```

(Keep `googleReviewsUrl`. The Airbnb/Vrbo URLs are gone from this file — the page derives them from the `Property`, so a re-listing under a new ID is a one-file content edit again.)

- [ ] **Step 2: `app/page.tsx`** — the page owns composition:

```tsx
import { getProperty } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/property/Hero";
import { Reviews } from "@/components/reviews/Reviews";
import {
  googleReviewsUrl,
  reviews,
  type ReviewSource,
  type ReviewSourceInfo,
} from "@/content/reviews";

/**
 * The single-property landing page.
 *
 * The home page leads with the hero (a framed lead photo plus the property
 * intro and a Book Now CTA) followed by the guest-reviews section. The other
 * sections (gallery, amenities, things to do, FAQs, reservations) each live on
 * their own page.
 *
 * DATA FLOW: content/property.md -> lib/data.getProperty() -> typed `Property`
 * -> Hero. Reviews come from content/reviews.ts; their Airbnb/Vrbo attribution
 * links derive from the Property so listing URLs live in exactly one place.
 * This is a Server Component, so `getProperty()` runs on the server.
 */
export default async function HomePage() {
  const property = await getProperty();

  const reviewSources: Record<ReviewSource, ReviewSourceInfo> = {
    google: { label: "Google", url: googleReviewsUrl },
    airbnb: { label: "Airbnb", url: property.airbnbUrl },
    vrbo: { label: "Vrbo", url: property.vrboUrl },
  };

  return (
    <Container>
      <Hero property={property} />
      <Reviews reviews={reviews} sources={reviewSources} />
    </Container>
  );
}
```

- [ ] **Step 3: `components/reviews/Reviews.tsx`** — data arrives as props (imports of `reviews` removed):

```tsx
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ReviewCard } from "./ReviewCard";
import type { Review, ReviewSource, ReviewSourceInfo } from "@/content/reviews";

/**
 * Reviews — the guest-reviews section shown on the home page, directly below
 * the hero: a "Guest Reviews" heading and a grid of review cards. Receives
 * reviews and source-attribution links as props (components never read
 * `content/` themselves — see components/README.md).
 */
export function Reviews({
  reviews,
  sources,
}: {
  reviews: Review[];
  sources: Record<ReviewSource, ReviewSourceInfo>;
}) {
  return (
    <section className="pt-4 pb-16 md:pt-6 md:pb-24">
      <SectionHeading>Guest Reviews</SectionHeading>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} sources={sources} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `components/reviews/ReviewCard.tsx`** — imports become type-only; `const source = sources[review.source];`:

```tsx
import { StarRating } from "./StarRating";
import { ExternalLink } from "@/components/shared/ExternalLink";
import type { Review, ReviewSource, ReviewSourceInfo } from "@/content/reviews";
```

and the signature:

```tsx
export function ReviewCard({
  review,
  sources,
}: {
  review: Review;
  sources: Record<ReviewSource, ReviewSourceInfo>;
}) {
  const source = sources[review.source];
```

(The JSX body is unchanged in this task — the `underline-offset-2` deviation is fixed in Task 10.)

- [ ] **Step 5: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip && pnpm build`, then `grep -rn "airbnb.com/rooms\|vrbo.com/" content/ components/ app/` → matches only in `content/property.md`.

- [ ] **Step 6: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Route reviews through page props and derive listing URLs from the Property

The reviews components were the only ones importing content/ directly (against the documented data rule), and reviews.ts carried admitted mirror copies of the Airbnb/Vrbo listing URLs.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Metadata derives from the Property; title template does the suffixing

**Files:**

- Modify: `app/layout.tsx`, `app/house/page.tsx`, `app/gallery/page.tsx`, `app/faqs/page.tsx`, `app/things-to-do/page.tsx`, `app/reservations/page.tsx`, `app/sitemap.ts`

**Interfaces:**

- Consumes: `getProperty()`, `siteUrl`/`routes` from `@/lib/site`.
- Produces: `app/layout.tsx` exports `generateMetadata()` instead of `metadata`. Page `metadata.title` values become bare names (template appends the brand).

- [ ] **Step 1: `app/layout.tsx`** — replace the `description` const and `export const metadata` block (lines 53–84) with:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty();
  const { city, region, regionCode } = property.location;
  // "in", not "—": link-preview scrapers that strip the site name from an
  // em-dash title were showing bare "Spring Green, Wisconsin" as the preview.
  const defaultTitle = `${property.name} in ${city}, ${regionCode}`;
  const description = `A historic countryside retreat in ${city}, ${region}'s Driftless region, across the road from Frank Lloyd Wright's Taliesin. Book directly by email or phone.`;
  const ogImage = {
    url: imageUrl("/images/brand/og-image.jpg"),
    width: 1200,
    height: 630,
    alt: `${property.name} — ${property.tagline}`,
  };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s — ${property.name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: property.name,
      title: defaultTitle,
      description,
      url: siteUrl,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [ogImage.url],
    },
  };
}
```

Add `import { getProperty } from "@/lib/data";` to the layout imports.

- [ ] **Step 2: Page titles become bare (template adds the suffix)**

- `app/gallery/page.tsx:9`: `title: "Gallery",`
- `app/faqs/page.tsx:10`: `title: "FAQs",`
- `app/things-to-do/page.tsx:11`: `title: "Things To Do",`
- `app/reservations/page.tsx:22`: `title: "Rates & Reservations",`

- [ ] **Step 3: `app/house/page.tsx`** — property facts must not be frozen into the description. Replace the `export const metadata` block (lines 9–13) with:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty();
  const { city, region } = property.location;
  return {
    title: "The House",
    description: `Details, amenities, and history of the main house at ${property.name} — a historic 1861 home in ${city}, ${region}, sleeping ${property.maxGuests} across ${property.bedrooms} bedrooms.`,
  };
}
```

- [ ] **Step 4: `app/sitemap.ts`** — drop the build-time `lastModified` stamp (it claimed every page changed on every deploy):

```ts
import type { MetadataRoute } from "next";

import { routes, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
  }));
}
```

- [ ] **Step 5: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip && pnpm build`, then check the rendered social-graph surface:

- `grep -o "<title>[^<]*</title>" .next/server/app/house.html` → `<title>The House — Aldebaran Farm</title>`
- `grep -o "<title>[^<]*</title>" .next/server/app/index.html` → `<title>Aldebaran Farm in Spring Green, WI</title>`
- `grep -o 'property="og:title" content="[^"]*"' .next/server/app/index.html` → `Aldebaran Farm in Spring Green, WI`
- `grep -o 'name="twitter:title" content="[^"]*"' .next/server/app/index.html` → same
- `grep -o 'property="og:image"[^>]*' .next/server/app/index.html` → absolute URL ending in `/images/brand/og-image.jpg` (metadataBase applied)

- [ ] **Step 6: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Derive SEO/OG metadata from the Property and fix link-preview titles

Guest capacity, bedroom count, and the property name were frozen into static metadata strings, so property.md edits never reached the SEO surface; the '%s' no-op template meant a rebrand touched six files; and social link previews rendered the em-dash title as bare 'Spring Green, Wisconsin' — it's now 'Aldebaran Farm in Spring Green, WI'.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Security response headers

**Files:**

- Modify: `next.config.ts`

- [ ] **Step 1: Add a `headers()` block** to `nextConfig` (calibrated to a static brochure site — no cookies, no auth; `frame-ancestors 'none'` closes the clickjacking/brand-abuse vector):

```ts
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
```

- [ ] **Step 2: Verify** — `pnpm build` passes; then `pnpm start` in the background and `curl -sI http://localhost:3000 | grep -i -E "frame|nosniff|referrer|permissions"` shows all five headers; stop the server.

- [ ] **Step 3: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Ship baseline security headers — the site was frameable by any third party

frame-ancestors/nosniff/referrer-policy are zero-regression for a static site and close the clickjacking overlay vector on the booking CTA.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Shared UI primitives — brand button variant, link classes, PageTitle, ListingLink

**Files:**

- Create: `components/shared/links.ts`, `components/property/ListingLink.tsx`
- Modify: `components/ui/button.tsx` (deliberate customization), `components/layout/Nav.tsx`, `components/layout/Header.tsx`, `components/layout/MobileNav.tsx`, `components/layout/PageTitle.tsx`, `components/property/Hero.tsx`, `components/property/DetailsAndAmenities.tsx`, `components/reviews/ReviewCard.tsx`, `components/shared/RichText.tsx`, `app/reservations/page.tsx`, `app/house/page.tsx`, `app/gallery/page.tsx`, `app/faqs/page.tsx`, `app/things-to-do/page.tsx`, `app/globals.css`
- Delete: `components/property/AirbnbLink.tsx`, `components/property/VrboLink.tsx`

**Interfaces:**

- Produces: Button gains `variant="brand"` + sizes `brand-sm` / `brand-lg`. `navLinkClass` and `proseLinkClass` from `@/components/shared/links` (`Nav.tsx` no longer exports `navLinkClass`). `PageTitle` now carries its own `pt-6 md:pt-10`. `ListingLink({ href, label, destination }: { href: string; label: string; destination: string })` replaces `AirbnbLink`/`VrboLink`.

- [ ] **Step 1: Brand button variant** — in `components/ui/button.tsx`, inside the `cva` variants add (after `link:`):

```ts
        // Deliberate brand customization (see docs/style-guide.md): the
        // filled-burgundy CTA used site-wide — square corners, Playfair.
        brand:
          "rounded-none bg-primary font-heading text-base text-primary-foreground hover:bg-primary/80",
```

and inside `size` (after `"icon-lg"`):

```ts
        "brand-sm": "h-auto gap-1.5 px-5 py-2",
        "brand-lg": "h-auto gap-1.5 px-8 py-3",
```

- [ ] **Step 2: Update the four CTA call sites**

- `components/layout/Header.tsx` (lines 41–49): the Button becomes

```tsx
<Button
  variant="brand"
  size="brand-sm"
  render={<Link href={bookNowHref} data-track={EVENTS.bookNowClick} data-track-location="header" />}
  nativeButton={false}
>
  Book Now
</Button>
```

- `components/layout/MobileNav.tsx` (lines 59–62): `className={cn(buttonVariants({ variant: "brand", size: "brand-sm" }), "mt-2")}`
- `components/property/Hero.tsx` (lines 45–53): `variant="brand" size="brand-lg"`, className becomes just `className="mt-8"`.
- `components/property/DetailsAndAmenities.tsx` (lines 50–56): `variant="brand" size="brand-lg"`, className becomes just `className="mt-6"`.

- [ ] **Step 3: Link class constants** — create `components/shared/links.ts`:

```ts
/**
 * Shared link styling (see docs/style-guide.md "Link language"):
 * - Nav links (header/mobile drawer): Playfair, underline on hover.
 * - Prose links (body copy): underlined at rest, soften on hover.
 * The footer's quick links use their own smaller treatment in Footer.tsx.
 */
export const navLinkClass = "font-heading text-lg text-primary underline-offset-4 hover:underline";

export const proseLinkClass = "underline underline-offset-4 hover:opacity-70";
```

- `components/layout/Nav.tsx`: delete the `navLinkClass` export (lines 17–18).
- `components/layout/Header.tsx` + `components/layout/MobileNav.tsx`: import `navLinkClass` from `@/components/shared/links` instead of `./Nav`.
- `components/shared/RichText.tsx`: `import { proseLinkClass } from "./links";` and `className={proseLinkClass}` (line 26).
- `components/reviews/ReviewCard.tsx` line 24: `className={proseLinkClass}` (this intentionally normalizes the deviant `underline-offset-2` to the shared offset-4 — the one sanctioned visual change).
- `app/reservations/page.tsx`: import `proseLinkClass` from `@/components/shared/links`; use it on the email link (line 49), phone link (line 59), and FAQs `Link` (line 67), replacing the literal `"underline underline-offset-4 hover:opacity-70"`.

- [ ] **Step 4: PageTitle absorbs the header rhythm** — `components/layout/PageTitle.tsx` h1 className becomes:

```tsx
        "pt-6 text-center font-heading text-[32px] leading-tight text-primary sm:text-[40px] md:pt-10",
```

Then in all five inner pages (`app/house/page.tsx`, `app/gallery/page.tsx`, `app/faqs/page.tsx`, `app/things-to-do/page.tsx`, `app/reservations/page.tsx`), replace

```tsx
<div className="pt-6 md:pt-10">
  <PageTitle>…</PageTitle>
</div>
```

with the bare `<PageTitle>…</PageTitle>` (keep each page's title text).

- [ ] **Step 5: ListingLink** — create `components/property/ListingLink.tsx`:

```tsx
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/shared/ExternalLink";

/**
 * ListingLink — a button that opens one of the property's platform listings
 * (Airbnb, Vrbo, …) in a new tab. The reservations page presents these as
 * secondary paths below direct email/phone booking. The listing URL comes
 * from the Property (content/property.md) via the page.
 */
export function ListingLink({
  href,
  label,
  destination,
}: {
  href: string;
  label: string;
  destination: string;
}) {
  return (
    <Button
      nativeButton={false}
      render={<ExternalLink href={href} data-track-destination={destination} />}
    >
      {label}
      <ExternalLinkIcon data-icon="inline-end" />
    </Button>
  );
}
```

Delete `components/property/AirbnbLink.tsx` and `components/property/VrboLink.tsx`. In `app/reservations/page.tsx`, replace the two imports with `import { ListingLink } from "@/components/property/ListingLink";` and the usage (lines 86–89) with:

```tsx
<div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
  <ListingLink href={property.airbnbUrl} label="Book on Airbnb" destination="airbnb" />
  <ListingLink href={property.vrboUrl} label="Book on Vrbo" destination="vrbo" />
</div>
```

- [ ] **Step 6: Remove the unused spacing tokens** — in `app/globals.css`, delete the two `--spacing-brand-gutter` / `--spacing-brand-section` lines and their `/* Named brand spacing … */` comment (grep confirms zero usages; they were false affordances).

- [ ] **Step 7: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip && pnpm build`. Visual spot-check via `pnpm start` + browser (or curl the HTML): header/hero CTAs still render `rounded-none` filled burgundy; page titles keep their top padding.

- [ ] **Step 8: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Consolidate copy-pasted UI recipes into shared primitives

The brand CTA classes were retyped at four call sites, the prose-link class at five (one silently deviating), the page-header wrapper at five, and AirbnbLink/VrboLink were twins differing only in data. Also removes the never-used brand spacing tokens.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: Content/copy consolidation — amenities note, pluralization, rates copy, map removal

**Files:**

- Modify: `lib/utils.ts`, `types/property.ts`, `lib/data/index.ts`, `content/property.md`, `components/property/Hero.tsx`, `components/property/DetailsAndAmenities.tsx`, `content/rates.ts`, `app/things-to-do/page.tsx`

**Interfaces:**

- Produces: `pluralize(count: number, noun: string): string` in `@/lib/utils`. `Property.amenitiesNote?: string`.

- [ ] **Step 1: `pluralize` in `lib/utils.ts`** — append:

```ts
/** "1 bedroom" / "3 bedrooms" — naive English pluralization for quick-facts copy. */
export function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
```

- [ ] **Step 2: amenitiesNote** — in `types/property.ts`, after `amenities: string[];` add:

```ts
  /** Optional note rendered after the amenities list (e.g. "there is NO TV"). */
  amenitiesNote?: string;
```

In `lib/data/index.ts` `assertValidFrontmatter`, after the string-list checks add:

```ts
if (fm.amenitiesNote !== undefined && typeof fm.amenitiesNote !== "string") {
  fail("`amenitiesNote` must be a string when present.");
}
```

In `content/property.md`, after the `amenities:` list (before the house-rules comment) add:

```yaml
amenitiesNote: Please note there is NO TV.
```

- [ ] **Step 3: `components/property/DetailsAndAmenities.tsx`** — add `import { pluralize } from "@/lib/utils";`; replace line 16 with:

```ts
const sleepsLine = `Sleeps ${property.maxGuests} comfortably in ${pluralize(property.bedrooms, "bedroom")} / ${pluralize(property.loftedBeds, "lofted bed")} / ${pluralize(property.bathrooms, "full bathroom")}`;
```

and replace the hard-coded `<p className="mt-6">Please note there is NO TV.</p>` (line 48) with:

```tsx
{
  property.amenitiesNote ? <p className="mt-6">{property.amenitiesNote}</p> : null;
}
```

- [ ] **Step 4: `components/property/Hero.tsx`** — use the same helper (add the import); lines 19–24 become:

```ts
const facts = [
  `Sleeps ${property.maxGuests}`,
  pluralize(property.bedrooms, "Bedroom"),
  pluralize(property.loftedBeds, "Lofted Bed"),
  pluralize(property.bathrooms, "Bathroom"),
].join(" • ");
```

- [ ] **Step 5: Rates copy** (owner request) — in `content/rates.ts`, `alsoListedIntro` becomes:

```ts
export const alsoListedIntro =
  "Aldebaran Farm can also be booked on Airbnb and Vrbo at higher rates.";
```

- [ ] **Step 6: Remove the recommendations map entirely** (owner request — link AND embed, the whole section; the footer's Google Maps _address_ link is a different feature and stays).

In `app/things-to-do/page.tsx`:

- Delete the entire final section — the `{/* Recommendations map — link + embedded Google My Maps */}` comment, the `<section className="pb-16 pt-4">…</section>` block containing the `mapCta` RichText paragraph, the iframe explainer comment, and the iframe wrapper div.
- Remove `mapCta` from the `@/content/things-to-do` import.
- The page must still end with the standard bottom spacing now that the map section (which carried `pb-16`) is gone: change the Architecture & Theater section's className from `"grid items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-12 lg:gap-16"` to `"grid items-center gap-8 pt-8 pb-16 md:grid-cols-2 md:gap-12 md:pt-12 lg:gap-16"`.
- Update the page's doc comment: drop `, then a link to the owners' recommendations map`.

In `content/things-to-do.ts`:

- Delete the `mapCta` export (lines 107–114) — knip would flag it as unused otherwise. `TextRun` is still used by the remaining exports.
- If the file's header doc comment mentions the map link, update it.

- [ ] **Step 7: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip && pnpm build`; `grep -c "NO TV" .next/server/app/house.html` → 1 (still renders); `grep -rn "maps/d/" app/ content/ components/` → no matches (the recommendations map is fully gone); `grep -c "google.com/maps/search" .next/server/app/index.html` → ≥1 (the footer address link survives); `grep -rn "slightly higher" content/ app/ components/` → no matches.

- [ ] **Step 8: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Move guest-facing copy out of JSX, soften the Airbnb/Vrbo rates line, and remove the recommendations map

The NO-TV note was the only owner-editable copy living in a component and the sleeps line hard-coded plurals the data can invalidate. The Google My Maps section (link + embed) is removed at the owner's request; the footer's address link is unrelated and stays.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 12: Gallery lightbox neighbor preload + perf minors

**Files:**

- Modify: `components/gallery/GalleryGrid.tsx`, `app/things-to-do/page.tsx`, `package.json`

- [ ] **Step 1: Preload lightbox neighbors** — in `components/gallery/GalleryGrid.tsx`, after `const current = …` (line 59) add:

```ts
// Photo indexes to warm while the lightbox is open, so prev/next swaps are
// instant instead of showing the previous photo while the new one loads.
const preloadIndexes =
  index === null || flat.length <= 1
    ? []
    : [...new Set([(index + 1) % flat.length, (index - 1 + flat.length) % flat.length])].filter(
        (i) => i !== index
      );
```

Then inside the lightbox, in the `{current && (…)}` block, directly after the visible `<Image …/>` (line 121) add:

```tsx
{
  preloadIndexes.map((i) => (
    // Invisible (but laid-out) copies of the neighboring photos,
    // with identical props to the visible Image so the browser
    // requests the exact same optimized URL and warms the cache.
    <Image
      key={flat[i].src}
      src={imageUrl(flat[i].src)}
      alt=""
      aria-hidden
      fill
      loading="eager"
      sizes="(min-width: 1024px) 1024px, 100vw"
      className="invisible object-contain"
    />
  ));
}
```

(`invisible` = `visibility: hidden`, which keeps layout so the image still loads; `display: none` would let lazy-loading skip it. `loading="eager"` makes the intent explicit.)

- [ ] **Step 2: `/things-to-do` LCP candidate** — in `app/things-to-do/page.tsx`, the Outdoors `FramedImage` (line 53) gains `priority` (it sits above/near the fold on both desktop and mobile, mirroring the `/house` treatment):

```tsx
<FramedImage
  src="/images/things-to-do/aldebaran_outdoors.jpg"
  alt="Kayaking on the Wisconsin River near Aldebaran Farm"
  orientation="portrait"
  priority
  className="order-first mx-auto w-full max-w-xs sm:max-w-sm md:order-none md:mx-0 md:max-w-none"
  sizes="(min-width: 768px) 45vw, 85vw"
/>
```

- [ ] **Step 3: `shadcn` to devDependencies** — in `package.json`, move `"shadcn": "^4.13.0"` from `dependencies` to `devDependencies`, then `pnpm install` to sync the lockfile.

- [ ] **Step 4: Verify** — `pnpm test && pnpm typecheck && pnpm lint && pnpm knip && pnpm build`. Manual check (optional but preferred): `pnpm start`, open `/gallery`, open the lightbox with DevTools Network → arrow to the next photo → it should already be cached (no new full-size request at click time).

- [ ] **Step 5: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Preload lightbox neighbors so arrow navigation stops showing stale frames on slow connections

Each prev/next previously started its ~100-250KB fetch only on click, with no loading indicator. Also prioritizes the Things To Do LCP photo and moves the shadcn CLI to devDependencies.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 13: Build-time image-reference check

**Files:**

- Create: `scripts/check-images.mjs`
- Modify: `package.json` (script), `.husky/pre-commit`

- [ ] **Step 1: Write the script** — `scripts/check-images.mjs`:

```js
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
```

- [ ] **Step 2: Delete the orphaned gallery photos** (owner decision 2026-07-10; they remain recoverable from git history on GitHub):

```bash
rm public/images/gallery/exterior/tz-36.jpg public/images/gallery/exterior/tz-38.jpg public/images/gallery/exterior/tz-43.jpg public/images/gallery/exterior/tz-45.jpg public/images/gallery/exterior/tz-46.jpg
rm public/images/gallery/screened-porch/tz-35.jpg
rmdir public/images/gallery/screened-porch
```

- [ ] **Step 3: Wire it up** — `package.json` scripts: add `"check:images": "node scripts/check-images.mjs"`. `.husky/pre-commit` gains a final line: `pnpm check:images`.

- [ ] **Step 4: Verify** — `pnpm check:images` → exits 0, all references resolve, **0 orphans**. Sanity-check failure mode: temporarily change one `src` in `content/gallery.ts` to a bogus path, run again → exit 1 naming it → revert.

- [ ] **Step 5: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Add a pre-commit image-reference check and drop the six never-rendered photos

42 hand-maintained gallery srcs (plus property/brand images) had zero existence guarantee; a typo shipped a silently broken image. The orphaned exterior/screened-porch shots (owner decision) stay recoverable from git history.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 14: Documentation sweep

**Files:**

- Create: `components/reviews/README.md`
- Modify: `CLAUDE.md`, `README.md` (only if its claims drifted — verify), `components/README.md`, `content/README.md`, `lib/README.md`, `lib/analytics/README.md`, `components/shared/README.md`, `app/README.md`, `docs/architecture.md`, `docs/style-guide.md`, `components/layout/Header.tsx` (comment), `components/layout/MobileNav.tsx` (comment)

Every edit below corrects a claim verified false against the code, or documents something that exists but is undocumented. Don't rewrite accurate prose.

- [ ] **Step 1: Stale in-code comments**

- `components/layout/Header.tsx:23`: `{/* Desktop (xl+): full evenly-spaced nav */}` → `{/* Desktop (820px+): full evenly-spaced nav */}`
- `components/layout/MobileNav.tsx:20`: `Rendered by \`Header\` only below the \`xl\` breakpoint (see there).`→`Rendered by \`Header\` only below the 820px breakpoint (see there).`

- [ ] **Step 2: `CLAUDE.md`**

- Commands list: add `- \`pnpm knip\` — dead code/deps check`, `- \`pnpm test\` — Vitest unit tests for \`lib/\``, `- \`pnpm check:images\` — verify every referenced \`/images/…\` path exists under \`public/\``.
- Replace `There is no test suite.` with: `Tests are minimal and deliberate: Vitest covers the pure-logic lib modules (booking URL builders, imageUrl, property parsing/validation). Static JSX is not unit-tested; the pre-commit gate and build-time validation are the main quality net.`
- Pre-commit description (line 21): append `, \`pnpm test\`, then \`pnpm check:images\`` to the hook sequence, and change "CSS-only deps are ignore-listed there" to "CSS-only deps and the shadcn CLI are ignore-listed there".
- Line 29 (`lib/booking` bullet): replace `it's commission-free for the guest. The reservations page also presents … as equally-weighted alternatives.` with: `it's commission-free for the guest and gets the best rate, so the page leads with it; the property's Airbnb and Vrbo listings (\`ListingLink\` in \`components/property\`) are offered below the rates table as secondary paths at higher rates.`Also mention`buildInquiryTelUrl`.
- Line 28 (`lib/images` bullet): change `never hard-code \`/images/...\` in a component`to`every image src must flow through \`imageUrl()\` — directly or via \`FramedImage\`, which calls it internally`.
- Content list (line 35): add `reviews.ts` to the typed TS content files.
- Line 37: keep the rule but reflect the convention: `Pages are Server Components; components receive data as props and never import content values themselves (type-only imports from \`content/\` are fine — the data contracts are co-located with the data).`
- Line 50 (link language): change `nav/footer links underline on hover (shared \`navLinkClass\` in \`components/layout/Nav.tsx\`)`to`nav links underline on hover (shared \`navLinkClass\` in \`components/shared/links.ts\`; the footer uses its own smaller treatment)`.
- Architecture section: add one sentence: `\`lib/site.ts\` holds site-wide config (siteUrl, route manifest for the sitemap, bookNowHref).`

- [ ] **Step 3: `components/README.md`** — add `reviews/` to the group list (`reviews/ — the home page's guest-reviews section (Reviews, ReviewCard, StarRating)`); update the data rule with the same type-only wording as CLAUDE.md.

- [ ] **Step 4: Create `components/reviews/README.md`**

```markdown
# components/reviews

The home page's guest-reviews section.

- `Reviews` — the "Guest Reviews" section: heading + responsive card grid.
- `ReviewCard` — one review: star rating, quote, attribution ("author · date · via <platform>", where the platform links to the listing the review came from).
- `StarRating` — five brand-burgundy stars with fractional support, announced via `aria-label`.

Data flow: `app/page.tsx` imports the curated reviews from `content/reviews.ts`, derives the Airbnb/Vrbo attribution URLs from the `Property` (so listing URLs live only in `content/property.md`), and passes both down as props. Components here never import content values themselves.
```

- [ ] **Step 5: `content/README.md`** — add `reviews.ts` to the file list (`reviews.ts — hand-curated guest reviews + source labels; attribution URLs for Airbnb/Vrbo derive from the Property at the page level`); extend the `rates.ts` line to mention `reservationIntro` and `alsoListedIntro`.

- [ ] **Step 6: `lib/README.md`** — line 11: remove `(stubs present)`; the booking line should read `\`booking/\` — mailto/tel URL builders for email-to-book today; direct booking + Airbnb/VRBO calendar sync will live here when built.`Add a line for`site.ts`: `\`site.ts\` — site-wide config: siteUrl, sitemap route manifest, bookNowHref.`

- [ ] **Step 7: `lib/analytics/README.md`** — update the EVENTS description: event names live in `events.ts` (vendor-free so Server Components can import them); all `data-track` attributes reference `EVENTS.*` — never string literals.

- [ ] **Step 8: `components/shared/README.md`** — update `ExternalLink` line: used by things-to-do links, `ListingLink`, `ReviewCard`, and the footer maps link; sets `data-track="outbound_click"` by default; `target`/`rel` cannot be overridden by spread. Update the `FramedImage` frame-color wording from "sand-colored" to `the \`--color-brand-shadow\` token (#E8DED2)`. Add `links.ts` (`navLinkClass`/`proseLinkClass`).

- [ ] **Step 9: `app/README.md`** — home page line: `renders the hero and the guest-reviews section`; reservations line: mention the rates table and the Airbnb/Vrbo section; things-to-do line: remove any mention of the recommendations map (removed in Task 11).

- [ ] **Step 9b: Purge remaining recommendations-map references from docs** — `grep -rn "My Maps\|recommendations map\|maps/d/" CLAUDE.md README.md docs/ components/ content/ app/ --include="*.md"` (excluding `docs/superpowers/`) and update `content/README.md`'s `things-to-do.ts` line and any other hits so no doc describes the removed map.

- [ ] **Step 10: `docs/architecture.md`** — three surgical edits: (1) replace the "equally-weighted" description of the reservations page with the steering description (direct booking leads at the best rate; platform links below the rates table at higher rates); (2) update the grep test to `\`content/property.md\` is _imported/read_ only under \`lib/data\` (doc comments elsewhere may mention it by name)`; (3) add a short "Reviews" paragraph describing `content/reviews.ts` → home page → props flow.

- [ ] **Step 11: `docs/style-guide.md`** — (1) color table: image-frame row should name `--color-brand-shadow` `#E8DED2` (Sand `#E6DAC6` remains a brand color but is not the frame color); (2) line 52–54: nav links share `navLinkClass` (now in `components/shared/links.ts`); footer links use their own smaller treatment; prose links share `proseLinkClass`; (3) line 64: replace "no logo image needed" with a note that the footer renders `/images/brand/logo.png` beside the text wordmark; (4) document the `brand` Button variant (+ `brand-sm`/`brand-lg` sizes) as the canonical CTA.

- [ ] **Step 12: Root `README.md`** — read it; fix only claims made stale by this branch (commands, test suite). If accurate, leave it.

- [ ] **Step 13: Verify** — `pnpm format:check` (prettier covers md); re-run the doc grep tests: `grep -rn "equally-weighted" CLAUDE.md docs/ lib/ components/` → no stale claims remain; `grep -rn "xl breakpoint\|Desktop (xl" components/` → nothing.

- [ ] **Step 14: Commit**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add -A
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Sync all documentation with the code it describes

The reviews feature was absent from every doc, the booking docs described a page-parity that shipped as deliberate direct-booking steering, and several READMEs/comments claimed things (booking stubs, xl breakpoint, embed widget, no logo image) that no longer exist.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 15: Final verification + audit report

**Files:**

- Create: `docs/audits/2026-07-09-deep-clean.md`

- [ ] **Step 1: Full gate from scratch**

```bash
cd /Users/arpanet/dev/aldebaranfarm.us && pnpm typecheck && pnpm lint && pnpm knip && pnpm test && pnpm check:images && pnpm format:check && pnpm build
```

Expected: everything passes; build still emits the same 13 static routes.

- [ ] **Step 2: Behavioral spot-checks** (`pnpm start` in background, then curl):

- `curl -s http://localhost:3000/reservations | grep -o 'mailto:[^"]*' | head -1` → contains `%20`, no `+`.
- `curl -s http://localhost:3000 | grep -c "6557 County T"` → ≥1.
- `curl -sI http://localhost:3000 | grep -ci "x-content-type-options"` → 1.
- `curl -s http://localhost:3000/house | grep -o "<title>[^<]*</title>"` → `The House — Aldebaran Farm`.
- Stop the server.

- [ ] **Step 3: Write `docs/audits/2026-07-09-deep-clean.md`** using the deep-clean skill's report template: branch stats from `git -C /Users/arpanet/dev/aldebaranfarm.us diff master --stat | tail -1` and `git -C /Users/arpanet/dev/aldebaranfarm.us log master..HEAD --oneline | wc -l`; findings-by-category tables mapping each audit finding to its fix (use the Finding → Task map at the top of this plan); test impact (0 tests → the new lib test counts); new modules table (`lib/site.ts`, `lib/analytics/events.ts`, `components/shared/links.ts`, `components/property/ListingLink.tsx`, `scripts/check-images.mjs`, `vitest.config.ts`); and the **Not Addressed** section copied from this plan's "Deliberately NOT addressed" list (plus anything skipped during execution).

- [ ] **Step 4: Commit the report**

```bash
git -C /Users/arpanet/dev/aldebaranfarm.us add docs/audits
git -C /Users/arpanet/dev/aldebaranfarm.us commit -m "Add deep-clean audit report

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Hand back to the user** — do NOT merge or push without an explicit decision; present the branch summary and options (merge to master, push branch for review, or further changes).
