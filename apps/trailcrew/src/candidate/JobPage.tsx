import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, InlineAlert, Tag } from "@talus/react";
import { employer, getJob } from "../fixtures/jobs";
import styles from "./JobPage.module.css";

export function JobPage() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const navigate = useNavigate();
  if (!job) {
    return (
      <p>
        That job is not open. <Link to="/">See all open jobs.</Link>
      </p>
    );
  }
  return (
    <article>
      <p className={styles.employer}>{employer.name}</p>
      <h1 className={styles.title}>{job.title}</h1>
      <div className={styles.meta}>
        {job.type !== "Remote, US" ? <Tag>{job.type}</Tag> : null}
        <Tag>{job.location}</Tag>
        <Tag>{job.pay}</Tag>
      </div>
      <section aria-label="What the job is">
        {job.summary.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className={styles.body}>
            {paragraph}
          </p>
        ))}
      </section>
      <section aria-labelledby="need-heading">
        <h2 id="need-heading" className={styles.h2}>
          What you need
        </h2>
        <ul className={styles.needs}>
          {job.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </section>
      <div className={styles.applyRow}>
        <Button onPress={() => navigate(`/jobs/${job.id}/apply`)}>Apply</Button>
      </div>
      <InlineAlert variant="info" title="How Trailcrew uses AI">
        AI can fill this form from your resume. You review every field before anything is sent. A
        person reviews every application.
      </InlineAlert>
    </article>
  );
}
