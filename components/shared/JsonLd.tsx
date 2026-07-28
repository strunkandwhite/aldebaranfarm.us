import type { JsonLdObject } from "@/lib/seo";

/**
 * Renders a JSON-LD structured-data script tag. Every `<` is replaced with its
 * unicode escape so content strings can never close the script tag and inject
 * markup.
 */
export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
