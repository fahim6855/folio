import { SITE } from "@/config/site";
import type { FinalCourseResult, FinalResult } from "@/lib/final";
import { ordinal } from "@/lib/naming";
import { Hourglass } from "./icons";
import { Message } from "./message";
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
const whole = (n: number | null) => (n === null ? "—" : Number.isInteger(n) ? String(n) : n.toFixed(2));
const pct = (v: number | null, max: number) =>
  v === null || max <= 0 ? 0 : Math.max(0, Math.min(100, (v / max) * 100));

/* ───────────────────────────── rings ───────────────────────────── */

function Ring({ id, label, value, small }: { id: string; label: string; value: number; small: boolean }) {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * Math.max(0, Math.min(1, value / 4));
  return (
    <div className={`relative shrink-0 ${small ? "size-36 sm:size-40" : "size-48 sm:size-52"}`}>
      <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbefb4" />
            <stop offset="0.5" stopColor="#e3c25a" />
            <stop offset="1" stopColor="#b8901f" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={radius} fill="rgba(4,36,30,.35)" stroke="rgba(255,255,255,.14)" strokeWidth="14" />
        <circle
          cx="100" cy="100" r={radius} fill="none" stroke={`url(#${id})`} strokeWidth="14"
          strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-folio-200">{label}</span>
        <span
          className={`gold-text font-display font-semibold leading-none tabular-nums ${
            small ? "text-4xl sm:text-5xl" : "text-6xl sm:text-[4rem]"
          }`}
        >
          {value.toFixed(2)}
        </span>
        <span className="mt-1 text-xs text-folio-200/90">out of 4.00</span>
      </div>
    </div>
  );
}

/* ───────────────────────────── scoreboard ───────────────────────────── */

function Scoreboard({ r, batch, semester }: { r: FinalResult; batch: number; semester: number }) {
  const cleared = r.courses.filter((c) => c.gradeLetter && c.gradeLetter !== "F").length;
  const both = r.cgpa !== null;

  return (
    <section className="panel-emerald p-7 sm:p-10" aria-label="Result summary">
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-12">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <Ring id="ring-sgpa" label="SGPA" value={r.sgpa ?? 0} small={both} />
          {both && <Ring id="ring-cgpa" label="CGPA" value={r.cgpa ?? 0} small />}
        </div>

        <div className="text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Semester Result</p>
          <h2 className="font-display mt-2 text-2xl font-semibold leading-tight sm:text-4xl">
            {ordinal(semester)} Semester Final Examination
          </h2>
          <p className="mt-2 text-sm text-folio-100/90 sm:text-base">
            {SITE.program} {ordinal(batch)} Batch · {SITE.department} · {SITE.university}
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

          <ul className="mx-auto mt-6 grid max-w-md gap-2 md:mx-0" style={{ gridTemplateColumns: `repeat(${r.courses.length}, minmax(0, 1fr))` }} aria-label="Grades at a glance">
            {r.courses.map((c) => (
              <li key={c.course.code} className={`grade-tile tone-${toneFor(c.gradeLetter)} px-1 pb-2 pt-1.5 text-center`}>
                <p className="text-[0.62rem] font-bold tabular-nums tracking-wider opacity-75">{c.course.code}</p>
                <p className="font-display text-xl font-semibold leading-tight">{c.gradeLetter ?? "–"}</p>
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

function CourseCard({ c, wide }: { c: FinalCourseResult; wide: boolean }) {
  const { course } = c;
  const grade = c.gradeLetter ?? "–";
  const failed = c.gradeLetter === "F";

  return (
    <article
      className={`card-glass tone-${toneFor(c.gradeLetter)} flex flex-col p-5 sm:p-6 ${wide ? "sm:col-span-2 xl:col-span-1" : ""}`}
      aria-label={`${course.code} ${course.name}`}
    >
      <header>
        <span className="tile-emerald w-fit rounded-full px-3.5 py-1.5 text-sm font-bold tabular-nums tracking-[0.14em]">
          {course.code}
        </span>
      </header>

      <h3 className="mt-4 text-base font-semibold leading-snug text-folio-900 sm:min-h-[3.4rem] xl:min-h-[4.3rem]">
        {course.name}
      </h3>

      <div className="grade-tile mt-4 px-4 pb-4 pt-5 text-center">
        <div className="font-display leading-none">
          <span className="text-7xl font-semibold">{grade.charAt(0)}</span>
          {grade.length > 1 && <span className="align-top text-4xl font-semibold">{grade.slice(1)}</span>}
        </div>
        <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.25em] opacity-80">Grade point</p>
        <p className="text-2xl font-bold tabular-nums">{c.gradePoint === null ? "—" : c.gradePoint.toFixed(2)}</p>
        {failed && (
          <p className="mx-auto mt-2 w-fit rounded-full bg-black/30 px-3 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider">
            Failed
          </p>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-folio-700">Total</span>
          <span className="tabular-nums">
            <span className="text-3xl font-bold text-folio-900">{whole(c.total)}</span>
            <span className="text-sm text-folio-700/60"> / {course.max.total}</span>
          </span>
        </div>
        <Bar value={c.total} max={course.max.total} thick />
      </div>

      <dl className="mt-5 space-y-3.5 border-t border-folio-700/10 pt-4">
        <Part label="Mid & Quiz" value={c.midquiz} max={course.max.midquiz} />
        {course.max.practical !== null && <Part label="Practical" value={c.practical} max={course.max.practical} />}
        <Part label="Final Exam" value={c.final} max={course.max.final} />
      </dl>
    </article>
  );
}

/* ───────────────────────────── main ───────────────────────────── */

export function FinalView({ result, batch, semester }: { result: FinalResult; batch: number; semester: number }) {
  const n = result.courses.length;
  return (
    <section aria-live="polite" className="space-y-6 sm:space-y-8">
      <ScrollToResult />
      {result.complete ? (
        <>
          <Scoreboard r={result} batch={batch} semester={semester} />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))]">
            {result.courses.map((c, i) => (
              <CourseCard key={c.course.code} c={c} wide={i === n - 1 && n % 2 === 1} />
            ))}
          </div>
        </>
      ) : (
        <Message icon={<Hourglass className="size-7" />} title="Your result is incomplete">
          Exam roll {result.examRoll} was found, but the published sheet doesn’t include a full result yet. Please
          contact the department office to confirm your status.
        </Message>
      )}

        <div className="button flex justify-center">
                <button type="submit" disabled={true} className="btn-gold mt-6 text-base disabled:opacity-70 sm:mt-7">
                📄   Save PDF <span className="text-[12px] ml-4 opacity-50">Coming soon</span>
                </button>
        </div>
        
    </section>
  );
}
