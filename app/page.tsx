import { Suspense } from "react";
import { findResult, getBatches } from "@/lib/folio";
import { LookupForm } from "./_components/lookup-form";
import { BadInput, NoMatch, ResultView } from "./_components/result-view";
import { SiteFooter, SiteHeader } from "./_components/site-chrome";

type SearchParams = PageProps<"/">["searchParams"];

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const asInt = (v: string) => (/^\d{1,9}$/.test(v) ? Number(v) : null);
const isRoll = (v: string) => /^\d{3,10}$/.test(v);

async function Lookup({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const batches = await getBatches();

  // Selected batch/exam fall back to the first available option.
  const batch = batches.find((b) => b.id === asInt(first(sp.batch))) ?? batches[0];
  const exam = batch?.exams.find((e) => e.id === asInt(first(sp.exam))) ?? batch?.exams[0];

  const examRoll = first(sp.exam_roll).trim();
  const classRoll = first(sp.class_roll).trim();
  const submitted = examRoll !== "" || classRoll !== "";

  if (!batch || !exam) {
    return <p className="text-center text-folio-800">No exams are available yet.</p>;
  }

  let outcome: React.ReactNode = null;
  if (submitted) {
    if (!isRoll(examRoll) || !isRoll(classRoll)) {
      outcome = <BadInput />;
    } else {
      const result = await findResult({ batchId: batch.id, examId: exam.id, examRoll, classRoll });
      outcome = result ? <ResultView result={result} /> : <NoMatch />;
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-3xl">
        {/* key re-syncs the form when the URL changes (e.g. browser back) */}
        <LookupForm
          key={`${batch.id}-${exam.id}-${examRoll}-${classRoll}`}
          batches={batches}
          defaults={{ batchId: batch.id, examId: exam.id, examRoll, classRoll }}
        />
      </div>
      {outcome && <div className="mt-10 sm:mt-14">{outcome}</div>}
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="card-glass h-[24rem] sm:h-80" aria-hidden />
    </div>
  );
}

export default function Home(props: PageProps<"/">) {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8">
        <section className="mx-auto max-w-3xl pb-8 pt-6 text-center sm:pb-10 sm:pt-12">
          <p className="mx-auto w-fit rounded-full border border-gold-500/40 bg-white/60 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-folio-800 sm:text-xs sm:tracking-[0.22em] shadow-[0_1px_0_#fff_inset]">
            BBA · Department of Accounting
          </p>
          <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-folio-900 sm:text-6xl">
            Your semester result,
            <br />
            <span className="ink-gold-text italic">at a glance.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-folio-800/80 sm:text-lg">
            Choose your batch and exam, then enter your exam roll and class roll to see every mark,
            grade and your SGPA.
          </p>
        </section>

        <Suspense fallback={<FormSkeleton />}>
          <Lookup searchParams={props.searchParams} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
