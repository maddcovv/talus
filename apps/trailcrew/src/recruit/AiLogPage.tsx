import { Link, useParams } from "react-router-dom";
import { Button } from "@talus/react";
import { aiLogCsv, aiLogForJob } from "../fixtures/ailog";
import { getJob } from "../fixtures/jobs";
import { ActivityTable } from "./AiActivityPage";
import styles from "./AiActivityPage.module.css";

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
  const rows = aiLogForJob(jobId);

  function exportCsv() {
    const blob = new Blob([aiLogCsv(rows)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${jobId}-ai-activity.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>AI activity</h1>
          <p className={styles.summary}>
            {job.title}. Every place AI touched a candidate, and the person who checked it.{" "}
            <Link to={`/recruit/jobs/${jobId}`}>Back to the pipeline.</Link>
          </p>
        </div>
        <Button variant="secondary" onPress={exportCsv}>
          Export CSV
        </Button>
      </header>
      <ActivityTable rows={rows} showJob={false} />
    </article>
  );
}
