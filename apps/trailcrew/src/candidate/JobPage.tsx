import { Link, useNavigate, useParams } from "react-router-dom";
import { Briefcase, CurrencyCircleDollar, MapPin } from "@phosphor-icons/react";
import { Button, InlineAlert } from "@talus/react";
import type { Job } from "../fixtures/types";
import { employer, finePrint, getJob, payNote } from "../fixtures/jobs";
import styles from "./JobPage.module.css";

function JobMeta({ job }: { job: Job }) {
  return (
    <ul className={styles.meta} aria-label="Location, type and pay">
      <li>
        <MapPin aria-hidden className={styles.metaIcon} />
        {job.location}
      </li>
      <li>
        <Briefcase aria-hidden className={styles.metaIcon} />
        {job.type}
      </li>
      <li>
        <CurrencyCircleDollar aria-hidden className={styles.metaIcon} />
        {job.pay}
      </li>
    </ul>
  );
}

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
      <JobMeta job={job} />
      <div className={styles.applyRow}>
        <Button onPress={() => navigate(`/jobs/${job.id}/apply`)}>Apply</Button>
        <span className={styles.applyNote}>
          Takes about ten minutes. AI can fill most of it from your resume.
        </span>
      </div>

      <section aria-label="The role">
        {job.summary.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className={styles.lede}>
            {paragraph}
          </p>
        ))}
      </section>

      <h2 className={styles.h2}>About {employer.name}</h2>
      {employer.about.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className={styles.body}>
          {paragraph}
        </p>
      ))}

      <h2 className={styles.h2}>What you&apos;ll do</h2>
      <ul className={styles.list}>
        {job.responsibilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className={styles.h2}>What you need</h2>
      <ul className={styles.list}>
        {job.requirements.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className={styles.h2}>Nice to have</h2>
      <ul className={styles.list}>
        {job.niceToHave.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className={styles.h2}>Pay and benefits</h2>
      <p className={styles.pay}>{job.pay}</p>
      <p className={styles.payNote}>{payNote}</p>
      <ul className={styles.list}>
        {job.benefits.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className={styles.h2}>Schedule and location</h2>
      <p className={styles.body}>{job.schedule}</p>
      {job.conditions ? (
        <ul className={styles.list}>
          {job.conditions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      <div className={styles.applyRow}>
        <Button onPress={() => navigate(`/jobs/${job.id}/apply`)}>Apply</Button>
      </div>
      <InlineAlert variant="info" title="How Trailcrew uses AI">
        AI can fill this form from your resume. You review every field before anything is sent. A
        person reviews every application.
      </InlineAlert>
      <div className={styles.finePrint}>
        {finePrint.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
