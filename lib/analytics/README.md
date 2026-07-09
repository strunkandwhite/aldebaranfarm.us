# lib/analytics/

Analytics vendor isolation layer.

- **`trackEvent(name, props?)`** — fires a custom event. The only caller of
  `@vercel/analytics`'s `track()`; swap Vercel for another provider here.
- **`EVENTS`** — canonical event name constants, referenced instead of typing
  string literals around the app.

Custom events require a Vercel Pro plan — on Hobby they're silently dropped
(page views and bounce rate still work). `trackEvent` never throws, so a
blocked script or vendor outage can't break the UI.

Clicks are instrumented via `data-track` attributes handled by
`components/analytics/TrackedClicks`, not by calling `trackEvent` directly from
most components — see that component's doc comment.
