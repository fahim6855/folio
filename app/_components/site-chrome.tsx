import { FolioMark } from "./icons";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
      <div className="flex items-center gap-3">
        <FolioMark className="size-10 drop-shadow-[0_8px_10px_rgba(8,56,47,0.35)]" />
        <span className="font-display text-2xl font-semibold tracking-tight text-folio-900">Folio</span>
      </div>
      <p className="hidden text-sm font-medium text-folio-800/80 md:block">
        Department of Accounting <span className="mx-1.5 text-gold-500">◆</span> University of Dhaka
      </p>
    </header>
  );
}

const SCALE: [string, string, string][] = [
  ["80% and above", "A+", "4.00"],
  ["75% – 79%", "A", "3.75"],
  ["70% – 74%", "A-", "3.50"],
  ["65% – 69%", "B+", "3.25"],
  ["60% – 64%", "B", "3.00"],
  ["55% – 59%", "B-", "2.75"],
  ["50% – 54%", "C+", "2.50"],
  ["45% – 49%", "C", "2.25"],
  ["40% – 44%", "D", "2.00"],
  ["Less than 40%", "F", "0.00"],
];

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-7xl px-5 pb-12 sm:px-8">
      <details className="card-glass group mx-auto max-w-2xl">
        <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 font-semibold text-folio-900 [&::-webkit-details-marker]:hidden">
          Grade scale
          <span className="text-sm font-medium text-folio-700 group-open:hidden">Show</span>
          <span className="hidden text-sm font-medium text-folio-700 group-open:inline">Hide</span>
        </summary>
        <table className="w-full border-t border-folio-700/10 text-sm tabular-nums">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-folio-700">
              <th className="px-6 py-2.5 font-bold">Marks</th>
              <th className="px-3 py-2.5 font-bold">Grade</th>
              <th className="px-6 py-2.5 text-right font-bold">Grade point</th>
            </tr>
          </thead>
          <tbody>
            {SCALE.map(([range, letter, gp]) => (
              <tr key={letter} className="border-t border-folio-700/[0.07]">
                <td className="px-6 py-2">{range}</td>
                <td className="px-3 py-2 font-semibold text-folio-900">{letter}</td>
                <td className="px-6 py-2 text-right">{gp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <div className="flex justify-center w-full mt-6 mb-4">

         <button disabled={true} className=" mx-auto text-center bg-gold-300 cursor-pointer text-black/90 rounded-xl py-4 px-8 text-md">
         📄 Save Pdf <span className="text-[12px]">Coming Soon</span></button>
      </div>
      <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-folio-800/70">
        Folio is an unofficial, student-built results viewer. For anything official, the result
        published by the Department of Accounting, University of Dhaka is the final reference.
      </p>
    </footer>
  );
}
