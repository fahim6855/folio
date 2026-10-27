import type { Failure } from "@/lib/failure";
import { Hourglass, SearchOff } from "./icons";
import { ScrollToResult } from "./scroll-to-result";

/** A centred glass card with an icon, a title and a sentence. */
export function Message({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card-glass mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 py-10 text-center sm:px-10">
      <span className="tile-emerald size-14">{icon}</span>
      <h2 className="font-display text-2xl font-semibold text-folio-900">{title}</h2>
      <p className="max-w-md text-folio-800/80">{children}</p>
    </div>
  );
}

/**
 * Explains every way a lookup can fail, in plain words.
 *   subject  – what was being looked up, e.g. "The final result for the 32nd batch, 1st semester"
 *   missing  – title + text for "table exists but this student isn't in it"
 */
export function FailureMessage({
  failure,
  subject,
  missing,
}: {
  failure: Failure;
  subject: string;
  missing: { title: string; text: string };
}) {
  let body: React.ReactNode;
  switch (failure.kind) {
    case "missing":
      body = (
        <Message icon={<SearchOff className="size-7" />} title={missing.title}>
          {missing.text}
        </Message>
      );
      break;
    case "unpublished":
      body = (
        <Message icon={<Hourglass className="size-7" />} title="Not published yet">
          {subject} hasn’t been published yet. Please check back soon.
        </Message>
      );
      break;
    case "invalid":
      body = (
        <Message icon={<SearchOff className="size-7" />} title="Check your roll numbers">
          Rolls should contain digits only, for example 26101 and 32085.
        </Message>
      );
      break;
    case "column":
      body = (
        <Message icon={<Hourglass className="size-7" />} title="Table setup problem">
          The table <b className="font-semibold">{failure.table}</b> is missing the column{" "}
          <b className="font-semibold">{failure.column}</b>. Add that column in Supabase, or check the course
          settings in config/courses.json.
        </Message>
      );
      break;
    default:
      body = (
        <Message icon={<Hourglass className="size-7" />} title="Couldn’t load the data">
          {failure.notConfigured
            ? "This page isn’t connected to its database yet."
            : "Something went wrong while fetching the data. Please try again in a moment."}
        </Message>
      );
  }
  return (
    <section aria-live="polite">
      <ScrollToResult />
      {body}
    </section>
  );
}
