import { useState } from "react";
import { Link } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";
import { Select, SelectItem, TextField } from "@talus/react";
import { departments, employer, jobs } from "../fixtures/jobs";
import styles from "./JobsIndexPage.module.css";

const locations = [...new Set(jobs.map((job) => job.location))];
const types = [...new Set(jobs.map((job) => job.type))];

export function JobsIndexPage() {
  const [department, setDepartment] = useState("all");
  const [location, setLocation] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");

  const matches = jobs.filter(
    (job) =>
      (department === "all" || job.department === department) &&
      (location === "all" || job.location === location) &&
      (type === "all" || job.type === type) &&
      (query.trim() === "" ||
        `${job.title} ${job.department}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  return (
    <article>
      <div className={styles.band}>
        <div className={styles.bandInner}>
          <h1 className={styles.title}>Work at {employer.name}</h1>
          <p className={styles.blurb}>{employer.blurb}</p>
          <p className={styles.count}>
            {jobs.length} open roles. Real pay on every posting, and an answer to every applicant.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.filters}>
          <Select
            label="Department"
            selectedKey={department}
            onSelectionChange={(key) => setDepartment(String(key))}
          >
            <SelectItem id="all">All departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} id={dept}>
                {dept}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Location"
            selectedKey={location}
            onSelectionChange={(key) => setLocation(String(key))}
          >
            <SelectItem id="all">All locations</SelectItem>
            {locations.map((item) => (
              <SelectItem key={item} id={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <Select label="Type" selectedKey={type} onSelectionChange={(key) => setType(String(key))}>
            <SelectItem id="all">All types</SelectItem>
            {types.map((item) => (
              <SelectItem key={item} id={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <TextField
            label="Search jobs"
            value={query}
            onChange={setQuery}
            placeholder="Title or team"
            className={styles.search}
          />
        </div>

        {matches.length === 0 ? (
          <p className={styles.empty}>
            No roles match those filters. Clear one, or check back; new roles post here first.
          </p>
        ) : null}

        {departments.map((dept) => {
          const inDept = matches.filter((job) => job.department === dept);
          if (inDept.length === 0) return null;
          const headingId = `dept-${dept.toLowerCase().replace(/[^a-z]+/g, "-")}`;
          return (
            <section key={dept} aria-labelledby={headingId} className={styles.group}>
              <h2 id={headingId} className={styles.h2}>
                {dept}
              </h2>
              <ul className={styles.rows}>
                {inDept.map((job) => (
                  <li key={job.id} className={styles.rowItem}>
                    <Link to={`/jobs/${job.id}`} className={styles.row}>
                      <span className={styles.rowMain}>
                        <span className={styles.rowTitle}>{job.title}</span>
                        <span className={styles.rowMeta}>
                          {job.location} {"·"} {job.type} {"·"} Posted {job.postedOn}
                        </span>
                      </span>
                      <span className={styles.rowPay}>{job.pay}</span>
                      <CaretRight aria-hidden className={styles.chevron} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <p className={styles.aside}>
          Hiring here? See the <Link to="/recruit">recruiter side of Trailcrew</Link>.
        </p>
      </div>
    </article>
  );
}
