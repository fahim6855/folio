import { SITE } from "@/config/site";
import { FolioMark } from "./icons";
import { MenuDrawer } from "./menu-drawer";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-7">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <a href="/">
        <FolioMark className="size-9 shrink-0 drop-shadow-[0_8px_10px_rgba(8,56,47,0.35)] sm:size-10" />
        </a> 
        <a href="/">
        <span className="font-display text-xl font-semibold tracking-tight text-folio-900 sm:text-2xl">{SITE.name}</span>

        </a>
      </div>
      <div className="flex items-center gap-2.5 sm:gap-4">
        <p className="mr-2 hidden text-sm font-medium text-folio-800/80 lg:block">
          {SITE.department} <span className="mx-1.5 text-gold-500">◆</span> {SITE.university}
        </p>
        <NavLinks />
        <MenuDrawer />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-7xl px-5 pb-12 sm:px-8">
      <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-folio-800/70">
        {SITE.name} is an unofficial, student-built results viewer. For anything official, the result published by the{" "}
        {SITE.department}, {SITE.university} is the final reference.
      </p>
    </footer>
  );
}
