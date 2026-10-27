import raw from "@/config/courses.json";
import { FINAL_MAX } from "@/config/site";

export type Course = {
  code: string;
  name: string;
  semester: number;
  practical: boolean;
  max: { midquiz: number; practical: number | null; final: number; total: number };
};

type RawCourse = {
  semester: number;
  course_code: string;
  course_name: string;
  practical: boolean;
  max?: { midquiz?: number; practical?: number; final?: number };
};

function toCourse(c: RawCourse): Course {
  const base = c.practical ? FINAL_MAX.practical : FINAL_MAX.regular;
  const midquiz = c.max?.midquiz ?? base.midquiz;
  const final = c.max?.final ?? base.final;
  const practical = c.practical ? (c.max?.practical ?? FINAL_MAX.practical.practical) : null;
  return {
    code: c.course_code,
    name: c.course_name,
    semester: c.semester,
    practical: c.practical,
    max: { midquiz, practical, final, total: midquiz + (practical ?? 0) + final },
  };
}

const ALL: Course[] = (raw.courses as RawCourse[]).map(toCourse);

export const coursesForSemester = (semester: number): Course[] =>
  ALL.filter((c) => c.semester === semester);
