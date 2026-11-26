import { useState } from "react";
import { Button, Select, SelectItem } from "@talus/react";
import { aiLog, aiLogCsv, aiSummary, type AiLogRow } from "../fixtures/ailog";
import { jobs } from "../fixtures/jobs";
import styles from "./AiActivityPage.module.css";

type ActionFilter = "all" | "fill" | "evidence" | "posting";

function matchesAction(row: AiLogRow, action: ActionFilter): boolean {
  if (action === "all") return true;
  if (action === "fill") return row.what.startsWith("Filled");
  if (action === "evidence") return row.what.startsWith("Suggested");
  return row.what.startsWith("Drafted");
}

/** The day-grouped audit table, shared with the per-job log page. */
export function ActivityTable({ rows, showJob }: { rows: AiLogRow[]; showJob: boolean }) {
  const days = [...new Set(rows.map((row) => row.day))];
  if (rows.length === 0) {
    return <p className={styles.empty}>Nothing in the log for these filters.</p>;
  }
  return (
    <div>
      {days.map((day) => (
        <section key={day} aria-label={day} className={styles.day}>
          <h2 className={styles.dayHead}>{day}</h2>
          <ul className={styles.rows}>
            {rows
              .filter((row) => row.day === day)
              .map((row) => (
                <li key={row.id} className={styles.row}>
                  <span className={styles.what}>
                    {row.what}
                    {showJob ? <span className={styles.job}> {"·"} {row.job}</span> : null}
                  </span>
                  <span className={styles.check}>{row.check}</span>
                  <span className={styles.when}>{row.when}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function AiActivityPage() {
  const [jobFilter, setJobFilter] = useState("all");
  const [action, setAction] = useState<ActionFilter>("all");

  const rows = aiLog.filter(
    (row) =>
      (jobFilter === "all" || row.jobId === jobFilter) && matchesAction(row, action),
  );

  function exportCsv() {
    const blob = new Blob([aiLogCsv(rows)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "trailcrew-ai-activity.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>AI activity</h1>
          <p className={styles.summary}>{aiSummary} AI never decides; this log is how you can tell.</p>
        </div>
        <Button variant="secondary" onPress={exportCsv}>
          Export CSV
        </Button>
      </header>

      <div className={styles.filters}>
        <Select
          label="Job"
          selectedKey={jobFilter}
          onSelectionChange={(key) => setJobFilter(String(key))}
        >
          <SelectItem id="all">All jobs</SelectItem>
          {jobs.map((job) => (
            <SelectItem key={job.id} id={job.id}>
              {job.title}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="What AI did"
          selectedKey={action}
          onSelectionChange={(key) => setAction(key as ActionFilter)}
        >
          <SelectItem id="all">Everything</SelectItem>
          <SelectItem id="fill">Filled applications</SelectItem>
          <SelectItem id="evidence">Suggested evidence</SelectItem>
          <SelectItem id="posting">Drafted postings</SelectItem>
        </Select>
      </div>

      <ActivityTable rows={rows} showJob={jobFilter === "all"} />
    </article>
  );
}
