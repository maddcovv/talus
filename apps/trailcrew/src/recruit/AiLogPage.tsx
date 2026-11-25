import { Link, useParams } from "react-router-dom";
import { Button, DataTable, type DataTableColumn } from "@talus/react";
import { aiLogCsv, aiLogForJob } from "../fixtures/ailog";
import { getJob } from "../fixtures/jobs";
import type { AiLogEntry } from "../fixtures/types";
import styles from "./AiLogPage.module.css";

const columns: DataTableColumn[] = [
  { key: "when", label: "When" },
  { key: "where", label: "Candidate or place" },
  { key: "what", label: "What AI did" },
  { key: "reviewedBy", label: "Reviewed by" },
  { key: "reviewedOn", label: "Reviewed on" },
];

export function AiLogPage() {
  const { jobId = "" } = useParams();
  const job = getJob(jobId);
  if (!job) {
    return (
      <p>
        That job does not exist. <Link to="/recruit">Back to Today.</Link>
      </p>
    );
  }
  const entries = aiLogForJob(jobId);

  function exportCsv() {
    const blob = new Blob([aiLogCsv(entries)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${jobId}-ai-activity.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>AI activity</h1>
          <p className={styles.meta}>
            {job.title}. Every place AI touched a candidate, and the person who reviewed it.{" "}
            <Link to={`/recruit/jobs/${jobId}`}>Back to the pipeline.</Link>
          </p>
        </div>
        <Button variant="secondary" onPress={exportCsv}>
          Export CSV
        </Button>
      </div>
      <DataTable
        aria-label={`AI activity for ${job.title}`}
        columns={columns}
        items={entries}
        renderCell={(entry: AiLogEntry, key) => entry[key as keyof AiLogEntry]}
        emptyState="AI has not touched this job."
      />
    </article>
  );
}
