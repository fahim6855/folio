import { NOTICES, type NoticeConfig } from "@/config/site";
import { Bell } from "./icons";

/** Small wrapped notice panel. Edit the text in config/site.ts → NOTICES. Renders nothing if null. */
export function Notice({ page }: { page: keyof typeof NOTICES }) {
  const notice: NoticeConfig = NOTICES[page];
  if (!notice) return null;
  return (
    <aside
      aria-label="Notice"
      className="mx-auto mb-7 flex w-fit max-w-md items-start gap-3 rounded-2xl border border-gold-500/40 bg-linear-to-b from-white/95 to-gold-200/40 px-4 py-3 text-left shadow-[0_1px_0_#fff_inset,0_14px_24px_-16px_rgba(134,102,15,0.55)]"
    >
      <span className="tile-emerald mt-0.5 size-8 shrink-0 rounded-full">
        <Bell className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-700">
          Notice{notice.date ? <span className="font-semibold normal-case tracking-normal text-folio-700/70"> · {notice.date}</span> : null}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-folio-900">{notice.text}</p>
      </div>
    </aside>
  );
}
