# components/shared/

Reusable, cross-cutting components that aren't tied to the property domain and
aren't structural layout chrome.

- **`ExternalLink.tsx`** — outbound anchor with safe `target`/`rel` defaults,
  used by the Things To Do activity links, `ListingLink`, and `ReviewCard`;
  sets `data-track="outbound_click"` by default. `target`/`rel` come after the
  prop spread, so callers can override `data-track` but not the tab-isolation
  attributes.
- **`FramedImage.tsx`** — image with the offset shadow block (the
  `--color-brand-shadow` token, `#E8DED2`) used throughout the site. Resolves
  its src through `imageUrl()`.
- **`JsonLd.tsx`** — serializes a `lib/seo` JSON-LD object into a
  `script type="application/ld+json"` tag, escaping `<` so content can't
  inject markup.
- **`QAItem.tsx`** — a question/answer pair (FAQs page); answers may embed
  inline links as `TextRun[]`.
- **`RichText.tsx`** — renders content strings that may contain inline links.
- **`ConsoleWordmark.tsx`** — logs the Lenehan–Hu wordmark to the console once
  per page load (easter egg; renders nothing).
- **`links.ts`** — shared link style classes: `navLinkClass` (nav links) and
  `proseLinkClass` (body-copy links).

Add small, generic building blocks here as they're needed.
