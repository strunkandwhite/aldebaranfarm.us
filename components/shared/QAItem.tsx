/**
 * QAItem — a single question/answer pair (used on the FAQs page). The question
 * is emphasized; the answer follows in body text. Both inherit the burgundy
 * foreground color.
 */
export function QAItem({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="font-semibold">{q}</p>
      <p className="mt-1 leading-relaxed">{a}</p>
    </div>
  );
}
