import { Button, DataTable, type DataTableColumn } from "@talus/react";
import { aiLogCsv, aiLogForJob } from "../fixtures/ailog";
import { jobs } from "../fixtures/jobs";
import type { AiLogEntry } from "../fixtures/types";
import styles from "./AiLogPage.module.css";

interface ActivityRow extends AiLogEntry {
  job: string;
}

const columns: DataTableColumn[] = [
  { key: "when", label: "When" },
  { key: "job", label: "Job" },
  { key: "where", label: "Candidate or place" },
  { key: "what", label: "What AI did" },
  { key: "reviewedBy", label: "Reviewed by" },
];

function day(when: string): number {
  return Number.parseInt(when.replace("Nov ", ""), 10) || 0;
}

export function AiActivityPage() {
  const entries: ActivityRow[] = jobs
    .flatMap((job) => aiLogForJob(job.id).map((entry) => ({ ...entry, job: job.title })))
    .sort((a, b) => day(b.when) - day(a.when));

  function exportCsv() {
    const blob = new Blob([aiLogCsv(entries)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "trailcrew-ai-activity.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>AI activity</h1>
          <p className={styles.meta}>
            Every place AI touched a candidate, across every job, and the person who reviewed it.
            AI never decides; this log is how you can tell.
          </p>
        </div>
        <Button variant="secondary" onPress={exportCsv}>
          Export CSV
        </Button>
      </div>
      <DataTable
        aria-label="AI activity across all jobs"
        columns={columns}
        items={entries}
        renderCell={(entry: ActivityRow, key) => entry[key as keyof ActivityRow]}
        emptyState="AI has not touched anything yet."
      />
    </article>
  );
}
