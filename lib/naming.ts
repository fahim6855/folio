// Table / column naming rules, in ONE place. See docs/PROJECT-CONTEXT.md.
//   final table  b<batch>_s<semester>            e.g. b32_s1
//   mid table    b<batch>_s<semester>_m<round>   e.g. b32_s2_m1
// Column names are lowercase, <part>_<courseCode>.

/** 32 → "32nd", 33 → "33rd", 34 → "34th", 21 → "21st", 111 → "111th" */
export function ordinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export const finalTable = (batch: number, semester: number) => `b${batch}_s${semester}`;
export const midTable = (batch: number, semester: number, round: number) =>
  `b${batch}_s${semester}_m${round}`;

export const col = {
  midquiz: (code: string) => `midquiz_${code}`,
  practical: (code: string) => `practical_${code}`,
  final: (code: string) => `final_${code}`,
  total: (code: string) => `total_${code}`,
  gradeLetter: (code: string) => `gradeletter_${code}`,
  gradePoint: (code: string) => `gradepoint_${code}`,
  marks: (code: string) => `marks_${code}`,
};

/** Roll numbers: digits only, 3 to 10 of them. */
export const isRoll = (v: string) => /^\d{3,10}$/.test(v);

/** Number from a database value (numbers or numeric strings); null for empty/invalid. */
export function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
