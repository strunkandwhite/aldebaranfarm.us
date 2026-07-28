import { RichText, type TextRun } from "./RichText";

/**
 * QAItem — a single question/answer pair (used on the FAQs page). The question
 * is emphasized; the answer follows in body text and may contain inline links
 * (as `TextRun[]`). Both inherit the burgundy foreground color.
 */
export function QAItem({ q, a }: { q: string; a: string | TextRun[] }) {
  return (
    <div>
      <p className="font-bold">{q}</p>
      <p className="mt-1 leading-relaxed">
        <RichText runs={typeof a === "string" ? [a] : a} />
      </p>
    </div>
  );
}
