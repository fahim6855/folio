# How to edit Folio (for you)

Folio has two pages: **Final** (`/` and `/home`) and **Mid-term** (`/mid`). Both read their numbers from Supabase.
Almost everything you will ever change is in the `config/` folder, so start there.

| I want to…                                  | Edit this                         |
|---------------------------------------------|-----------------------------------|
| Change the notice above the heading          | `config/site.ts` → `NOTICES`       |
| Add a batch (33rd, 34th…)                    | `config/site.ts` → `BATCHES`       |
| Change a course name / mark a course as having a practical | `config/courses.json` |
| Change what mid-term marks are out of        | `config/site.ts` → `MID_MAX`       |
| Change the menu (☰) content                  | `config/menu.ts`                   |
| Change the department / university name      | `config/site.ts` → `SITE`          |
| Make a new Supabase table                    | `node scripts/make-table-sql.mjs …` |

After saving a file, `npm run dev` refreshes by itself. For the live site: commit and push to GitHub, and Vercel redeploys.

---

## 1. Run it on your computer

```bash
npm install
npm run dev          # open http://localhost:3000
```

Create a file called `.env.local` in the project's main folder (next to `package.json`):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

- The key can also be called `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Either name works.
- Use the **publishable / anon** key only. **Never** put the `sb_secret_...` key anywhere in this project.
- Stop and restart `npm run dev` after changing `.env.local`.
- On Vercel, add the same two variables under Settings → Environment Variables, then redeploy once.

## 2. Change the notice

In `config/site.ts`:

```ts
export const NOTICES = {
  final: { text: "The 2nd semester final result has been published.", date: "20 Dec 2026" },
  mid: null,            // null = hide the panel
};
```

`date` is optional. The text wraps automatically. Set `final: null` to hide the panel.

## 3. Course names and practicals

`config/courses.json` has one line per course:

```json
{"semester": 1, "course_code": "1103", "course_name": "Computer Concepts and Applications", "practical": true}
```

- Fix a name → change `course_name`.
- A course has a practical exam → set `"practical": true`. The Final table for that semester must then have a `practical_<code>` column (for example `practical_1103`). The page tells you if the column is missing.
- Marks are 40 + 60 normally, and 40 + 30 + 30 with a practical (set in `FINAL_MAX` in `config/site.ts`).
  For one odd course, add `"max": {"midquiz": 30, "final": 70}` to its line.

## 4. Add a new batch (e.g. the 33rd)

1. In `config/site.ts`, put the number first: `export const BATCHES: number[] = [33, 32];`
2. For each exam you publish, create its table (next section) and import the CSV.
3. Until a table exists, the page shows "Not published yet", which is fine.

## 5. Create a table for a new exam

Run one command (needs only Node):

```bash
node scripts/make-table-sql.mjs 33 1 final     # final exam, batch 33, semester 1  → table b33_s1
node scripts/make-table-sql.mjs 33 1 mid1      # mid-term 1                        → table b33_s1_m1
node scripts/make-table-sql.mjs 33 1 mid2      # mid-term 2                        → table b33_s1_m2
```

Then:
1. Copy the printed SQL into Supabase → **SQL Editor** → Run. This also makes the table read-only for the public key.
2. The first lines of the output show the exact **CSV header**. Your CSV must use those column names.
3. Supabase → **Table Editor** → open the table → **Insert → Import data from CSV**.

Semester 2 and later final tables automatically get a `cgpa` column. (The rule is `CGPA_FROM_SEMESTER` in `config/site.ts`.)
If a row's `cgpa` is empty, the page simply doesn't show a CGPA ring.

## 6. Naming rules (table and column names)

| Thing                    | Name                         | Example         |
|--------------------------|------------------------------|-----------------|
| Final table              | `b<batch>_s<semester>`       | `b32_s1`        |
| Mid-term table           | `b<batch>_s<semester>_m<1 or 2>` | `b32_s2_m1` |
| Mid & Quiz / Final / Total | `midquiz_` `final_` `total_` + course code | `midquiz_1101` |
| Practical                | `practical_<code>`           | `practical_1103` |
| Grade letter / point     | `gradeletter_<code>` `gradepoint_<code>` | `gradeletter_1101` |
| Mid-term mark            | `marks_<code>`               | `marks_1201`    |
| Semester / cumulative GPA | `sgpa`, `cgpa`              |                 |

Final tables are found by `exam_roll` + `class_roll`. Mid tables are found by `class_roll`.
An empty cell in a mid table means "Not published yet" for that course. Extra columns such as `id` or `exam_roll` in mid tables are ignored.

## 7. The menu (☰)

`config/menu.ts` is a simple list. Examples:

```ts
{ kind: "grade-scale" },                                                    // the grade table
{ kind: "text", title: "Contact", body: "Write to the class representative." },
{ kind: "link", label: "Reference PDF", href: "https://example.com/result.pdf", external: true },
{ kind: "link", label: "Reference PDF", href: null, note: "Coming soon" },  // greyed out until you have a link
```

## 8. Mid-term settings

In `config/site.ts`: `MID_MAX` (marks are out of this), `MID_ROUNDS` (`[1, 2]`), `DEFAULT_SEMESTER`, `DEFAULT_MID`.

## 9. Put it online

1. Push the project to GitHub (never commit `.env.local`; it is already ignored).
2. Vercel → Import the repo → add the two environment variables → Deploy.
3. Test a Final result and a Mid-term mark on the live link.

## 10. If something looks wrong

| You see… | Usually means | Fix |
|---|---|---|
| "This page isn't connected to its database yet" | The two env variables are missing | Add them, restart / redeploy |
| "Not published yet" | The table doesn't exist (or the batch/semester is wrong) | Create the table with the script |
| "Table setup problem … missing the column X" | The table lacks a column the page expects | Add column X in Supabase, or fix the practical flag in `courses.json` |
| "No result found" / "No marks found" | Table exists, but no row matches these rolls | Check the rolls and the table's data |
| Table exists, data is there, still "No result found" | The read policy is missing | Re-run the `create policy` lines the script printed |
| "Couldn't load the data" | Wrong key / URL, or no internet | Open the browser console (F12) for the exact message |

Safety: every table must have **Row Level Security on** with a read-only policy (the script does this). With RLS off, the public key could also change or delete marks.
