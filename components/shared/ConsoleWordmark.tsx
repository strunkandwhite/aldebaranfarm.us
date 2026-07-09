"use client";

import { useEffect } from "react";

/**
 * Console easter egg: logs the Lenehan–Hu Applied Dynamics wordmark once per
 * page load (the same mark the mindy-and-jack site logs). Rendered from the
 * root layout; renders nothing.
 */
const WORDMARK = `
    ◇───◇
   / \\ / \\    L E N E H A N — H U
  ◇   ◇   ◇    — A P P L I E D —
   \\ / \\ /      D Y N A M I C S
    ◇───◇
`;

let logged = false;

export function ConsoleWordmark() {
  useEffect(() => {
    if (logged) return;
    logged = true;
    console.log(WORDMARK);
  }, []);

  return null;
}
