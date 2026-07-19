import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrackedClicks } from "@/components/analytics/TrackedClicks";
import { ConsoleWordmark } from "@/components/shared/ConsoleWordmark";
import { getProperty } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { siteUrl } from "@/lib/site";

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
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"],
  src: [
    { path: "./fonts/HelveticaNeue-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/HelveticaNeue-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/HelveticaNeue-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty();
  const { city, region, regionCode } = property.location;
  // "in", not "—": link-preview scrapers that strip the site name from an
  // em-dash title were showing bare "Spring Green, Wisconsin" as the preview.
  const defaultTitle = `${property.name} in ${city}, ${regionCode}`;
  const description = `A historic countryside retreat in ${city}, ${region}'s Driftless region, across the road from Frank Lloyd Wright's Taliesin. Book directly by email or phone.`;
  const ogImage = {
    url: imageUrl("/images/brand/og-image.jpg"),
    width: 1200,
    height: 630,
    alt: `${property.name} — ${property.tagline}`,
  };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s — ${property.name}`,
    },
    description,
    // "./" resolves against the current route, giving every page a
    // self-referencing canonical URL without per-page boilerplate.
    alternates: {
      canonical: "./",
    },
    openGraph: {
      type: "website",
      siteName: property.name,
      title: defaultTitle,
      description,
      url: siteUrl,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [ogImage.url],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontHeading.variable} ${fontSans.variable} h-full antialiased`}>
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
        <Analytics />
        <SpeedInsights />
        <TrackedClicks />
        <ConsoleWordmark />
      </body>
    </html>
  );
}
