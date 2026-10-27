-- Folio · step 1 · create tables
-- Run this once in Supabase → SQL Editor.
--
-- Naming:  b<batch>_s<semester>          final exam   (found by exam_roll + class_roll)
--          b<batch>_s<semester>_m<1|2>   mid exam     (found by class_roll)
-- Every column name is lowercase and starts with a letter, so no quotes are ever needed.
-- The policy lets the public key READ the table and nothing else (no insert/update/delete).

-- ===== Final exam: batch 32, semester 1 =====
create table b32_s1 (
  exam_roll text not null,
  class_roll text not null,
  midquiz_1101 numeric,
  final_1101 numeric,
  total_1101 numeric,
  gradeletter_1101 text,
  gradepoint_1101 numeric,
  midquiz_1102 numeric,
  final_1102 numeric,
  total_1102 numeric,
  gradeletter_1102 text,
  gradepoint_1102 numeric,
  midquiz_1103 numeric,
  practical_1103 numeric,
  final_1103 numeric,
  total_1103 numeric,
  gradeletter_1103 text,
  gradepoint_1103 numeric,
  midquiz_1104 numeric,
  final_1104 numeric,
  total_1104 numeric,
  gradeletter_1104 text,
  gradepoint_1104 numeric,
  midquiz_1105 numeric,
  final_1105 numeric,
  total_1105 numeric,
  gradeletter_1105 text,
  gradepoint_1105 numeric,
  sgpa numeric,
  primary key (exam_roll, class_roll)
);
alter table b32_s1 enable row level security;
create policy "public read" on b32_s1 for select to anon using (true);

-- ===== Mid exam 1: batch 32, semester 2 =====
-- Empty cells mean "not published yet" for that course.
create table b32_s2_m1 (
  class_roll text primary key,
  marks_1201 numeric,
  marks_1202 numeric,
  marks_1203 numeric,
  marks_1204 numeric,
  marks_1205 numeric
);
alter table b32_s2_m1 enable row level security;
create policy "public read" on b32_s2_m1 for select to anon using (true);
