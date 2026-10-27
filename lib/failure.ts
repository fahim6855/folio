// Turns a Supabase/PostgREST error into something the page can explain in plain words.

export type Failure =
  | { kind: "missing" } //     the table exists but has no row for these rolls
  | { kind: "unpublished" } // the table doesn't exist yet
  | { kind: "column"; table: string; column: string } // table is missing an expected column
  | { kind: "invalid" } //     roll numbers aren't digits
  | { kind: "error"; notConfigured: boolean };

type DbError = { code?: string; message?: string };

export function classify(error: DbError, table: string): Failure {
  // PGRST205 / 42P01: table not found
  if (error.code === "PGRST205" || error.code === "42P01") return { kind: "unpublished" };
  // 42703: column does not exist ("column b32_s1.practical_1103 does not exist")
  if (error.code === "42703") {
    const m = /column\s+(?:[\w"]+\.)?"?([\w]+)"?\s+does not exist/i.exec(error.message ?? "");
    return { kind: "column", table, column: m?.[1] ?? "unknown" };
  }
  console.error("Supabase error:", error.message, "| code:", error.code);
  return { kind: "error", notConfigured: false };
}
