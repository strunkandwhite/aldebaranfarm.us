import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF (smaller than WebP at equal visual quality for our photos),
    // falling back to WebP for browsers without AVIF support.
    formats: ["image/avif", "image/webp"],
    // Qualities used by next/image callers: 50 for the priority hero, 60 for
    // in-page photos (visually transparent in AVIF at our display sizes), 75
    // for the gallery lightbox.
    qualities: [50, 60, 75],
  },
  experimental: {
    // Inline the (small) global stylesheet into the HTML to remove the
    // render-blocking CSS request — measurable LCP win on throttled mobile.
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
