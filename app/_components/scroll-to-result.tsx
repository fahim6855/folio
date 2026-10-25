"use client";

import { useEffect, useRef } from "react";

/** Jumps (instantly, no animation) to the result when it appears. */
export function ScrollToResult() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "start" });
  }, []);
  return <div ref={ref} aria-hidden className="scroll-mt-5" />;
}
