import type { MetadataRoute } from "next";

import { siteUrl } from "./layout";

const routes = [
  "",
  "/house",
  "/gallery",
  "/things-to-do",
  "/faqs",
  "/reservations",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
  }));
}
