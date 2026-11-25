import { Link, useNavigate } from "react-router-dom";
import { Card, Tag } from "@talus/react";
import { employer, jobs } from "../fixtures/jobs";
import styles from "./JobsIndexPage.module.css";

export function JobsIndexPage() {
  const navigate = useNavigate();
  return (
    <article>
      <h1 className={styles.title}>Work at {employer.name}</h1>
      <p className={styles.blurb}>{employer.blurb}</p>
      <ul className={styles.list}>
        {jobs.map((job) => (
          <li key={job.id}>
            <Card onPress={() => navigate(`/jobs/${job.id}`)}>
              <div className={styles.jobRow}>
                <span className={styles.jobTitle}>{job.title}</span>
                <span className={styles.jobMeta}>
                  {job.type === "Remote, US" ? (
                    <Tag>{job.location}</Tag>
                  ) : (
                    <>
                      <Tag>{job.type}</Tag>
                      <Tag>{job.location}</Tag>
                    </>
                  )}
                </span>
                <span className={styles.jobPay}>{job.pay}</span>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <p className={styles.aside}>
        Hiring here? See the <Link to="/recruit">recruiter side of Trailcrew</Link>.
      </p>
    </article>
  );
}
