"use client";

import Form from "next/form";
import { useState } from "react";
import type { BatchOption } from "@/lib/folio";
import { ArrowRight } from "./icons";

type Props = {
  batches: BatchOption[];
  defaults: { batchId: number; examId: number; examRoll: string; classRoll: string };
};

export function LookupForm({ batches, defaults }: Props) {
  const [batchId, setBatchId] = useState(defaults.batchId);
  const [examId, setExamId] = useState(defaults.examId);

  const exams = batches.find((b) => b.id === batchId)?.exams ?? [];

  function onBatchChange(id: number) {
    setBatchId(id);
    const first = batches.find((b) => b.id === id)?.exams[0];
    if (first) setExamId(first.id);
  }

  return (
    <Form action="" scroll={false} className="card-glass p-5 sm:p-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-6 sm:gap-5">
        <div className="col-span-2 sm:col-span-2">
          <label htmlFor="batch" className="field-label">Batch</label>
          <select
            id="batch"
            name="batch"
            className="field"
            value={batchId}
            onChange={(e) => onBatchChange(Number(e.target.value))}
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-4">
          <label htmlFor="exam" className="field-label">Exam</label>
          <select
            id="exam"
            name="exam"
            className="field"
            value={examId}
            onChange={(e) => setExamId(Number(e.target.value))}
          >
            {exams.map((x) => (
              <option key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="exam_roll" className="field-label">Exam Roll</label>
          <input
            id="exam_roll"
            name="exam_roll"
            className="field tabular-nums"
            inputMode="numeric"
            pattern="[0-9]{3,10}"
            maxLength={10}
            minLength={3}
            required
            autoComplete="off"
            placeholder="e.g. 26101"
            defaultValue={defaults.examRoll}
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="class_roll" className="field-label">Class Roll</label>
          <input
            id="class_roll"
            name="class_roll"
            className="field tabular-nums"
            inputMode="numeric"
            pattern="[0-9]{3,10}"
            maxLength={10}
            minLength={3}
            required
            autoComplete="off"
            placeholder="e.g. 32085"
            defaultValue={defaults.classRoll}
          />
        </div>
      </div>

      <button type="submit" className="btn-gold mt-6 w-full text-base sm:mt-7">
        <span>View my result</span>
        <ArrowRight className="size-5" />
      </button>
    </Form>
  );
}
