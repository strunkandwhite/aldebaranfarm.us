import { cn } from "@/lib/utils";
import type { RateRow } from "@/content/rates";

/**
 * RateTable — the Peak / Off-Peak pricing table on the reservations page.
 * Semantic <table> for accessibility; wrapped in an overflow guard so it never
 * forces horizontal page scroll on small screens.
 */
export function RateTable({
  rows,
  className,
}: {
  rows: RateRow[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-primary/50">
            <th scope="col" className="py-2 pr-4 font-bold">
              <span className="sr-only">Rate type</span>
            </th>
            <th scope="col" className="py-2 pl-4 text-right font-bold">
              Peak
            </th>
            <th scope="col" className="py-2 pl-4 text-right font-bold">
              Off-Peak
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-primary/50 align-top">
              <td className="py-3 pr-4">
                <span className="font-medium">{row.label}</span> — {row.detail}
              </td>
              <td className="py-3 pl-4 text-right whitespace-nowrap">
                {row.peak}
              </td>
              <td className="py-3 pl-4 text-right whitespace-nowrap">
                {row.offPeak}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
