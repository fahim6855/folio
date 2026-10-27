import { coursesForSemester, type Course } from "./courses";
import { classify, type Failure } from "./failure";
import { col, isRoll, midTable, num } from "./naming";
import { getSupabase } from "./supabase";

export type MidQuery = { batch: number; semester: number; round: number; classRoll: string };

export type MidResult = {
  classRoll: string;
  marks: { course: Course; mark: number | null }[];
};

export type MidOutcome = { kind: "found"; result: MidResult } | Failure;

export async function fetchMid(q: MidQuery): Promise<MidOutcome> {
  if (!isRoll(q.classRoll)) return { kind: "invalid" };

  const supabase = getSupabase();
  if (!supabase) return { kind: "error", notConfigured: true };

  const courses = coursesForSemester(q.semester);
  if (courses.length === 0) return { kind: "unpublished" };

  const table = midTable(q.batch, q.semester, q.round);
  const columns = ["class_roll", ...courses.map((c) => col.marks(c.code))];

  const { data, error } = await supabase
    .from(table)
    .select(columns.join(","))
    .eq("class_roll", q.classRoll)
    .limit(1);

  if (error) return classify(error, table);

  const row = (data as unknown as Record<string, unknown>[] | null)?.[0];
  if (!row) return { kind: "missing" };

  return {
    kind: "found",
    result: {
      classRoll: q.classRoll,
      marks: courses.map((c) => ({ course: c, mark: num(row[col.marks(c.code)]) })),
    },
  };
}
