"use client";

import { useRef } from "react";
import { MENU } from "@/config/menu";
import { SITE } from "@/config/site";
import { GradeScale } from "./grade-scale";
import { CloseIcon, External, FolioMark, MenuIcon } from "./icons";

/** The ☰ button + slide-over menu. Closed by default on every screen size. Esc, ✕ or a click outside closes it. */
export function MenuDrawer() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label="Open menu"
        aria-haspopup="dialog"
        className="cursor-pointer grid size-10 shrink-0 place-items-center rounded-full bg-white/80 text-folio-800 shadow-[0_1px_0_#fff_inset] ring-1 ring-folio-700/15 hover:bg-folio-50"
      >
        <MenuIcon className="size-5" />
      </button>

      <dialog
        ref={ref}
        aria-label="Menu"
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(23rem,90vw)] max-w-none overflow-y-auto border-0 bg-paper p-0 text-ink shadow-[-30px_0_60px_-30px_rgba(8,56,47,0.5)]"
      >
        <div className="flex min-h-full flex-col">
          <div className="panel-emerald flex items-center justify-between rounded-none px-5 py-4">
            <div className="flex items-center gap-3">
              <FolioMark className="size-9" />
              <span className="font-display text-xl font-semibold">{SITE.name}</span>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close menu"
              className="cursor-pointer chip-glass grid size-9 place-items-center !p-0"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 p-5">
            {MENU.map((entry, i) => {
              if (entry.kind === "grade-scale") {
                return (
                  <section key={i} className="card-glass p-5">
                    <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-folio-700">Grade scale</h2>
                    <GradeScale />
                  </section>
                );
              }
              if (entry.kind === "text") {
                return (
                  <section key={i} className="card-glass p-5">
                    <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-folio-700">{entry.title}</h2>
                    <p className="text-sm leading-relaxed text-folio-800/85">{entry.body}</p>
                  </section>
                );
              }
              return entry.href ? (
                <a
                  key={i}
                  href={entry.href}
                  {...(entry.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card-glass flex items-center justify-between gap-3 p-5 font-semibold text-folio-900"
                >
                  {entry.label}
                  <External className="size-5 text-folio-700" />
                </a>
              ) : (
                <div key={i} className="card-glass flex items-center justify-between gap-3 p-5 text-folio-800/60" aria-disabled>
                  <span className="font-semibold">{entry.label}</span>
                  {entry.note && (
                    <span className="rounded-full bg-folio-100 px-2.5 py-1 text-xs font-semibold text-folio-700">{entry.note}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </dialog>
    </>
  );
}
