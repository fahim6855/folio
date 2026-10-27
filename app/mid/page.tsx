import { Suspense } from "react";
import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { MidLookup } from "../_components/mid-lookup";
import { Notice } from "../_components/notice";
import { SiteFooter, SiteHeader } from "../_components/site-chrome";

export const metadata: Metadata = {
  title: "Mid-term Marks",
  description: "Look up your mid-term marks by batch, semester, mid-term and class roll.",
};

export default function MidPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-8">
        <section className="mx-auto max-w-3xl pb-8 pt-4 text-center sm:pb-10 sm:pt-10">
          <Notice page="mid" />
          <p className="mx-auto w-fit rounded-full border border-gold-500/40 bg-white/60 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-folio-800 shadow-[0_1px_0_#fff_inset] sm:text-xs sm:tracking-[0.22em]">
            {SITE.program} · {SITE.department}
          </p>
          <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-folio-900 sm:text-6xl">
            Your mid-term marks,
            <br />
            <span className="ink-gold-text italic">instantly.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-folio-800/80 sm:text-lg">
            Choose your batch, semester and mid-term, then enter your class roll to see the marks of every course.
          </p>
        </section>

        <Suspense fallback={<div className="mx-auto w-full max-w-3xl"><div className="card-glass h-[19rem] sm:h-80" aria-hidden /></div>}>
          <MidLookup />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
