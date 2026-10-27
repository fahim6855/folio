"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BATCHES, DEFAULT_SEMESTER, SEMESTERS } from "@/config/site";
import { fetchFinal, type FinalOutcome, type FinalQuery } from "@/lib/final";
import { isRoll, ordinal } from "@/lib/naming";
import { FinalView } from "./final-view";
import { ArrowRight } from "./icons";
import { FailureMessage } from "./message";

type View =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; id: number; query: FinalQuery; outcome: FinalOutcome };

const digits = (v: string) => v.replace(/\D/g, "").slice(0, 10);

/** Reads ?batch=&sem=&exam_roll=&class_roll= so a result link can be shared. */
function readParams(sp: URLSearchParams) {
  const batch = BATCHES.includes(Number(sp.get("batch"))) ? Number(sp.get("batch")) : BATCHES[0];
  const semester = SEMESTERS.includes(Number(sp.get("sem"))) ? Number(sp.get("sem")) : DEFAULT_SEMESTER;
  const examRoll = digits(sp.get("exam_roll") ?? "");
  const classRoll = digits(sp.get("class_roll") ?? "");
  return { batch, semester, examRoll, classRoll, ready: isRoll(examRoll) && isRoll(classRoll) };
}

export function FinalLookup() {
  const searchParams = useSearchParams();
  const [init] = useState(() => readParams(searchParams));

  const [batch, setBatch] = useState(init.batch);
  const [semester, setSemester] = useState(init.semester);
  const [examRoll, setExamRoll] = useState(init.examRoll);
  const [classRoll, setClassRoll] = useState(init.classRoll);
  const [view, setView] = useState<View>(init.ready ? { kind: "loading" } : { kind: "idle" });
  const latest = useRef(0);

  // Opened from a shared link: look the result up straight away.
  useEffect(() => {
    if (!init.ready) return;
    const id = ++latest.current;
    const query = { batch: init.batch, semester: init.semester, examRoll: init.examRoll, classRoll: init.classRoll };
    void fetchFinal(query).then((outcome) => {
      if (id === latest.current) setView({ kind: "done", id, query, outcome });
    });
  }, [init]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query: FinalQuery = { batch, semester, examRoll: examRoll.trim(), classRoll: classRoll.trim() };
    if (!isRoll(query.examRoll) || !isRoll(query.classRoll)) return;

    const id = ++latest.current;
    setView({ kind: "loading" });
    const qs = new URLSearchParams({
      batch: String(batch), sem: String(semester), exam_roll: query.examRoll, class_roll: query.classRoll,
    });
    window.history.replaceState(null, "", `?${qs}`);

    const outcome = await fetchFinal(query);
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
              <label htmlFor="exam_roll" className="field-label">Exam Roll</label>
              <input
                id="exam_roll" className="field tabular-nums" inputMode="numeric" pattern="[0-9]{3,10}"
                minLength={3} maxLength={10} required autoComplete="off" placeholder="e.g. 26890"
                value={examRoll} onChange={(e) => setExamRoll(digits(e.target.value))}
              />
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
            <span>{loading ? "Looking up…" : "View my result"}</span>
            {!loading && <ArrowRight className="size-5" />}
          </button>
        </form>
      </div>

      {view.kind === "done" && (
        <div className="mt-10 sm:mt-14" key={view.id}>
          {view.outcome.kind === "found" ? (
            <FinalView result={view.outcome.result} batch={view.query.batch} semester={view.query.semester} />
          ) : (
            <FailureMessage
              failure={view.outcome}
              subject={`The final result for the ${ordinal(view.query.batch)} batch, ${ordinal(view.query.semester)} semester`}
              missing={{
                title: "No result found",
                text: "We couldn’t find a result for those details. Check that the batch, semester, exam roll and class roll are correct, and that both rolls belong to the same student.",
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
