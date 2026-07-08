import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { imageUrl } from "@/lib/images";

import "./globals.css";

/**
 * Headings use Playfair Display (the brand display face), wired to the
 * `--font-heading` CSS variable consumed by the design tokens in `globals.css`.
 */
const fontHeading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Body uses self-hosted Helvetica Neue (the brand body face), feeding
 * `--font-sans`. The faces were extracted from HelveticaNeue.ttc and converted
 * to woff2 in `app/fonts`. A system-font fallback covers the swap window and any
 * environment where the files fail to load.
 *
 * NOTE: Helvetica Neue is a proprietary Monotype/Linotype typeface. Self-hosting
 * it for public web serving requires a web-embedding license — confirm coverage
 * before production. See `docs/style-guide.md`.
 */
const fontSans = localFont({
  variable: "--font-sans",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Arial",
    "sans-serif",
  ],
  src: [
    { path: "./fonts/HelveticaNeue-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/HelveticaNeue-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/HelveticaNeue-Bold.woff2", weight: "700", style: "normal" },
  ],
});

/**
 * Site URL used for absolute metadata (OG image, sitemap, robots). Set
 * NEXT_PUBLIC_SITE_URL to the production domain at deploy; the fallback is a
 * placeholder to update. Also exported for robots.ts / sitemap.ts.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aldebaranfarm.us";

const description =
  "A historic countryside retreat in Spring Green, Wisconsin's Driftless region, across the road from Frank Lloyd Wright's Taliesin. Book directly by email or phone.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aldebaran Farm — Spring Green, Wisconsin",
    template: "%s", // per-page titles already include "— Aldebaran Farm"
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Aldebaran Farm",
    title: "Aldebaran Farm — Spring Green, Wisconsin",
    description,
    url: siteUrl,
    images: [
      {
        url: imageUrl("/images/brand/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: "Aldebaran Farm — A Historic Retreat in Spring Green, Wisconsin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aldebaran Farm — Spring Green, Wisconsin",
    description,
    images: [imageUrl("/images/brand/og-image.jpg")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-none focus:bg-primary focus:px-4 focus:py-2 focus:font-heading focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
