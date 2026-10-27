// Entries of the slide-over menu (the ☰ button). Edit this list to change the menu.
//
//   { kind: "grade-scale" }                                  built-in grade table
//   { kind: "text", title: "About", body: "Some words." }    a titled paragraph
//   { kind: "link", label: "Reference PDF", href: "https://…" }
//        href: null  → shown greyed out with the `note` ("Coming soon") until you add a real link
//        external: true → opens in a new tab

export type MenuEntry =
  | { kind: "grade-scale" }
  | { kind: "text"; title: string; body: string }
  | { kind: "link"; label: string; href: string | null; note?: string; external?: boolean };

export const MENU: MenuEntry[] = [
  { kind: "grade-scale" },
  { kind: "link", label: "Reference PDF", href: null, note: "Coming soon" },
  {
    kind: "text",
    title: "About Folio",
    body:
      "Folio is an unofficial, student-built results viewer. For anything official, the result published by the Department of Accounting, University of Dhaka is the final reference.",
  },
];
