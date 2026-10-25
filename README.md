# Folio

Semester result lookup for the Department of Accounting, University of Dhaka.
Next.js 16 + Tailwind CSS 4. No extra npm packages: SQLite is read through Node's built-in `node:sqlite`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Needs Node 22.13 or newer. Try exam roll `26101` with class roll `32085`.

## How it fits together

- `data/folio.db` is the database (batches, exams, courses, students, exam_records, results).
- `lib/folio.ts` is the only file that touches the database. To move to Turso, change the `all()` helper there.
- The lookup is a plain GET form (`?batch=&exam=&exam_roll=&class_roll=`), so every result has a shareable link.
- Colors and the glossy surfaces live in `app/globals.css`. Course icons are inline SVG in `app/_components/icons.tsx`.

## Adding a batch or exam

Insert rows into `batches` / `exams`, then load the new results. The dropdowns read from those tables,
so no code changes are needed. `scripts/build_db.py` shows how the current PDF is parsed and loaded
(`python3 scripts/build_db.py <result.pdf> [out_dir]`, needs `pdftotext`). New PDFs with a different
layout will need the parser adjusted.

## Deploying to Vercel

`next.config.ts` bundles `data/folio.db` with the server build, so the read-only file can ship as-is.
Moving the data to Turso is optional.
