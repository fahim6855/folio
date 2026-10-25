import type { CourseResult, StudentResult } from "@/lib/folio";
import { CourseIcon, Hourglass, SearchOff } from "./icons";
import { ScrollToResult } from "./scroll-to-result";

/* ───────────────────────────── helpers ───────────────────────────── */

type Tone = "gold" | "emerald" | "teal" | "bronze" | "red";

function toneFor(grade: string | null): Tone {
  switch (grade) {
    case "A+": return "gold";
    case "A":
    case "A-": return "emerald";
    case "B+":
    case "B":
    case "B-": return "teal";
    case "F": return "red";
    default: return "bronze";
  }
}

const marks = (n: number | null) => (n === null ? "—" : n.toFixed(2));
const whole = (n: number | null) =>
  n === null ? "—" : Number.isInteger(n) ? String(n) : n.toFixed(2);
const pct = (v: number | null, max: number) =>
  v === null || max <= 0 ? 0 : Math.max(0, Math.min(100, (v / max) * 100));

/* ───────────────────────────── scoreboard ───────────────────────────── */

function Scoreboard({ r }: { r: StudentResult }) {
  const sgpa = r.sgpa ?? 0;
  const cleared = r.courses.filter((c) => c.grade && c.grade !== "F").length;

  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * Math.max(0, Math.min(1, sgpa / 4));

  return (
    <section className="panel-emerald p-7 sm:p-10" aria-label="Result summary">
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-12">
        {/* SGPA ring */}
        <div className="relative mx-auto size-48 sm:size-52">
          <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden>
            <defs>
              <linearGradient id="ring-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fbefb4" />
                <stop offset="0.5" stopColor="#e3c25a" />
                <stop offset="1" stopColor="#b8901f" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r={radius} fill="rgba(4,36,30,.35)" stroke="rgba(255,255,255,.14)" strokeWidth="14" />
            <circle
              cx="100" cy="100" r={radius} fill="none" stroke="url(#ring-gold)" strokeWidth="14"
              strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-folio-200">SGPA</span>
            <span className="gold-text font-display text-6xl font-semibold leading-none tabular-nums sm:text-[4rem]">
              {sgpa.toFixed(2)}
            </span>
            <span className="mt-1 text-xs text-folio-200/90">out of 4.00</span>
          </div>
        </div>

        {/* Identity */}
        <div className="text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Semester Result</p>
          <h2 className="font-display mt-2 text-2xl font-semibold leading-tight sm:text-4xl">{r.examName}</h2>
          <p className="mt-2 text-sm text-folio-100/90 sm:text-base">
            {r.batchName}
            {r.department ? ` · ${r.department}` : ""}
            {r.university ? ` · ${r.university}` : ""}
          </p>

          <dl className="mt-6 flex flex-wrap justify-center gap-2.5 md:justify-start">
            <div className="chip-glass text-sm">
              <dt className="inline text-folio-200">Exam Roll </dt>
              <dd className="inline font-semibold tabular-nums">{r.examRoll}</dd>
            </div>
            <div className="chip-glass text-sm">
              <dt className="inline text-folio-200">Class Roll </dt>
              <dd className="inline font-semibold tabular-nums">{r.classRoll}</dd>
            </div>
            <div className="chip-glass text-sm">
              <dt className="inline text-folio-200">Courses cleared </dt>
              <dd className="inline font-semibold tabular-nums">{cleared} of {r.courses.length}</dd>
            </div>
          </dl>

          <ul className="mx-auto mt-6 grid max-w-md grid-cols-5 gap-2 md:mx-0" aria-label="Grades at a glance">
            {r.courses.map((c) => (
              <li
                key={c.code}
                className={`grade-tile tone-${toneFor(c.grade)} px-1 pb-2 pt-1.5 text-center`}
              >
                <p className="text-[0.62rem] font-bold tabular-nums tracking-wider opacity-75">{c.code}</p>
                <p className="font-display text-xl font-semibold leading-tight">{c.grade ?? "–"}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── course card ───────────────────────────── */

function Bar({ value, max, thick }: { value: number | null; max: number; thick?: boolean }) {
  return (
    <div className={`mt-1.5 overflow-hidden rounded-full bg-folio-700/10 ${thick ? "h-2.5" : "h-1.5"}`}>
      <div className="bar-fill h-full rounded-full" style={{ width: `${pct(value, max)}%` }} />
    </div>
  );
}

function Part({ label, value, max }: { label: string; value: number | null; max: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <dt className="text-folio-800/80">{label}</dt>
        <dd className="whitespace-nowrap font-medium tabular-nums text-folio-900">
          {marks(value)}
          <span className="text-folio-700/50">/{max}</span>
        </dd>
      </div>
      <Bar value={value} max={max} />
    </div>
  );
}

function CourseCard({ c, last }: { c: CourseResult; last: boolean }) {
  const tone = toneFor(c.grade);
  const grade = c.grade ?? "–";
  const letter = grade.charAt(0);
  const suffix = grade.slice(1);
  const failed = c.grade === "F";

  return (
    <article
      className={`card-glass tone-${tone} flex flex-col p-5 sm:p-6 ${last ? "sm:col-span-2 xl:col-span-1" : ""}`}
      aria-label={`${c.code} ${c.name}`}
    >
      <header className="flex items-start justify-between gap-3">
        <span className="tile-emerald size-12">
          <CourseIcon code={c.code} className="size-6" />
        </span>
        <span className="rounded-full border border-folio-700/15 bg-folio-50/80 px-2.5 py-1 text-xs font-bold tracking-wider text-folio-800 tabular-nums">
          {c.code}
        </span>
      </header>

      <h3 className="mt-4 text-base font-semibold leading-snug text-folio-900 sm:min-h-[3.4rem] xl:min-h-[4.3rem]">{c.name}</h3>

      {/* grade */}
      <div className="grade-tile mt-4 px-4 pb-4 pt-5 text-center">
        <CourseIcon
          code={c.code}
          strokeWidth={0.9}
          className="pointer-events-none absolute -bottom-6 -right-6 -z-10 size-36 opacity-[0.16]"
        />
        <div className="font-display leading-none">
          <span className="text-7xl font-semibold">{letter}</span>
          {suffix && <span className="align-top text-4xl font-semibold">{suffix}</span>}
        </div>
        <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.25em] opacity-80">Grade point</p>
        <p className="text-2xl font-bold tabular-nums">
          {c.gradePoint === null ? "—" : c.gradePoint.toFixed(2)}
        </p>
        {failed && (
          <p className="mx-auto mt-2 w-fit rounded-full bg-black/30 px-3 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider">
            Failed
          </p>
        )}
      </div>

      {/* total */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-folio-700">Total</span>
          <span className="tabular-nums">
            <span className="text-3xl font-bold text-folio-900">{whole(c.total)}</span>
            <span className="text-sm text-folio-700/60"> / {c.totalMax}</span>
          </span>
        </div>
        <Bar value={c.total} max={c.totalMax} thick />
      </div>

      {/* breakdown */}
      <dl className="mt-5 space-y-3.5 border-t border-folio-700/10 pt-4">
        <Part label="Mid & Quiz" value={c.mid} max={c.midMax} />
        {c.practicalMax !== null && <Part label="Practical" value={c.practical} max={c.practicalMax} />}
        <Part label="Final Exam" value={c.final} max={c.finalMax} />
      </dl>
    </article>
  );
}

/* ───────────────────────────── states ───────────────────────────── */

function Notice({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card-glass mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 py-10 text-center sm:px-10">
      <span className="tile-emerald size-14">{icon}</span>
      <h2 className="font-display text-2xl font-semibold text-folio-900">{title}</h2>
      <p className="max-w-md text-folio-800/80">{children}</p>
    </div>
  );
}

export function NoMatch() {
  return (
    <section aria-live="polite">
      <ScrollToResult />
      <Notice icon={<SearchOff className="size-7" />} title="No result found">
        We couldn’t find a result for those details. Check that the batch, exam, exam roll and class roll
        are correct, and that both rolls belong to the same student.
      </Notice>
    </section>
  );
}

export function BadInput() {
  return (
    <section aria-live="polite">
      <ScrollToResult />
      <Notice icon={<SearchOff className="size-7" />} title="Check your roll numbers">
        Exam roll and class roll should contain digits only, for example 26101 and 32085.
      </Notice>
    </section>
  );
}

function Incomplete({ r }: { r: StudentResult }) {
  return (
    <Notice icon={<Hourglass className="size-7" />} title="Your result is incomplete">
      Exam roll {r.examRoll} was found, but the published sheet doesn’t include a full result yet.
      Please contact the department office to confirm your status.
    </Notice>
  );
}

/* ───────────────────────────── main ───────────────────────────── */

export function ResultView({ result }: { result: StudentResult }) {
  return (
    <section aria-live="polite" className="space-y-6 sm:space-y-8">
      <ScrollToResult />
      {result.complete ? (
        <>
          <Scoreboard r={result} />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {result.courses.map((c, i) => (
              <CourseCard key={c.code} c={c} last={i === result.courses.length - 1} />
            ))}
          </div>
        </>
      ) : (
        <Incomplete r={result} />
      )}
    </section>
  );
}
