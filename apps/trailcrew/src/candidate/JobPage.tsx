import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card } from "@talus/react";
import type { Job } from "../fixtures/types";
import { employer, getJob, hiringStops, payNote } from "../fixtures/jobs";
import styles from "./JobPage.module.css";

function factsFor(job: Job): Array<{ label: string; value: string }> {
  return [
    { label: "Team", value: job.department },
    { label: "Pay", value: job.pay },
    { label: "Where", value: job.whereLine },
    { label: "Schedule", value: job.scheduleShort },
    { label: "Apply by", value: job.deadline ?? "Open until filled" },
  ];
}

export function JobPage() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const navigate = useNavigate();
  if (!job) {
    return (
      <div className={styles.missing}>
        <p>
          That job is not open. <Link to="/">See all open roles.</Link>
        </p>
      </div>
    );
  }
  const apply = () => navigate(`/jobs/${job.id}/apply`);
  const mbarLine = job.deadlineShort
    ? `Apply by ${job.deadlineShort} · about 4 minutes`
    : "Open until filled · about 4 minutes";

  return (
    <article>
      <section data-kraft="" className={styles.hero}>
        <img
          src="/img/tts-hero.jpg"
          alt=""
          aria-hidden="true"
          className={styles.heroPrint}
        />
        <div className={styles.heroInner}>
          <Link to="/" className={styles.back}>
            All open roles
          </Link>
          <h1 className={styles.title}>{job.title}</h1>
          <dl className={styles.facts}>
            {factsFor(job).map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className={styles.cols}>
        <div className={styles.body}>
          <h2 className={styles.sec}>About the role</h2>
          {job.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.para}>
              {paragraph}
            </p>
          ))}
          <p className={styles.paraLast}>{job.team}</p>

          <h2 className={styles.sec}>What you&apos;ll do</h2>
          <ul className={styles.list}>
            {job.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className={styles.sec}>What you need</h2>
          <ul className={styles.list}>
            {job.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className={styles.nice}>Nice to have</h3>
          <ul className={styles.list}>
            {job.niceToHave.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {job.conditions ? (
            <>
              <h2 className={styles.sec}>Physical requirements and schedule</h2>
              <ul className={styles.list}>
                {job.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.paraTop}>{job.schedule}</p>
            </>
          ) : null}

          <h2 className={styles.sec} id="hiring">
            How hiring works here
          </h2>
          <p className={styles.stopsLede}>
            Four stops, and you can see which one you&apos;re at on your status page the whole way.
          </p>
          <ol className={styles.stops}>
            {hiringStops.map((stop, index) => (
              <li key={stop.n} className={styles.stop}>
                <div className={styles.stopRail}>
                  {index < hiringStops.length - 1 ? (
                    <>
                      <span className={`${styles.stopLine} ${styles.stopLineA}`} aria-hidden="true" />
                      <span className={`${styles.stopLine} ${styles.stopLineB}`} aria-hidden="true" />
                    </>
                  ) : null}
                  <span className={styles.stopDot}>{stop.n}</span>
                </div>
                <div>
                  <div className={styles.stopTitle}>{stop.title}</div>
                  <div className={styles.stopBody}>{stop.body}</div>
                </div>
              </li>
            ))}
          </ol>

          <h2 className={styles.sec} id="benefits">
            Pay and benefits
          </h2>
          <p className={styles.para}>
            <strong>{job.pay}</strong>
            {job.payPlus ? `, ${job.payPlus}` : "."}
          </p>
          <p className={styles.payNote}>{payNote}</p>
          <ul className={styles.list}>
            {job.benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className={styles.sec}>About {employer.name}</h2>
          {employer.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.para}>
              {paragraph}
            </p>
          ))}

          <div className={styles.finePrint}>
            <p>
              <strong className={styles.fineStrong}>How to apply.</strong> Use the Apply button on
              this page. A resume is all you need to start.{" "}
              {job.deadline
                ? `Applications close ${job.deadline}.`
                : "We accept applications on an ongoing basis."}
            </p>
            <p>
              Two Track Supply is an equal opportunity employer. We consider every qualified
              applicant without regard to race, color, religion, sex, sexual orientation, gender
              identity, national origin, age, disability or veteran status.
            </p>
            <p>
              Need an accommodation at any point? Email{" "}
              <a href="mailto:jobs@twotracksupply.example">jobs@twotracksupply.example</a> or ask
              for a person from your status page.
            </p>
            <p>
              This description covers the main work of the role, not every task. {job.flsa}{" "}
              {"·"} Posted {job.postedOn} {"·"} Job {job.jobCode}
            </p>
          </div>
        </div>

        <aside className={styles.rail} aria-label="Pay and apply">
          <Card variant="feature" padding={false} className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.cardLabel}>Pay</div>
              <div className={styles.cardPay}>{job.payShort}</div>
              <div className={styles.cardTail}>{job.payTail}</div>
              <div className={styles.deadlineRow}>
                <span className={styles.dot} aria-hidden="true" />
                {job.applyLine}
              </div>
              <Button size="lg" onPress={apply} className={styles.applyBtn}>
                Apply now
              </Button>
              <p className={styles.minutes}>About 4 minutes with your resume</p>
            </div>
            <div className={styles.cardInfo}>
              <strong>How AI helps here.</strong> It can fill the form from your resume and shows
              you where every answer came from. You check it all. A person reads every application.
            </div>
          </Card>
        </aside>
      </div>

      <div className={styles.mbar}>
        <div>
          <div className={styles.mbarPay}>{job.payShort}</div>
          <div className={styles.mbarLine}>{mbarLine}</div>
        </div>
        <Button onPress={apply}>Apply now</Button>
      </div>
    </article>
  );
}
