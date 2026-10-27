"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BATCHES, DEFAULT_MID, DEFAULT_SEMESTER, MID_ROUNDS, SEMESTERS } from "@/config/site";
import { fetchMid, type MidOutcome, type MidQuery } from "@/lib/mid";
import { isRoll, ordinal } from "@/lib/naming";
import { ArrowRight } from "./icons";
import { FailureMessage } from "./message";
import { MidView } from "./mid-view";

type View =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; id: number; query: MidQuery; outcome: MidOutcome };

const digits = (v: string) => v.replace(/\D/g, "").slice(0, 10);

/** Reads ?batch=&sem=&mid=&class_roll= so a result link can be shared. */
function readParams(sp: URLSearchParams) {
  const batch = BATCHES.includes(Number(sp.get("batch"))) ? Number(sp.get("batch")) : BATCHES[0];
  const semester = SEMESTERS.includes(Number(sp.get("sem"))) ? Number(sp.get("sem")) : DEFAULT_SEMESTER;
  const round = MID_ROUNDS.includes(Number(sp.get("mid"))) ? Number(sp.get("mid")) : DEFAULT_MID;
  const classRoll = digits(sp.get("class_roll") ?? "");
  return { batch, semester, round, classRoll, ready: isRoll(classRoll) };
}

export function MidLookup() {
  const searchParams = useSearchParams();
  const [init] = useState(() => readParams(searchParams));

  const [batch, setBatch] = useState(init.batch);
  const [semester, setSemester] = useState(init.semester);
  const [round, setRound] = useState(init.round);
  const [classRoll, setClassRoll] = useState(init.classRoll);
  const [view, setView] = useState<View>(init.ready ? { kind: "loading" } : { kind: "idle" });
  const latest = useRef(0);

  // Opened from a shared link: look the marks up straight away.
  useEffect(() => {
    if (!init.ready) return;
    const id = ++latest.current;
    const query = { batch: init.batch, semester: init.semester, round: init.round, classRoll: init.classRoll };
    void fetchMid(query).then((outcome) => {
      if (id === latest.current) setView({ kind: "done", id, query, outcome });
    });
  }, [init]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query: MidQuery = { batch, semester, round, classRoll: classRoll.trim() };
    if (!isRoll(query.classRoll)) return;

    const id = ++latest.current;
    setView({ kind: "loading" });
    const qs = new URLSearchParams({
      batch: String(batch), sem: String(semester), mid: String(round), class_roll: query.classRoll,
    });
    window.history.replaceState(null, "", `?${qs}`);

    const outcome = await fetchMid(query);
    if (id === latest.current) setView({ kind: "done", id, query, outcome });
  }

  const loading = view.kind === "loading";

  return (
    <>
      <div className="mx-auto w-full max-w-3xl">
        <form onSubmit={onSubmit} className="card-glass p-5 sm:p-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label htmlFor="batch" className="field-label">Batch</label>
              <select id="batch" className="field" value={batch} onChange={(e) => setBatch(Number(e.target.value))}>
                {BATCHES.map((b) => (
                  <option key={b} value={b}>{ordinal(b)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="semester" className="field-label">Semester</label>
              <select id="semester" className="field" value={semester} onChange={(e) => setSemester(Number(e.target.value))}>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>{ordinal(s)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="round" className="field-label">Mid-term</label>
              <select id="round" className="field" value={round} onChange={(e) => setRound(Number(e.target.value))}>
                {MID_ROUNDS.map((m) => (
                  <option key={m} value={m}>{ordinal(m)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="class_roll" className="field-label">Class Roll</label>
              <input
                id="class_roll" className="field tabular-nums" inputMode="numeric" pattern="[0-9]{3,10}"
                minLength={3} maxLength={10} required autoComplete="off" placeholder="e.g. 32890"
                value={classRoll} onChange={(e) => setClassRoll(digits(e.target.value))}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-gold mt-6 w-full text-base disabled:opacity-70 sm:mt-7">
            <span>{loading ? "Looking up…" : "View my marks"}</span>
            {!loading && <ArrowRight className="size-5" />}
          </button>
        </form>
      </div>

      {view.kind === "done" && (
        <div className="mt-10 sm:mt-14" key={view.id}>
          {view.outcome.kind === "found" ? (
            <MidView result={view.outcome.result} batch={view.query.batch} semester={view.query.semester} round={view.query.round} />
          ) : (
            <FailureMessage
              failure={view.outcome}
              subject={`Mid-term ${view.query.round} marks for the ${ordinal(view.query.batch)} batch, ${ordinal(view.query.semester)} semester`}
              missing={{
                title: "No marks found",
                text: `We couldn’t find class roll ${view.query.classRoll} for this mid-term. Check the batch, semester, mid-term and class roll, or the marks may not have been entered yet.`,
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
