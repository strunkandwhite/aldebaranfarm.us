# components/analytics/

Analytics plumbing, mounted once in the root layout.

- **`TrackedClicks.tsx`** — a single document-level delegated click listener.
  Instrument any element by adding `data-track="<event name>"` (plus optional
  `data-track-*` attributes for event props) instead of converting the
  containing component to a client component.

See `lib/analytics/README.md` for the event-tracking layer this calls into.
