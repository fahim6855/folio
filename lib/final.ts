import { CGPA_FROM_SEMESTER } from "@/config/site";
import { coursesForSemester, type Course } from "./courses";
import { classify, type Failure } from "./failure";
import { col, finalTable, isRoll, num } from "./naming";
import { getSupabase } from "./supabase";

export type FinalQuery = { batch: number; semester: number; examRoll: string; classRoll: string };

export type FinalCourseResult = {
  course: Course;
  midquiz: number | null;
  practical: number | null;
  final: number | null;
  total: number | null;
  gradeLetter: string | null;
  gradePoint: number | null;
};

export type FinalResult = {
  examRoll: string;
  classRoll: string;
  sgpa: number | null;
  cgpa: number | null;
  complete: boolean;
  courses: FinalCourseResult[];
};

export type FinalOutcome = { kind: "found"; result: FinalResult } | Failure;

export async function fetchFinal(q: FinalQuery): Promise<FinalOutcome> {
  if (!isRoll(q.examRoll) || !isRoll(q.classRoll)) return { kind: "invalid" };

  const supabase = getSupabase();
  if (!supabase) return { kind: "error", notConfigured: true };

  const courses = coursesForSemester(q.semester);
  if (courses.length === 0) return { kind: "unpublished" };

  const table = finalTable(q.batch, q.semester);
  const hasCgpa = q.semester >= CGPA_FROM_SEMESTER;
  const columns = [
    "exam_roll",
    "class_roll",
    "sgpa",
    ...(hasCgpa ? ["cgpa"] : []),
    ...courses.flatMap((c) => [
      col.midquiz(c.code),
      ...(c.practical ? [col.practical(c.code)] : []),
      col.final(c.code),
      col.total(c.code),
      col.gradeLetter(c.code),
      col.gradePoint(c.code),
    ]),
  ];

  const { data, error } = await supabase
    .from(table)
    .select(columns.join(","))
    .eq("exam_roll", q.examRoll)
    .eq("class_roll", q.classRoll)
    .limit(1);

  if (error) return classify(error, table);

  const row = (data as unknown as Record<string, unknown>[] | null)?.[0];
  if (!row) return { kind: "missing" };

  const results: FinalCourseResult[] = courses.map((c) => ({
    course: c,
    midquiz: num(row[col.midquiz(c.code)]),
    practical: c.practical ? num(row[col.practical(c.code)]) : null,
    final: num(row[col.final(c.code)]),
    total: num(row[col.total(c.code)]),
    gradeLetter: (row[col.gradeLetter(c.code)] as string | null) || null,
    gradePoint: num(row[col.gradePoint(c.code)]),
  }));
  const sgpa = num(row.sgpa);

  return {
    kind: "found",
    result: {
      examRoll: q.examRoll,
      classRoll: q.classRoll,
      sgpa,
      cgpa: hasCgpa ? num(row.cgpa) : null,
      complete: sgpa !== null && results.every((r) => r.total !== null && r.gradeLetter !== null),
      courses: results,
    },
  };
}
