"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

/**
 * TrackedClicks — a single delegated click listener for analytics.
 *
 * Rather than converting every clickable server component to a client
 * component just to call `trackEvent`, instrument elements declaratively with
 * `data-track="<event name>"` (plus optional `data-track-*` attributes for
 * event props) and let this one listener do the work. Keeps server components
 * server.
 *
 * Mounted once in the root layout; renders nothing.
 */
export function TrackedClicks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const el = target?.closest("[data-track]");
      if (!el) return;

      const name = el.getAttribute("data-track");
      if (!name) return;

      const props: Record<string, string> = {};
      for (const attr of el.attributes) {
        if (attr.name.startsWith("data-track-")) {
          props[attr.name.slice("data-track-".length)] = attr.value;
        }
      }

      if (el instanceof HTMLAnchorElement && el.href) {
        props.url = el.href;
      }

      trackEvent(name, props);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
