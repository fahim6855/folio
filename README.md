# Folio

Results viewer for the Department of Accounting, University of Dhaka (BBA).
Next.js 16 · Tailwind CSS 4 · Supabase (read in the browser with the public key).

- **Final** results: `/` and `/home`. **Mid-term** marks: `/mid`.
- `docs/HOW-TO-EDIT.md`: how to change things (notice, courses, batches, new tables, menu, deploy).
- `docs/PROJECT-CONTEXT.md`: architecture and conventions, for starting a new AI conversation about this project.

```bash
npm install
cp .env.example .env.local     # then fill in your Supabase URL and public key
npm run dev
```

Create tables for a new exam: `node scripts/make-table-sql.mjs 33 1 final`
