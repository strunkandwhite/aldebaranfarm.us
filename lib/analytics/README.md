# lib/analytics/

Analytics vendor isolation layer.

- **`trackEvent(name, props?)`** — fires a custom event. The only caller of
  `@vercel/analytics`'s `track()`; swap Vercel for another provider here.
- **`EVENTS`** (`events.ts`) — canonical event name constants. Kept in its own
  vendor-free module so Server Components can import them without pulling
  `@vercel/analytics` into the server graph. Every `data-track` attribute
  references `EVENTS.*` — never a string literal.

Custom events require a Vercel Pro plan — on Hobby they're silently dropped
(page views and bounce rate still work). `trackEvent` never throws, so a
blocked script or vendor outage can't break the UI.

Clicks are instrumented via `data-track` attributes handled by
`components/analytics/TrackedClicks`, not by calling `trackEvent` directly from
most components — see that component's doc comment.
