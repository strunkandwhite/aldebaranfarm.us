import { redirect } from "next/navigation";

/**
 * Global 404 boundary. Rather than showing a dead-end "not found" page, send
 * visitors back to the homepage — a single-property marketing site has no
 * useful destination to offer for an unknown URL.
 */
export default function NotFound() {
  redirect("/");
}
