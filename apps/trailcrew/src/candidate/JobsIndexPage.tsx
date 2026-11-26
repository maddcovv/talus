import { useState } from "react";
import { Link } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";
import { Select, SelectItem, TextField } from "@talus/react";
import { departmentNotes, departments, jobs } from "../fixtures/jobs";
import { PrintHero } from "../components/PrintHero";
import type { Job } from "../fixtures/types";
import styles from "./JobsIndexPage.module.css";

const locations = [...new Set(jobs.map((job) => job.location))];

function metaLine(job: Job): string {
  return [
    job.location,
    job.workplace === "On site" ? "On site" : null,
    job.type,
    `Posted ${job.postedShort}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function JobsIndexPage() {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [location, setLocation] = useState("all");

  const matches = jobs.filter(
    (job) =>
      (team === "all" || job.department === team) &&
      (location === "all" || job.location === location) &&
      (query.trim() === "" ||
        `${job.title} ${job.department}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  return (
    <article>
      <section data-kraft="" className={styles.heroBand}>
        <div className={styles.heroCopy}>
          <h1 className={styles.headline}>Build gear people trust a long way from the road.</h1>
          <p className={styles.sub}>
            We make packs, dry bags and camp hardware, and ship them from the same building. Four
            roles are open right now.
          </p>
          <div className={styles.ctaRow}>
            <a className={styles.cta} href="#roles">
              See the {jobs.length} open roles
            </a>
            <Link className={styles.how} to="/jobs/senior-frontend#hiring">
              How hiring works here
            </Link>
          </div>
          <p className={styles.where}>Hiring in Salida, Colorado and remote across the US.</p>
        </div>
        <PrintHero />
      </section>

      <section id="roles" className={styles.container} aria-label="Open roles">
        <div className={styles.rolesHead}>
          <h2 className={styles.h2}>Open roles</h2>
          <form className={styles.filters} onSubmit={(event) => event.preventDefault()}>
            <TextField
              label="Search"
              value={query}
              onChange={setQuery}
              placeholder="Title or keyword"
              className={styles.search}
            />
            <Select
              label="Team"
              selectedKey={team}
              onSelectionChange={(key) => setTeam(String(key))}
              className={styles.filterSelect}
            >
              <SelectItem id="all">All teams</SelectItem>
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
              className={styles.filterSelect}
            >
              <SelectItem id="all">Anywhere</SelectItem>
              {locations.map((item) => (
                <SelectItem key={item} id={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
          </form>
        </div>

        {matches.length === 0 ? (
          <p className={styles.empty}>No roles match those filters. Clear one and look again.</p>
        ) : null}

        {departments.map((dept) => {
          const inDept = matches.filter((job) => job.department === dept);
          if (inDept.length === 0) return null;
          const headingId = `team-${dept.toLowerCase().replace(/[^a-z]+/g, "-")}`;
          return (
            <section key={dept} aria-labelledby={headingId} className={styles.group}>
              <div>
                <h3 id={headingId} className={styles.groupName}>
                  {dept}
                </h3>
                <p className={styles.groupNote}>{departmentNotes[dept]}</p>
              </div>
              <div className={styles.groupJobs}>
                {inDept.map((job) => (
                  <Link key={job.id} to={`/jobs/${job.id}`} className={styles.row}>
                    <div className={styles.rowGrid}>
                      <div>
                        <div className={styles.rowTitle}>{job.title}</div>
                        <div className={styles.rowMeta}>{metaLine(job)}</div>
                      </div>
                      <div>
                        <div className={styles.rowPay}>{job.pay}</div>
                        <div className={styles.rowDeadline}>
                          {job.deadlineShort ? `Apply by ${job.deadlineShort}` : "Open until filled"}
                        </div>
                      </div>
                      <CaretRight aria-hidden weight="bold" className={styles.chevron} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <section className={styles.manifestoBand} aria-label="How we hire">
        <div className={styles.manifestoInner}>
          <p className={styles.manifesto}>
            We post the <span className={styles.mark}>whole pay range</span>. We{" "}
            <span className={styles.mark}>answer every applicant</span>, and you can check where
            you stand any time. AI can fill out your form, but{" "}
            <span className={styles.mark}>a person makes every call</span>.
          </p>
          <p className={styles.signed}>
            Signed, the sixty people in Salida and around the country who&apos;d be working with
            you.
          </p>
        </div>
      </section>
    </article>
  );
}
