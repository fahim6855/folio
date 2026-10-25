import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** 1101 · Introduction to Financial Accounting: calculator */
function Calculator(p: IconProps) {
  return (
    <svg {...stroke} {...p}>
      <rect x="5" y="2.5" width="14" height="19" rx="2.6" />
      <rect x="8" y="5.6" width="8" height="3.6" rx="0.9" />
      <path d="M8.6 13h.01M12 13h.01M15.4 13h.01M8.6 16.6h.01M12 16.6h.01M15.4 16.6h.01" strokeWidth={2.2} />
    </svg>
  );
}

/** 1102 · Introduction to Business: briefcase */
function Briefcase(p: IconProps) {
  return (
    <svg {...stroke} {...p}>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.6" />
      <path d="M8.5 7.5V6.2A2.2 2.2 0 0 1 10.7 4h2.6a2.2 2.2 0 0 1 2.2 2.2v1.3" />
      <path d="M3 13h18" />
      <path d="M10.4 13v1.7h3.2V13" />
    </svg>
  );
}

/** 1103 · Computer Concepts and Applications: monitor with code brackets */
function Monitor(p: IconProps) {
  return (
    <svg {...stroke} {...p}>
      <rect x="3" y="4" width="18" height="12.5" rx="2.4" />
      <path d="M8 20.5h8M12 16.5v4" />
      <path d="m9.6 8.6-2 1.9 2 1.9M14.4 8.6l2 1.9-2 1.9" />
    </svg>
  );
}

/** 1104 · Mathematics for Business Decisions: sigma */
function Sigma(p: IconProps) {
  return (
    <svg {...stroke} {...p}>
      <path d="M17.6 5H6.8l5.7 7-5.7 7h10.8" />
    </svg>
  );
}

/** 1105 · Business Communication: speech bubble */
function Bubble(p: IconProps) {
  return (
    <svg {...stroke} {...p}>
      <path d="M6.2 4h11.6A2.7 2.7 0 0 1 20.5 6.7v7.1a2.7 2.7 0 0 1-2.7 2.7H11l-4.2 3.5v-3.5h-.6A2.7 2.7 0 0 1 3.5 13.8V6.7A2.7 2.7 0 0 1 6.2 4z" />
      <path d="M7.8 8.4h8.4M7.8 11.7h5" />
    </svg>
  );
}

/** Fallback for course codes without a dedicated icon */
function Book(p: IconProps) {
  return (
    <svg {...stroke} {...p}>
      <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5z" />
      <path d="M5 4.5v17M9 6.5h6" />
    </svg>
  );
}

const COURSE_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  "1101": Calculator,
  "1102": Briefcase,
  "1103": Monitor,
  "1104": Sigma,
  "1105": Bubble,
};

export function CourseIcon({ code, ...props }: IconProps & { code: string }) {
  const Icon = COURSE_ICONS[code] ?? Book;
  return <Icon {...props} />;
}

/** Folio mark: a glossy emerald tile holding a folded page. */
export function FolioMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden {...props}>
      <defs>
        <linearGradient id="fm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d8d74" />
          <stop offset="0.55" stopColor="#0f5c4d" />
          <stop offset="1" stopColor="#08382f" />
        </linearGradient>
        <linearGradient id="fm-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dd8a" />
          <stop offset="1" stopColor="#b8901f" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#fm-bg)" />
      <path d="M0 11C0 4.9 4.9 0 11 0h18c6.1 0 11 4.9 11 11v6c-9 4-31 4-40 0z" fill="url(#fm-gloss)" />
      <path d="M12.5 8.5h10.4l5.6 5.6V31.5h-16z" fill="#fbf6e6" />
      <path d="M22.9 8.5v5.6h5.6z" fill="url(#fm-gold)" />
      <path d="M16 19.5h9M16 23.5h9M16 27.5h5.5" stroke="#0f5c4d" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" fill="none" stroke="#fff" strokeOpacity="0.28" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function SearchOff(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.9-4.9M8 8l5 5M13 8l-5 5" />
    </svg>
  );
}

export function Hourglass(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M6.5 3h11M6.5 21h11M7.5 3c0 4.5 2.2 6 4.5 9-2.3 3-4.5 4.5-4.5 9M16.5 3c0 4.5-2.2 6-4.5 9 2.3 3 4.5 4.5 4.5 9" />
    </svg>
  );
}
