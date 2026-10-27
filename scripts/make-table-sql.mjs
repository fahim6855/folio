#!/usr/bin/env node
// Prints the Supabase SQL for a new Folio table. Needs only Node (no packages).
//
//   node scripts/make-table-sql.mjs <batch> <semester> <final|mid1|mid2>
//
//   node scripts/make-table-sql.mjs 33 1 final     → table b33_s1
//   node scripts/make-table-sql.mjs 32 2 mid2      → table b32_s2_m2
//
// Copy the output into Supabase → SQL Editor and run it. Then import your CSV into the new table.
// Columns come from config/courses.json; semester >= CGPA_FROM_SEMESTER (config/site.ts) also gets `cgpa`.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [batchArg, semArg, kind] = process.argv.slice(2);
const batch = Number(batchArg);
const semester = Number(semArg);

const usage = "Usage: node scripts/make-table-sql.mjs <batch> <semester 1-8> <final|mid1|mid2>\nExample: node scripts/make-table-sql.mjs 33 1 final";
if (!Number.isInteger(batch) || batch < 1 || !Number.isInteger(semester) || semester < 1 || semester > 8 || !/^(final|mid[12])$/.test(kind ?? "")) {
  console.error(usage);
  process.exit(1);
}

const courses = JSON.parse(readFileSync(join(root, "config/courses.json"), "utf8")).courses.filter((c) => c.semester === semester);
if (courses.length === 0) {
  console.error(`No courses for semester ${semester} in config/courses.json`);
  process.exit(1);
}

// Keep the CGPA rule in sync with config/site.ts by reading it from there.
const site = readFileSync(join(root, "config/site.ts"), "utf8");
const cgpaFrom = Number(/CGPA_FROM_SEMESTER\s*=\s*(\d+)/.exec(site)?.[1] ?? 2);

let table, columns;
if (kind === "final") {
  table = `b${batch}_s${semester}`;
  columns = [["exam_roll", "text not null"], ["class_roll", "text not null"]];
  for (const c of courses) {
    const k = c.course_code;
    columns.push([`midquiz_${k}`, "numeric"]);
    if (c.practical) columns.push([`practical_${k}`, "numeric"]);
    columns.push([`final_${k}`, "numeric"], [`total_${k}`, "numeric"], [`gradeletter_${k}`, "text"], [`gradepoint_${k}`, "numeric"]);
  }
  columns.push(["sgpa", "numeric"]);
  if (semester >= cgpaFrom) columns.push(["cgpa", "numeric"]);
} else {
  table = `b${batch}_s${semester}_m${kind.slice(3)}`;
  columns = [["class_roll", "text not null unique"], ["exam_roll", "text"]];
  for (const c of courses) columns.push([`marks_${c.course_code}`, "numeric"]);
}

const lines = [
  "  id bigint generated always as identity primary key",
  ...columns.map(([n, t]) => `  ${n} ${t}`),
];
if (kind === "final") lines.push("  unique (exam_roll, class_roll)");

console.log(`-- Folio table ${table}  (${kind === "final" ? "final exam" : `mid-term ${kind.slice(3)}`}, batch ${batch}, semester ${semester})
-- CSV header for importing (same order, no id column):
-- ${columns.map(([n]) => n).join(",")}

create table ${table} (
${lines.join(",\n")}
);

-- Public key may READ this table and nothing else.
alter table ${table} enable row level security;
create policy "public read" on ${table} for select to anon using (true);`);
