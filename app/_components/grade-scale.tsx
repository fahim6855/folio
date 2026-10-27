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

export function GradeScale() {
  return (
    <table className="w-full text-sm tabular-nums">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wider text-folio-700">
          <th className="py-2 pr-3 font-bold">Marks</th>
          <th className="px-3 py-2 font-bold">Grade</th>
          <th className="py-2 pl-3 text-right font-bold">Point</th>
        </tr>
      </thead>
      <tbody>
        {SCALE.map(([range, letter, gp]) => (
          <tr key={letter} className="border-t border-folio-700/[0.08]">
            <td className="py-2 pr-3">{range}</td>
            <td className="px-3 py-2 font-semibold text-folio-900">{letter}</td>
            <td className="py-2 pl-3 text-right">{gp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
