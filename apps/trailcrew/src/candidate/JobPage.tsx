import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  CalendarBlank,
  Clock,
  CurrencyCircleDollar,
  MapPin,
} from "@phosphor-icons/react";
import { Button, DescriptionList, InlineAlert } from "@talus/react";
import type { Job } from "../fixtures/types";
import { employer, finePrint, getJob, howToApply, payNote } from "../fixtures/jobs";
import styles from "./JobPage.module.css";

function deadlineWords(job: Job): string {
  return job.deadline
    ? `Applications close ${job.deadline}.`
    : "We accept applications on an ongoing basis.";
}

function SummaryCard({ job, onApply }: { job: Job; onApply: () => void }) {
  return (
    <div className={styles.card}>
      <DescriptionList
        aria-label="Key facts"
        items={[
          { icon: <CurrencyCircleDollar />, label: "Pay", value: job.pay },
          { icon: <MapPin />, label: "Location", value: job.location },
          {
            icon: <Briefcase />,
            label: "Work type",
            value: `${job.type}, ${job.workplace.toLowerCase()}`,
          },
          { icon: <Clock />, label: "Schedule", value: job.scheduleShort },
          { icon: <CalendarBlank />, label: "Application deadline", value: deadlineWords(job) },
        ]}
      />
      <Button onPress={onApply} className={styles.cardButton}>
        Apply
      </Button>
      <p className={styles.cardNote}>
        Takes about ten minutes. AI can fill most of it from your resume, and you check every field
        before anything is sent.
      </p>
    </div>
  );
}

export function JobPage() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const navigate = useNavigate();
  if (!job) {
    return (
      <div className={styles.container}>
        <p>
          That job is not open. <Link to="/">See all open jobs.</Link>
        </p>
      </div>
    );
  }
  const apply = () => navigate(`/jobs/${job.id}/apply`);

  return (
    <article className={styles.container}>
      <p className={styles.crumbs}>
        <Link to="/">All open jobs</Link>
      </p>
      <div className={styles.layout}>
        <div className={styles.main}>
          <p className={styles.employer}>
            {employer.name} {"·"} {job.department}
          </p>
          <h1 className={styles.title}>{job.title}</h1>

          <div className={styles.summaryMobile}>
            <SummaryCard job={job} onApply={apply} />
          </div>

          <h2 className={styles.h2}>About {employer.name}</h2>
          {employer.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.body}>
              {paragraph}
            </p>
          ))}

          <h2 className={styles.h2}>About the role</h2>
          {job.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.lede}>
              {paragraph}
            </p>
          ))}
          <p className={styles.body}>{job.team}</p>

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

          {job.conditions ? (
            <>
              <h2 className={styles.h2}>Physical requirements</h2>
              <ul className={styles.list}>
                {job.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}

          <h2 className={styles.h2}>Schedule</h2>
          <p className={styles.body}>{job.schedule}</p>

          <h2 className={styles.h2}>Pay</h2>
          <p className={styles.pay}>{job.pay}</p>
          {job.bonusNote ? <p className={styles.body}>{job.bonusNote}</p> : null}
          <p className={styles.payNote}>{payNote}</p>

          <h2 className={styles.h2}>Benefits</h2>
          <ul className={styles.list}>
            {job.benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className={styles.h2}>Application deadline</h2>
          <p className={styles.body}>{deadlineWords(job)}</p>

          <h2 className={styles.h2}>How to apply</h2>
          <p className={styles.body}>{howToApply}</p>
          <div className={styles.applyRow}>
            <Button onPress={apply}>Apply</Button>
          </div>

          <InlineAlert variant="info" title="How Trailcrew uses AI">
            AI can fill this form from your resume. You review every field before anything is sent.
            A person reviews every application.
          </InlineAlert>

          <div className={styles.finePrint}>
            {finePrint.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <h2 className={styles.h2}>About this posting</h2>
          <DescriptionList
            aria-label="About this posting"
            className={styles.meta}
            items={[
              { label: "Department", value: job.department },
              { label: "Employment type", value: job.type },
              { label: "Workplace", value: job.workplace },
              { label: "Overtime status", value: job.flsa },
              { label: "Posted", value: job.postedOn },
              { label: "Job ID", value: job.jobCode },
            ]}
          />
        </div>

        <aside className={styles.rail} aria-label="Job summary">
          <SummaryCard job={job} onApply={apply} />
        </aside>
      </div>

      <div className={styles.applyBar}>
        <span className={styles.applyBarPay}>{job.pay}</span>
        <Button onPress={apply}>Apply</Button>
      </div>
    </article>
  );
}
