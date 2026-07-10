import { Fragment } from "react";

import { ExternalLink } from "./ExternalLink";
import { proseLinkClass } from "./links";

/**
 * A run of rich text: either a plain string, or an external link. Lets editable
 * content (e.g. content/things-to-do.ts) embed inline links inside prose without
 * hand-writing JSX or a markdown parser.
 */
export type TextRun = string | { text: string; href: string };

/**
 * RichText — renders an array of runs inline. Links use the prose link style
 * (underlined at rest; see the style guide) and open in a new tab.
 */
export function RichText({ runs }: { runs: TextRun[] }) {
  return (
    <>
      {runs.map((run, i) =>
        typeof run === "string" ? (
          <Fragment key={i}>{run}</Fragment>
        ) : (
          <ExternalLink key={i} href={run.href} className={proseLinkClass}>
            {run.text}
          </ExternalLink>
        )
      )}
    </>
  );
}
