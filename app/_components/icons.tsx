import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const line = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

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
    <svg {...line} strokeWidth={2.2} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function SearchOff(props: IconProps) {
  return (
    <svg {...line} strokeWidth={1.7} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.9-4.9M8 8l5 5M13 8l-5 5" />
    </svg>
  );
}

export function Hourglass(props: IconProps) {
  return (
    <svg {...line} strokeWidth={1.7} {...props}>
      <path d="M6.5 3h11M6.5 21h11M7.5 3c0 4.5 2.2 6 4.5 9-2.3 3-4.5 4.5-4.5 9M16.5 3c0 4.5-2.2 6-4.5 9 2.3 3 4.5 4.5 4.5 9" />
    </svg>
  );
}

export function Bell(props: IconProps) {
  return (
    <svg {...line} strokeWidth={1.8} {...props}>
      <path d="M6 9.5a6 6 0 1 1 12 0c0 4.5 1.5 5.5 2 6.5H4c.5-1 2-2 2-6.5z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...line} strokeWidth={2} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...line} strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function External(props: IconProps) {
  return (
    <svg {...line} strokeWidth={1.9} {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}
