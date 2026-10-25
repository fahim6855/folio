// Data access for Folio.
// This is the ONLY file that talks to the database. To move from the local SQLite
// file to Turso later, only the `all()` helper below needs to change.
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

let handle: DatabaseSync | undefined;

function db(): DatabaseSync {
  handle ??= new DatabaseSync(path.join(process.cwd(), "data", "folio.db"), {
    readOnly: true,
  });
  return handle;
}

async function all<T>(sql: string, ...params: (string | number)[]): Promise<T[]> {
  return db().prepare(sql).all(...params) as unknown as T[];
}

/* ------------------------------ Types ------------------------------ */

export type ExamOption = { id: number; name: string };
export type BatchOption = { id: number; name: string; exams: ExamOption[] };

export type CourseResult = {
  code: string;
  name: string;
  mid: number | null;
  practical: number | null;
  final: number | null;
  total: number | null;
  grade: string | null;
  gradePoint: number | null;
  midMax: number;
  practicalMax: number | null;
  finalMax: number;
  totalMax: number;
};

export type StudentResult = {
  batchName: string;
  examName: string;
  department: string | null;
  university: string | null;
  examRoll: string;
  classRoll: string;
  sgpa: number | null;
  complete: boolean;
  courses: CourseResult[];
};

/* ----------------------------- Queries ----------------------------- */

/** Active batches with their active exams, for the form dropdowns. */
export async function getBatches(): Promise<BatchOption[]> {
  const batches = await all<{ id: number; name: string }>(
    `SELECT id, name FROM batches WHERE is_active = 1 ORDER BY sort_order, id`,
  );
  const exams = await all<{ id: number; batch_id: number; name: string }>(
    `SELECT id, batch_id, name FROM exams WHERE is_active = 1 ORDER BY sort_order, id`,
  );
  return batches.map((b) => ({
    id: b.id,
    name: b.name,
    exams: exams
      .filter((e) => e.batch_id === b.id)
      .map((e) => ({ id: e.id, name: e.name })),
  }));
}

type HeadRow = {
  record_id: number;
  exam_roll: string;
  class_roll: string;
  sgpa: number | null;
  status: string;
  batch_name: string;
  exam_name: string;
  department: string | null;
  university: string | null;
};

type CourseRow = {
  course_code: string;
  course_name: string;
  mid_max: number;
  practical_max: number | null;
  final_max: number;
  total_max: number;
  mid_quiz: number | null;
  practical: number | null;
  final_exam: number | null;
  total: number | null;
  letter_grade: string | null;
  grade_point: number | null;
};

/** Exactly one student, or null. All four values must match. */
export async function findResult(input: {
  batchId: number;
  examId: number;
  examRoll: string;
  classRoll: string;
}): Promise<StudentResult | null> {
  const [head] = await all<HeadRow>(
    `SELECT er.id AS record_id, er.exam_roll, s.class_roll, er.sgpa, er.status,
            b.name AS batch_name, b.department, b.university, e.name AS exam_name
       FROM exam_records er
       JOIN students s ON s.id = er.student_id
       JOIN exams e    ON e.id = er.exam_id AND e.batch_id = s.batch_id
       JOIN batches b  ON b.id = s.batch_id
      WHERE b.id = ? AND e.id = ? AND er.exam_roll = ? AND s.class_roll = ?
        AND b.is_active = 1 AND e.is_active = 1`,
    input.batchId,
    input.examId,
    input.examRoll,
    input.classRoll,
  );
  if (!head) return null;

  const rows = await all<CourseRow>(
    `SELECT r.course_code, c.course_name, c.mid_max, c.practical_max, c.final_max, c.total_max,
            r.mid_quiz, r.practical, r.final_exam, r.total, r.letter_grade, r.grade_point
       FROM results r
       JOIN courses c ON c.course_code = r.course_code
      WHERE r.exam_record_id = ?
      ORDER BY r.course_code`,
    head.record_id,
  );

  return {
    batchName: head.batch_name,
    examName: head.exam_name,
    department: head.department,
    university: head.university,
    examRoll: head.exam_roll,
    classRoll: head.class_roll,
    sgpa: head.sgpa,
    complete: head.status === "complete",
    courses: rows.map((r) => ({
      code: r.course_code,
      name: r.course_name,
      mid: r.mid_quiz,
      practical: r.practical,
      final: r.final_exam,
      total: r.total,
      grade: r.letter_grade,
      gradePoint: r.grade_point,
      midMax: r.mid_max,
      practicalMax: r.practical_max,
      finalMax: r.final_max,
      totalMax: r.total_max,
    })),
  };
}
