import { Link, useNavigate } from "react-router-dom";
import { Button } from "@talus/react";
import { Blaze } from "../components/Blaze";
import { candidatesForJob, needsDana } from "../fixtures/candidates";
import { closedJobs, jobs } from "../fixtures/jobs";
import styles from "./JobsHomePage.module.css";

/**
 * The numbers a hiring manager actually asks for, and they add up:
 * applied = not reviewed + in review + gotten through + rejected.
 */
function countsFor(jobId: string) {
  const all = candidatesForJob(jobId);
  return {
    applied: all.length,
    notReviewed: all.filter((candidate) => candidate.stage === "applied").length,
    inReview: all.filter((candidate) => candidate.stage === "review").length,
    through: all.filter(
      (candidate) =>
        candidate.stage === "interview" ||
        candidate.stage === "offer" ||
        candidate.stage === "hired",
    ).length,
    rejected: all.filter((candidate) => candidate.stage === "closed").length,
  };
}

function StatStrip({ jobId, title }: { jobId: string; title: string }) {
  const counts = countsFor(jobId);
  const stats = [
    { label: "Applied", value: counts.applied, lead: true },
    { label: "Not reviewed", value: counts.notReviewed },
    { label: "In review", value: counts.inReview },
    { label: "Gotten through", value: counts.through },
    { label: "Rejected", value: counts.rejected },
  ];
  return (
    <ul className={styles.stats} aria-label={`Where ${title} stands`}>
      {stats.map((stat) => (
        <li key={stat.label} className={`${styles.stat} ${stat.lead ? styles.statLead : ""}`}>
          <span className={styles.statNum}>{stat.value}</span>
          <span className={styles.statLabel}>{stat.label}</span>
        </li>
      ))}
    </ul>
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
            {jobs.length} open roles on the careers site. Pick the one you&apos;re reviewing
            today.
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
                  <StatStrip jobId={job.id} title={job.title} />
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
