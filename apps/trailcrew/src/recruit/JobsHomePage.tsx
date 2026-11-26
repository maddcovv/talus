import { Link, useNavigate } from "react-router-dom";
import { Button } from "@talus/react";
import { Blaze } from "../components/Blaze";
import { candidatesForJob, needsDana } from "../fixtures/candidates";
import { closedJobs, jobs } from "../fixtures/jobs";
import { stageOrder, type StageId } from "../fixtures/types";
import styles from "./JobsHomePage.module.css";

const stageWord: Record<StageId, string> = {
  applied: "applied",
  review: "in review",
  interview: "interviewing",
  offer: "at offer",
  hired: "hired",
  closed: "closed",
};

function RoleTracks({ jobId }: { jobId: string }) {
  const inPlay = candidatesForJob(jobId).filter(
    (candidate) => candidate.stage !== "closed" && candidate.stage !== "hired",
  );
  const counts = stageOrder
    .filter((stage) => stage !== "hired")
    .map((stage) => ({
      stage,
      count: inPlay.filter((candidate) => candidate.stage === stage).length,
    }));
  const words = counts
    .filter((entry) => entry.count > 0)
    .map((entry) => `${entry.count} ${stageWord[entry.stage]}`)
    .join(", ");
  return (
    <div>
      <div className={styles.roleBar} aria-hidden="true">
        {[0, 1].map((lane) => (
          <div key={lane} className={styles.roleLane}>
            {counts
              .filter((entry) => entry.count > 0)
              .map((entry) => (
                <span
                  key={entry.stage}
                  className={styles.roleSeg}
                  style={{ flexGrow: entry.count }}
                />
              ))}
          </div>
        ))}
      </div>
      <p className={styles.roleWords}>
        {inPlay.length === 0
          ? "No one in the running yet."
          : `${inPlay.length} in the running: ${words}`}
      </p>
    </div>
  );
}

export function JobsHomePage() {
  const navigate = useNavigate();
  return (
    <article>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Jobs</h1>
          <p className={styles.meta}>
            {jobs.length} open roles on the careers site. The role decides who reads what, so
            everything lives under one.
          </p>
        </div>
        <Button variant="secondary" onPress={() => navigate("/recruit/jobs/new")}>
          New job
        </Button>
      </header>

      <section aria-labelledby="open-h" className={styles.group}>
        <h2 id="open-h" className={styles.groupTitle}>
          Open
        </h2>
        <ul className={styles.rows}>
          {jobs.map((job) => {
            const needs = candidatesForJob(job.id).filter(needsDana).length;
            return (
              <li key={job.id} className={styles.rowItem}>
                <Link to={`/recruit/jobs/${job.id}`} className={styles.row}>
                  <span className={styles.rowMain}>
                    <span className={styles.rowTitle}>{job.title}</span>
                    <span className={styles.rowMeta}>
                      {job.department} {"·"} Posted {job.postedShort} {"·"}{" "}
                      {job.deadlineShort ? `Closes ${job.deadlineShort}` : "Open until filled"}
                    </span>
                    <RoleTracks jobId={job.id} />
                  </span>
                  <span className={styles.rowNeeds}>
                    {needs > 0 ? (
                      <>
                        <Blaze variant="double" className={styles.rowBlaze} />
                        {needs === 1 ? "1 needs you" : `${needs} need you`}
                      </>
                    ) : (
                      <span className={styles.rowClear}>Nothing waiting</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="closed-h" className={styles.group}>
        <h2 id="closed-h" className={styles.groupTitle}>
          Recently closed
        </h2>
        <ul className={styles.rows}>
          {closedJobs.map((job) => (
            <li key={job.id} className={styles.closedRow}>
              <span className={styles.closedTitle}>{job.title}</span>
              <span className={styles.rowMeta}>
                {job.note} Closed {job.closedOn}.
              </span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
