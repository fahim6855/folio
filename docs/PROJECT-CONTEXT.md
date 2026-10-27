# Folio: project context for an AI assistant

Paste or attach this file at the start of a new conversation. It summarises what was built, why, and how the owner likes to work.
It contains no secrets. (Keys live in `.env.local` / Vercel and are never shared in chat.)

## What it is
**Folio** is a small, student-built results viewer for the **BBA program, Department of Accounting, University of Dhaka**.
Students look up their own result by roll number. Two pages:
- **Final** (`/` and `/home`, same page): semester final result. Inputs: Batch, Semester, Exam Roll, Class Roll.
- **Mid-term** (`/mid`): per-course mid-term marks. Inputs: Batch, Semester, Mid-term (1 or 2), Class Roll.
Used by ~150 classmates of the 32nd batch (more batches to come: 33rd, 34th…). The data was originally a text PDF.

## Owner preferences (important)
- Non-technical about databases: wants decisions made for them ("do as it suits, make sure it doesn't error"). Doesn't want data-type lectures.
- **Asks to be consulted before big coding** when they say so ("don't code now, ask me first"). Present a plan, get a yes, then build.
- When they ask for "plain code", give code in the chat, **not** a zip, and say which file it replaces.
- Design: modern, glossy "Ledger Green" look (emerald `#0F5C4D`, cream `#FAF7F0`, gold `#C9A227`), **no animation**, mobile-first, "looks like a pro designer made it". Name: **Folio**.
- No course icons (there are 40 courses). Navigation menu is **always closed** (☰ opens a slide-over, even on desktop).
- Department name to display: **"Department of Accounting"** (the JSON says "Accounting & Information Systems"; the owner chose the former).
- Privacy: the full results PDF is already shared among students, so per-student lookup is *more* private than before; no login required.
- The owner pastes error text; reply with the likely cause and exact fix.

## Tech stack
Next.js 16 (App Router, `cacheComponents` + partial prefetching enabled), React 19, TypeScript, **Tailwind CSS 4** (tokens in `app/globals.css`),
`@supabase/supabase-js` (the only extra runtime package). No animation libraries, no icon libraries (inline SVG). System fonts only.
Hosting: Vercel. Database: **one Supabase project, many tables**. Data is fetched **in the browser** with the public (publishable/anon) key.
Next 16 note: components using `useSearchParams` must sit inside `<Suspense>`; bundled docs are in `node_modules/next/dist/docs/`.

## Data model (Supabase / Postgres)
Tables are named from the dropdown values; columns are lowercase, `<part>_<courseCode>`.
- Final: `b<batch>_s<semester>`, e.g. `b32_s1`. One row per student; found by `exam_roll` + `class_roll` (text).
  Columns per course: `midquiz_X`, (`practical_X` only if the course has one, in PDF order mid → practical → final), `final_X`, `total_X`, `gradeletter_X`, `gradepoint_X`; then `sgpa`; **`cgpa` only from semester 2** (already calculated, stored as printed).
- Mid: `b<batch>_s<semester>_m<1|2>`, e.g. `b32_s2_m1`. One row per student; found by `class_roll`; columns `marks_X` per course. Empty cell = not published yet.
- All numbers are plain `numeric` (any decimals), roll numbers are `text`. Tables may also have an `id` column (and mid tables an unused `exam_roll`); the app always selects columns by name.
- **Row Level Security is on for every table with a `for select to anon using (true)` policy.** Never leave RLS off: the public key could then write.
- Marks rule: Mid & Quiz 40 + Final 60 = 100; courses with a practical: 40 + 30 + 30. Mid-term marks are out of 15 (`MID_MAX`).
- Grade scale (SGPA = plain average of the five grade points): 80+ A+ 4.00; 75 A 3.75; 70 A- 3.50; 65 B+ 3.25; 60 B 3.00; 55 B- 2.75; 50 C+ 2.50; 45 C 2.25; 40 D 2.00; <40 F 0.00.
- Current live data: `b32_s1` (all 154 students of the 32nd batch, semester 1 final, imported from the PDF) and `b32_s2_m1` (migrated from five older per-course tables `32nd_2nd_mid1_1201…1205`).

## Code map
```
config/site.ts      batches, semesters, mid rounds, MID_MAX, FINAL_MAX, CGPA_FROM_SEMESTER, NOTICES, SITE names
config/courses.json 40 courses (semester, course_code, course_name, practical[, max])
config/menu.ts      entries of the ☰ menu
lib/naming.ts       ordinal(), finalTable(), midTable(), column-name helpers, isRoll(), num()
lib/courses.ts      reads courses.json → per-semester courses with max marks
lib/final.ts        fetchFinal(): builds the select list, queries Supabase, returns found | failure
lib/mid.ts          fetchMid()
lib/failure.ts      maps Supabase/PostgREST errors (PGRST205/42P01 = table missing, 42703 = column missing) to friendly states
lib/supabase.ts     browser client; accepts NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or _ANON_KEY
app/page.tsx, app/home/page.tsx   both render <FinalPage/>;  app/mid/page.tsx
app/_components/    final-page, final-lookup (client form + fetch), final-view (rings, cards), mid-lookup, mid-view,
                    message (all error/empty states), notice, menu-drawer (<dialog>), nav-links (tabs), site-chrome, grade-scale, icons
scripts/make-table-sql.mjs   prints CREATE TABLE + RLS policy SQL for any batch/semester/final|mid1|mid2
legacy/             old SQLite version (folio.db), build_db.py (parses the 32nd-batch semester-1 PDF), first Supabase SQL/CSV
docs/               HOW-TO-EDIT.md (for the owner), this file
```
Behaviour notes: the lookup forms keep their values in the URL (`?batch=&sem=&exam_roll=&class_roll=` / `&mid=`) so results are shareable and reload on open;
`/home` is a duplicate route of `/` (not a redirect). A semester-1 final table has no `cgpa` column, so the app only selects `cgpa` for semester ≥ 2.
The page shows distinct messages for: not published (no table), no matching row, incomplete student (blank totals), missing column (names it), bad roll input, not configured, other errors.

## How it was tested (reproducible)
No access to the real Supabase from the build sandbox, so: real Postgres (pip `pgserver`) + real PostgREST binary (GitHub release) behind a tiny proxy
that maps `/rest/v1/*` to PostgREST and drops the JWT → the built site (`NEXT_PUBLIC_SUPABASE_URL` pointed at the proxy) → Playwright/Chromium checks
(39 checks: both tabs, rings, CGPA on/off, practical only for 1103, failed-course label, incomplete, wrong pair, missing table, missing column, menu open/close, `/home`, mobile widths 360/390).
The generated SQL was also validated by parsing it with `pglast`.

## History / decisions
1. PDF (text, no OCR) parsed with `pdftotext -layout` into rows of 30 tokens; only class rolls starting `32` kept; the "improvement" pages (31st batch) skipped. All 154 rows validated (components sum, grade scale, SGPA) with 0 mismatches. Roll 26135 is incomplete (blank totals).
2. First version used SQLite via `node:sqlite`; replaced by Supabase tables for easier future exams. SQLite kept in `legacy/`.
3. Mid-term lookup first used one table per course; consolidated into one table per mid with a column per course.

## Open items / ideas
- **Reference PDF**: a table for the whole results PDF is planned; the menu already has a greyed "Reference PDF · Coming soon" entry (`config/menu.ts`).
- **PDF → CSV for new exams**: `legacy/build_db.py` only handles the 32nd-batch semester-1 layout. New exams need a parser that writes a CSV with the header printed by `make-table-sql.mjs`.
- Which practical courses exist beyond 1103 is unknown (all other flags are `false`; change in `courses.json`).
- Per-course mid maximums are global (`MID_MAX = 15`); a per-course override would be a small change.
- Not yet verified against the owner's real Supabase project and a real Vercel deploy from the build sandbox.
