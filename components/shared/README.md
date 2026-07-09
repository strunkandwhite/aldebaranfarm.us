# components/shared/

Reusable, cross-cutting components that aren't tied to the property domain and
aren't structural layout chrome.

- **`ExternalLink.tsx`** — outbound anchor with safe `target`/`rel` defaults
  (used for activity and map links on Things To Do).
- **`FramedImage.tsx`** — image with the sand-colored offset shadow block used
  throughout the site. Resolves its src through `imageUrl()`.
- **`QAItem.tsx`** — a question/answer pair (FAQs page).
- **`RichText.tsx`** — renders content strings that may contain inline links.
- **`ConsoleWordmark.tsx`** — logs the Lenehan–Hu wordmark to the console once
  per page load (easter egg; renders nothing).

Add small, generic building blocks here as they're needed.
