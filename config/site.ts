// ─────────────────────────────────────────────────────────────────────────────
// Folio settings. Most day-to-day edits happen in this one file.
// (Course names / practical flags live in config/courses.json, menu items in config/menu.ts.)
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: "Folio",
  department: "Department of Accounting",
  university: "University of Dhaka",
  program: "BBA",
};

/**
 * Batches in the dropdown, newest first. The first one is selected by default.
 * Add the next batch by putting its number in front, e.g. [33, 32].
 * Batch 33 reads tables named b33_s1, b33_s2, ...
 */
export const BATCHES: number[] = [32];

/** Semesters in the dropdown. */
export const SEMESTERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

/** Mid-term rounds per semester. */
export const MID_ROUNDS: number[] = [1, 2];

/** Selected by default when the page opens. */
export const DEFAULT_SEMESTER = 1;
export const DEFAULT_MID = 1;

/** Every mid-term mark is out of this number. */
export const MID_MAX = 15;

/** Final tables from this semester onwards have an extra `cgpa` column. Earlier semesters don't. */
export const CGPA_FROM_SEMESTER = 2;

/**
 * Maximum marks for the parts of a final exam.
 * A course with `"practical": true` in config/courses.json uses the `practical` row.
 * To override one course, add e.g. "max": { "midquiz": 30, "final": 70 } to it in courses.json.
 */
export const FINAL_MAX = {
  regular: { midquiz: 40, final: 60 },
  practical: { midquiz: 40, practical: 30, final: 30 },
};

/**
 * Notice panel shown above the heading. Set to null to hide it.
 *   { text: "Your message", date: "27 Oct 2026" }   (date is optional)
 */
export type NoticeConfig = { text: string; date?: string } | null;

export const NOTICES: { final: NoticeConfig; mid: NoticeConfig } = {
  final: { text: "The 1st semester final result of the 32nd batch has been published." },
  mid: null,
};
