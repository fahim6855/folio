import { MID_MAX, SITE } from "@/config/site";
import type { MidResult } from "@/lib/mid";
import { ordinal } from "@/lib/naming";
import { ScrollToResult } from "./scroll-to-result";

const fmt = (n: number) => String(Number(n.toFixed(2)));

export function MidView({ result, batch, semester, round }: { result: MidResult; batch: number; semester: number; round: number }) {
  const n = result.marks.length;
  const published = result.marks.filter((m) => m.mark !== null).length;

  return (
    <section aria-live="polite" className="space-y-6 sm:space-y-8">
      <ScrollToResult />

      <div className="panel-emerald p-7 sm:p-9" aria-label="Mid-term summary">
        <div className="text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Mid-term {round}</p>
          <h2 className="font-display mt-2 text-2xl font-semibold leading-tight sm:text-4xl">
            {ordinal(semester)} Semester Mid-term {round}
          </h2>
          <p className="mt-2 text-sm text-folio-100/90 sm:text-base">
            {SITE.program} {ordinal(batch)} Batch · {SITE.department} · {SITE.university}
          </p>
          <dl className="mt-6 flex flex-wrap justify-center gap-2.5 md:justify-start">
            <div className="chip-glass text-sm">
              <dt className="inline text-folio-200">Class Roll </dt>
              <dd className="inline font-semibold tabular-nums">{result.classRoll}</dd>
            </div>
            <div className="chip-glass text-sm">
              <dt className="inline text-folio-200">Updated </dt>
              <dd className="inline font-semibold tabular-nums">{published} of {n} courses</dd>
            </div>
            <div className="chip-glass text-sm">
              <dt className="inline text-folio-200">Each mark out of </dt>
              <dd className="inline font-semibold tabular-nums">{MID_MAX}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))]">
        {result.marks.map(({ course, mark }, i) => {
          const wide = i === n - 1 && n % 2 === 1;
          const pct = mark === null ? 0 : Math.max(0, Math.min(100, (mark / MID_MAX) * 100));
          return (
            <article
              key={course.code}
              className={`card-glass tone-emerald flex flex-col p-5 sm:p-6 ${wide ? "sm:col-span-2 xl:col-span-1" : ""}`}
              aria-label={`${course.code} ${course.name}`}
            >
              <span className="tile-emerald w-fit rounded-full px-3.5 py-1.5 text-sm font-bold tabular-nums tracking-[0.14em]">
                {course.code}
              </span>
              <h3 className="mt-4 text-base font-semibold leading-snug text-folio-900 sm:min-h-[3.4rem] xl:min-h-[4.3rem]">
                {course.name}
              </h3>

              {mark === null ? (
                <div className="mt-4 grid h-36 place-content-center rounded-[1.35rem] border border-dashed border-folio-700/25 bg-folio-50/70 px-4 text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-folio-700/70">Not published or updated yet</p>
                </div>
              ) : (
                <div className="grade-tile mt-4 grid h-36 place-content-center px-4 text-center">
                  <p className="font-display text-6xl font-semibold leading-none tabular-nums">{fmt(mark)}</p>
                  <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] opacity-80">out of {MID_MAX}</p>
                </div>
              )}

              <div className="mt-5 overflow-hidden rounded-full bg-folio-700/10 h-2.5">
                <div className="bar-fill h-full rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
