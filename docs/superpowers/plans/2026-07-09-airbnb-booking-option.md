# Airbnb Booking Option Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Airbnb booking option — a custom-styled button and Airbnb's official embed widget, side by side — to the Rates & Reservations page as a third, equally-weighted alternative to the existing email/phone inquiry flow.

**Architecture:** One new `Property.airbnbUrl` field flows through the existing `lib/data.getProperty()` → `Property` → component-props pipeline (no new data-fetching path). Two new presentational components in `components/property/` consume it. Docs are updated to drop the now-inaccurate "never send guests off-site" principle.

**Tech Stack:** Next.js 16 App Router (Server Components), TypeScript, Tailwind v4, existing `Button` primitive (`@base-ui/react/button` wrapper), `lucide-react`, `next/script`, `gray-matter` (via `lib/data`), Vercel preview deployments for verification (no dev server, no test suite in this project).

## Global Constraints

- Package manager is **pnpm**. Run `pnpm typecheck` and `pnpm lint` after every code change; both must pass before committing.
- This project has **no test suite** — verification is `pnpm typecheck` + `pnpm lint` + `pnpm build`, plus manual checks on a Vercel preview deployment (no local dev server available in this environment).
- Never hardcode `/images/...`-style asset paths outside `lib/images` — not touched by this plan, noted for completeness.
- Every property-specific presentation component lives in `components/property/` and takes a typed `Property` as a prop — no component reads `content/` directly (grep test: `gray-matter` and `content/property.md` only appear under `lib/data`).
- Any new off-site link must use `target="_blank" rel="noopener noreferrer"` (add `nofollow` only where the original Airbnb snippet used it).
- Instrument clickable elements via `data-track="<event>"` (+ optional `data-track-*` props) rather than calling `trackEvent()` directly from a Server Component — the delegated listener in `components/analytics/TrackedClicks` handles it.
- Git: never combine `cd` and `git`; always use `git -C /Users/arpanet/code/aldebaranfarm.us <command>`. Branch names must not contain periods. This repo's actual main branch is `master` (there is no `main` branch, local or remote).
- Follow the design in `docs/superpowers/specs/2026-07-09-airbnb-booking-option-design.md` — this plan implements it task-by-task.

---

### Task 1: Add `airbnbUrl` to the property data layer

**Files:**

- Modify: `types/property.ts`
- Modify: `content/property.md`
- Modify: `lib/data/index.ts:47-60` (the `required` array in `assertValidFrontmatter`)

**Interfaces:**

- Produces: `Property.airbnbUrl: string` — consumed by Task 2 (`AirbnbLink`) and Task 3 (`AirbnbEmbed`).

- [ ] **Step 1: Sync `master` and create the feature branch**

```bash
git -C /Users/arpanet/code/aldebaranfarm.us checkout master
git -C /Users/arpanet/code/aldebaranfarm.us pull
git -C /Users/arpanet/code/aldebaranfarm.us checkout -b airbnb-booking-option
```

Expected: branch `airbnb-booking-option` created and checked out, containing the existing spec-doc commit (`Add design spec for Airbnb booking option test run`).

- [ ] **Step 2: Add the field to the `Property` type**

In `types/property.ts`, add `airbnbUrl` next to the existing contact fields (find the block containing `contactEmail`/`contactPhone` near the end of the interface):

```typescript
  /** Owner inbox for "email to book" inquiries (used to build a mailto link). */
  contactEmail: string;
  /** Owner phone for booking inquiries (used to build a tel link). */
  contactPhone: string;
  /**
   * The property's Airbnb listing URL, e.g. "https://www.airbnb.com/rooms/30441325".
   * Used to build both a direct link and the official Airbnb embed widget.
   */
  airbnbUrl: string;
}
```

- [ ] **Step 3: Add the field to the content file**

In `content/property.md`, `contactEmail` and `contactPhone` are the last two lines of the frontmatter, right before the closing `---` (currently lines 95-97):

```yaml
contactEmail: aldebaran.farm.rental@gmail.com
contactPhone: (312) 401-2484
---
```

Add `airbnbUrl` as a third line in that group, before the closing `---`:

```yaml
contactEmail: aldebaran.farm.rental@gmail.com
contactPhone: (312) 401-2484
airbnbUrl: https://www.airbnb.com/rooms/30441325
---
```

- [ ] **Step 4: Require the field in `lib/data/index.ts`**

In `lib/data/index.ts`, the `required` array inside `assertValidFrontmatter` currently ends with `"contactEmail", "contactPhone"`. Add `"airbnbUrl"`:

```typescript
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
  "airbnbUrl",
];
```

- [ ] **Step 5: Verify**

```bash
pnpm typecheck
pnpm lint
```

Expected: both pass with no errors. (If `pnpm typecheck` fails complaining `content/property.md` is missing `airbnbUrl`, Step 3 wasn't applied correctly — re-check the frontmatter.)

- [ ] **Step 6: Commit**

```bash
git -C /Users/arpanet/code/aldebaranfarm.us add types/property.ts content/property.md lib/data/index.ts
git -C /Users/arpanet/code/aldebaranfarm.us commit -m "$(cat <<'EOF'
Add airbnbUrl to the property data contract

Follow-up work will use this to build both a direct Airbnb link and
Airbnb's official embed widget on the reservations page.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Build the custom `AirbnbLink` button

**Files:**

- Create: `components/property/AirbnbLink.tsx`

**Interfaces:**

- Consumes: `Property.airbnbUrl: string` (Task 1); `Button` from `@/components/ui/button` (existing).
- Produces: `AirbnbLink({ property }: { property: Property }): JSX.Element` — consumed by Task 4.

- [ ] **Step 1: Write the component**

```tsx
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/shared/ExternalLink";
import type { Property } from "@/types/property";

/**
 * AirbnbLink — a button that opens the property's Airbnb listing in a new
 * tab. One of two off-site booking options trialed on the reservations page
 * alongside the primary email/phone inquiry flow. See
 * docs/superpowers/specs/2026-07-09-airbnb-booking-option-design.md.
 */
export function AirbnbLink({ property }: { property: Property }) {
  return (
    <Button
      variant="outline"
      nativeButton={false}
      render={<ExternalLink href={property.airbnbUrl} data-track-destination="airbnb" />}
    >
      Book on Airbnb
      <ExternalLinkIcon data-icon="inline-end" />
    </Button>
  );
}
```

**Revision note (post Task-2-review):** the task reviewer found that
`components/shared/ExternalLink.tsx` already exists in this codebase — a
reusable anchor with `target="_blank" rel="noopener noreferrer"
data-track="outbound_click"` defaults, explicitly documented as usable as a
`Button`'s `render` target. The plan originally hand-rolled those same
attributes on a raw `<a>`, duplicating that shared component. The code block
above reuses it instead, aliasing the icon import (`ExternalLinkIcon`) to
avoid a name collision with the shared component's own `ExternalLink` name.
This is exactly what was implemented and approved on review.

- [ ] **Step 2: Verify**

```bash
pnpm typecheck
pnpm lint
```

Expected: both pass. The component isn't imported anywhere yet, so `knip` (run separately by the pre-commit hook, not by these commands) would flag it as unused dead code — that's expected and resolved in Task 4, so don't commit yet if you run knip manually; the pre-commit hook in Step 3 covers it once Task 4 wires it in. For this task, `pnpm typecheck`/`pnpm lint` passing is sufficient.

- [ ] **Step 3: Commit**

```bash
git -C /Users/arpanet/code/aldebaranfarm.us add components/property/AirbnbLink.tsx
git -C /Users/arpanet/code/aldebaranfarm.us commit -m "$(cat <<'EOF'
Add AirbnbLink button component

A custom-styled outline button that opens the property's Airbnb
listing in a new tab, tracked via the existing outbound_click event.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

Note: this commit will only succeed if the husky pre-commit hook's `knip` step doesn't hard-fail on the not-yet-imported component. If it does fail, skip this standalone commit and instead fold `AirbnbLink.tsx` into Task 4's commit (where it becomes used). Try the commit as written first.

---

### Task 3: Build the official `AirbnbEmbed` widget

**Files:**

- Create: `components/property/AirbnbEmbed.tsx`

**Interfaces:**

- Consumes: `Property.airbnbUrl: string` (Task 1).
- Produces: `AirbnbEmbed({ property }: { property: Property }): JSX.Element | null` — consumed by Task 4.

- [ ] **Step 1: Write the component**

```tsx
import Script from "next/script";

import { ExternalLink } from "@/components/shared/ExternalLink";
import type { Property } from "@/types/property";

const LISTING_ID_PATTERN = /\/rooms\/(\d+)/;

/**
 * AirbnbEmbed — Airbnb's official embeddable listing widget, generated from
 * the host dashboard (Listings -> listing editor -> View -> Share -> Embed ->
 * Copy HTML). The airbnb_jssdk script hydrates the .airbnb-embed-frame div
 * client-side into a live preview card; the two links below are the no-JS /
 * script-blocked fallback (ad blockers commonly block this script), rendered
 * via the shared `ExternalLink` component (safe target/rel + tracking
 * defaults) rather than Airbnb's original raw anchors.
 *
 * The fallback description line is built from typed Property fields rather
 * than Airbnb's snapshotted "★4.82" text, which would go stale in source.
 */
export function AirbnbEmbed({ property }: { property: Property }) {
  const match = property.airbnbUrl.match(LISTING_ID_PATTERN);
  if (!match) return null;

  const listingId = match[1];
  const fallbackHref = `https://www.airbnb.com/rooms/${listingId}`;
  const fallbackDescription = [
    property.location.city,
    `${property.bedrooms} bedroom${property.bedrooms === 1 ? "" : "s"}`,
    `${property.bathrooms} bathroom${property.bathrooms === 1 ? "" : "s"}`,
  ].join(" · ");

  return (
    <div
      className="airbnb-embed-frame"
      data-id={listingId}
      data-view="home"
      data-hide-price="true"
      style={{ width: 450, height: 300, margin: "auto" }}
    >
      <ExternalLink href={fallbackHref} data-track-destination="airbnb">
        View On Airbnb
      </ExternalLink>
      <ExternalLink
        href={fallbackHref}
        rel="nofollow noopener noreferrer"
        data-track-destination="airbnb"
      >
        {fallbackDescription}
      </ExternalLink>
      <Script
        id="airbnb-jssdk"
        src="https://www.airbnb.com/embeddable/airbnb_jssdk"
        strategy="lazyOnload"
      />
    </div>
  );
}
```

**Revision note (post Task-2-review):** same reuse fix as Task 2 — both
fallback links now render through the pre-existing
`components/shared/ExternalLink.tsx` instead of hand-rolled `<a>` tags. The
second link overrides `rel` to add back Airbnb's original `nofollow` (the
shared component's `{...props}` spread applies after its own defaults, so
passing `rel` here correctly overrides it); both links get
`data-track-destination="airbnb"` for consistency with `AirbnbLink`.

- [ ] **Step 2: Verify**

```bash
pnpm typecheck
pnpm lint
```

Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git -C /Users/arpanet/code/aldebaranfarm.us add components/property/AirbnbEmbed.tsx
git -C /Users/arpanet/code/aldebaranfarm.us commit -m "$(cat <<'EOF'
Add AirbnbEmbed official widget component

Reproduces Airbnb's host-dashboard embed snippet as JSX, deriving the
listing ID from property.airbnbUrl instead of hardcoding it a second
time, and adding target=_blank/rel=noopener to the fallback links.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

Same knip caveat as Task 2 applies — if the pre-commit hook fails because the component isn't imported yet, fold it into Task 4's commit instead.

---

### Task 4: Wire both components into the Rates & Reservations page

**Files:**

- Modify: `app/reservations/page.tsx`

**Interfaces:**

- Consumes: `AirbnbLink` (Task 2), `AirbnbEmbed` (Task 3).

- [ ] **Step 1: Add the imports**

In `app/reservations/page.tsx`, add these two imports alongside the existing `RateTable` import:

```tsx
import { RateTable } from "@/components/property/RateTable";
import { AirbnbLink } from "@/components/property/AirbnbLink";
import { AirbnbEmbed } from "@/components/property/AirbnbEmbed";
```

- [ ] **Step 2: Add the third booking option after the Phone row**

Find this block (the Email/Phone paragraphs, currently followed by the FAQs paragraph):

```tsx
        <p className="mt-2">
          <span className="font-bold">Phone:</span>{" "}
          <a
            href={telHref}
            data-track="inquiry_phone_click"
            className="underline underline-offset-4 hover:opacity-70"
          >
            {property.contactPhone}
          </a>
        </p>

        <p className="mt-6">
          Please read through our{" "}
```

Insert the new block between the Phone paragraph and the FAQs paragraph:

```tsx
        <p className="mt-2">
          <span className="font-bold">Phone:</span>{" "}
          <a
            href={telHref}
            data-track="inquiry_phone_click"
            className="underline underline-offset-4 hover:opacity-70"
          >
            {property.contactPhone}
          </a>
        </p>

        <p className="mt-6 font-bold">Or book directly on Airbnb:</p>
        <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <AirbnbLink property={property} />
          <AirbnbEmbed property={property} />
        </div>

        <p className="mt-6">
          Please read through our{" "}
```

- [ ] **Step 3: Verify**

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Expected: all three pass. `pnpm build` in particular confirms the Server Component (`page.tsx`) can render `AirbnbEmbed`'s `next/script` usage without error.

- [ ] **Step 4: Commit**

```bash
git -C /Users/arpanet/code/aldebaranfarm.us add app/reservations/page.tsx components/property/AirbnbLink.tsx components/property/AirbnbEmbed.tsx
git -C /Users/arpanet/code/aldebaranfarm.us commit -m "$(cat <<'EOF'
Add Airbnb booking option to the reservations page

Presents the custom Airbnb button and official embed widget as a
third, equally-weighted alternative to the existing email/phone
inquiry flow, per the approved test-run design.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

(This `git add` includes the two component files in case Task 2/3's standalone commits were skipped due to the knip caveat — `git add` on an already-committed file is a harmless no-op.)

---

### Task 5: Update the documentation

**Files:**

- Modify: `docs/architecture.md`
- Modify: `lib/booking/README.md`
- Modify: `lib/booking/index.ts` (header comment only)
- Modify: `CLAUDE.md`

**Interfaces:** none (docs only).

- [ ] **Step 1: Update `docs/architecture.md`**

Replace this bullet in the "Booking + calendar sync (the future)" section:

```markdown
- `lib/booking.buildInquiryMailtoUrl(property)` builds a `mailto:` link to the
  owner, used by the reservations page. That's the "make a booking"
  implementation.
- We never send guests off-site to book. The property's separate **Airbnb** and
  **VRBO** listings exist, but on this site they matter only as calendars to
  keep in sync.
```

with:

```markdown
- `lib/booking.buildInquiryMailtoUrl(property)` builds a `mailto:` link to the
  owner, used by the reservations page. This remains the primary,
  commission-free "make a booking" path.
- The reservations page also offers a secondary, off-site path directly to the
  property's **Airbnb** listing (`property.airbnbUrl`) — a custom link plus
  Airbnb's official embed widget, both opening in a new tab. This is a
  deliberate exception to keeping guests on-site, trialed starting
  2026-07-09 (see
  `docs/superpowers/specs/2026-07-09-airbnb-booking-option-design.md`). The
  **VRBO** listing exists but isn't linked from the site; both platform
  listings still matter as calendars to keep in sync.
```

- [ ] **Step 2: Update `lib/booking/README.md`**

Replace:

```markdown
We never send guests off-site to book. The property's Airbnb/VRBO listings
matter here only as calendars to sync against (below) so we don't double-book.
```

with:

```markdown
Guests can also book off-site directly through the property's Airbnb listing
(`AirbnbLink`/`AirbnbEmbed` in `components/property`) — `buildInquiryMailtoUrl`
above remains the primary, commission-free path. See
`docs/superpowers/specs/2026-07-09-airbnb-booking-option-design.md`. The
Airbnb/VRBO listings also matter here as calendars to sync against (below) so
we don't double-book.
```

- [ ] **Step 3: Update the header comment in `lib/booking/index.ts`**

Replace:

```typescript
 * FUTURE: direct booking + Airbnb/VRBO calendar sync is a future concern that
 * will live in this module when built. The intended surface is described in
 * `docs/architecture.md` — we never send guests off-site to book; platform
 * listings matter only as calendars to sync against.
```

with:

```typescript
 * ALSO LIVE: the reservations page offers a secondary, off-site path directly
 * to the property's Airbnb listing (see `AirbnbLink`/`AirbnbEmbed` in
 * `components/property`), alongside the mailto flow above.
 *
 * FUTURE: direct booking + Airbnb/VRBO calendar sync is a future concern that
 * will live in this module when built. The intended surface is described in
 * `docs/architecture.md`; platform listings matter here as calendars to sync
 * against.
```

- [ ] **Step 4: Update the project `CLAUDE.md` bullet**

Replace this bullet under "Architecture":

```markdown
- `lib/booking` — `buildInquiryMailtoUrl()` is the live "make a booking" implementation, used by the reservations page. Future direct booking + Airbnb/VRBO calendar sync will live in this module when built (surface described in `docs/architecture.md`); we never send guests off-site to book.
```

with:

```markdown
- `lib/booking` — `buildInquiryMailtoUrl()` is the live "make a booking" implementation, used by the reservations page; it remains the primary, commission-free path. The reservations page also offers a secondary, off-site path directly to the property's Airbnb listing (`AirbnbLink` + `AirbnbEmbed` in `components/property`). Future direct booking + Airbnb/VRBO calendar sync will live in this module when built (surface described in `docs/architecture.md`).
```

- [ ] **Step 5: Verify**

```bash
pnpm format:check
```

Expected: pass (Prettier also covers Markdown per the repo's lint-staged config).

- [ ] **Step 6: Commit**

```bash
git -C /Users/arpanet/code/aldebaranfarm.us add docs/architecture.md lib/booking/README.md lib/booking/index.ts CLAUDE.md
git -C /Users/arpanet/code/aldebaranfarm.us commit -m "$(cat <<'EOF'
Update docs to reflect the Airbnb off-site booking option

Drops the now-inaccurate "we never send guests off-site to book"
principle from docs/architecture.md, lib/booking, and CLAUDE.md.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Push, open a PR, and verify on a Vercel preview deployment

**Files:** none (deployment/verification only).

**Interfaces:** none.

- [ ] **Step 1: Push the branch and open a PR**

```bash
git -C /Users/arpanet/code/aldebaranfarm.us push -u origin airbnb-booking-option
gh pr create --title "Add Airbnb booking option to reservations page" --body "$(cat <<'EOF'
## Summary
- Test run: adds a secondary, off-site Airbnb booking path (custom button + official embed widget) alongside the existing email/phone inquiry flow on Rates & Reservations.
- Updates docs to reflect that guests can now be sent off-site, replacing the prior "never send guests off-site" principle.

## Test plan
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm build` all pass (CI)
- [ ] On the preview deployment: both the "Book on Airbnb" button and the Airbnb embed widget render on /reservations
- [ ] Both open airbnb.com/rooms/30441325 in a new tab
- [ ] No console errors from the airbnb_jssdk script

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR created; note the PR number/URL from the output.

- [ ] **Step 2: Poll for the Vercel preview deployment**

```bash
sleep 15
gh api repos/strunkandwhite/aldebaranfarm.us/deployments?per_page=5 \
  --jq '.[] | select(.environment == "Preview") | {id, ref, created_at}'
```

Expected: a deployment entry with `ref` matching `airbnb-booking-option`. If none yet, wait another 15s and re-run.

- [ ] **Step 3: Get the preview URL and confirm it's ready**

```bash
gh pr view <pr-number> --json comments --jq '.comments[] | select(.author.login == "vercel") | .body'
```

Expected: the Vercel bot comment containing the branch preview URL (pattern `aldebaranfarm-us-git-airbnb-booking-option-<scope>.vercel.app`) and a `status: success` (or similar) indicator once the build finishes. Poll every ~15s if still building.

- [ ] **Step 4: Verify the page content with curl**

```bash
curl -s "<preview-url>/reservations?x-vercel-protection-bypass=$VERCEL_PROTECTION_BYPASS" | grep -o "Book on Airbnb"
```

Expected: `Book on Airbnb` printed (confirms the button rendered server-side).

- [ ] **Step 5: Visual + interaction check with Chrome DevTools MCP**

```
mcp__chrome-devtools__navigate_page  url=<preview-url>/reservations?x-vercel-protection-bypass=$VERCEL_PROTECTION_BYPASS
mcp__chrome-devtools__take_screenshot  fullPage=true
mcp__chrome-devtools__list_console_messages
```

Expected: screenshot shows the "Book on Airbnb" button and the Airbnb embed card (photo/rating card, once `airbnb_jssdk` hydrates it) sitting below the Phone row; `list_console_messages` shows no errors related to the Airbnb script or CSP.

- [ ] **Step 6: Click-through check**

```
mcp__chrome-devtools__click  <selector for the "Book on Airbnb" button>
mcp__chrome-devtools__list_pages
```

Expected: a new page/tab appears in `list_pages` with a URL under `airbnb.com/rooms/30441325`, confirming `target="_blank"` works and the original `/reservations` tab is still open.

- [ ] **Step 7: Report back**

Summarize to the user: screenshot description, confirmation both elements render and link out correctly, any console warnings observed, and the PR URL — then stop and let the user decide whether to merge, keep iterating, or drop one of the two options per the "test run" framing.

---

## Self-Review Notes

- **Spec coverage:** data layer (Task 1), custom button (Task 2), official widget (Task 3), page wiring (Task 4), docs (Task 5), preview verification (Task 6) — all four spec sections plus the spec's "Testing" section are covered.
- **No test suite:** per `CLAUDE.md` ("There is no test suite"), verification steps use `pnpm typecheck`/`lint`/`build` plus manual preview checks instead of unit tests, overriding the writing-plans skill's default TDD step shape.
- **Type consistency:** `Property.airbnbUrl: string` (Task 1) is the single name used in `AirbnbLink` (Task 2), `AirbnbEmbed` (Task 3), and nowhere else — checked for drift.
- **Knip caveat:** Tasks 2 and 3 create components not yet imported anywhere; flagged the pre-commit `knip` risk explicitly with a fallback (fold into Task 4's commit) rather than leaving it as a silent assumption.
