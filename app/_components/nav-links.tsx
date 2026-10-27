"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// `match` lists every path that should highlight the tab. "/" and "/home" both show the final page.
const TABS = [
  { href: "/", label: "Final", match: ["/", "/home"] },
  { href: "/mid", label: "Mid-term", match: ["/mid"] },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Pages"
      className="cursor-pointer flex gap-1 rounded-full bg-white/75 p-1 shadow-[0_1px_0_#fff_inset] ring-1 ring-folio-700/15"
    >
      {TABS.map((t) => {
        const active = t.match.includes(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-full bg-linear-to-b from-folio-600 to-folio-900 px-3.5 py-1.5 text-sm font-semibold text-gold-200 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_6px_10px_-4px_rgba(8,56,47,0.6)]"
                : "rounded-full px-3.5 py-1.5 text-sm font-semibold text-folio-800 hover:bg-folio-50"
            }
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
