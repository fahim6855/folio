import { Suspense } from "react";
import { SITE } from "@/config/site";
import { FinalLookup } from "./final-lookup";
import { Notice } from "./notice";
import { SiteFooter, SiteHeader } from "./site-chrome";

/** The Final-result page. Served at both "/" and "/home". */
export function FinalPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-8">
        <section className="mx-auto max-w-3xl pb-8 pt-4 text-center sm:pb-10 sm:pt-10">
          <Notice page="final" />
          <p className="mx-auto w-fit rounded-full border border-gold-500/40 bg-white/60 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-folio-800 shadow-[0_1px_0_#fff_inset] sm:text-xs sm:tracking-[0.22em]">
            DU · {SITE.department}
          </p>
          <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-folio-900 sm:text-6xl">
            Your semester result,
            <br />
            <span className="ink-gold-text italic">at a glance.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-folio-800/80 sm:text-lg">
            Choose your batch and semester, then enter your exam roll and class roll to see every mark, grade and your
            SGPA.
          </p>
        </section>

        <Suspense fallback={<div className="mx-auto w-full max-w-3xl"><div className="card-glass h-[19rem] sm:h-80" aria-hidden /></div>}>
          <FinalLookup />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
