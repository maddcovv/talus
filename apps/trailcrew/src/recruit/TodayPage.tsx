import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Toast, ToastRegion } from "@talus/react";
import { Blaze } from "../components/Blaze";
import { Tally } from "../components/Tally";
import { candidates, candidatesForJob } from "../fixtures/candidates";
import { demoToday } from "../fixtures/demo";
import { getJob, jobs, recruiters } from "../fixtures/jobs";
import { stageOrder, type Candidate, type StageId } from "../fixtures/types";
import styles from "./TodayPage.module.css";

/** "Waiting in review", never "in In review". */
const stagePhrase: Record<StageId, string> = {
  applied: "in Applied",
  review: "in review",
  interview: "in Interview",
  offer: "at Offer",
  hired: "hired",
  closed: "closed",
};

const stageWord: Record<StageId, string> = {
  applied: "applied",
  review: "in review",
  interview: "interviewing",
  offer: "at offer",
  hired: "hired",
  closed: "closed",
};

const sinceYesterday = [
  {
    when: "5:14 PM",
    what: "June Halloran applied for Senior Frontend Engineer through the careers site. AI filled 14 of 17 answers; the person check passed by text.",
  },
  {
    when: "2:40 PM",
    what: "Two applications came in for Seasonal Fulfillment Associate.",
  },
  {
    when: "11:05 AM",
    what: "The Customer Support Specialist posting passed 100 views on the careers site.",
  },
];

interface NeedsGroup {
  id: string;
  title: string;
  blaze: "single" | "double";
  items: Candidate[];
  reason: (candidate: Candidate) => string;
  actionLabel: string;
  /** Without one, the action opens the candidate. */
  toast?: string;
  note?: string;
  shown?: number;
}

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
        {inPlay.length === 0 ? "No one in the running yet." : `${inPlay.length} in the running: ${words}`}
      </p>
    </div>
  );
}

export function TodayPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const open = candidates.filter(
    (candidate) => candidate.stage !== "closed" && candidate.stage !== "hired",
  );

  const groups: NeedsGroup[] = [];
  const taken = new Set<string>();
  function add(group: NeedsGroup) {
    group.items = group.items.filter((candidate) => !taken.has(candidate.id));
    for (const candidate of group.items) taken.add(candidate.id);
    groups.push(group);
  }

  add({
    id: "reviews",
    title: "Human review requests",
    blaze: "double",
    items: open.filter((candidate) => candidate.reviewRequested),
    reason: () => "Asked for a person to review",
    actionLabel: "Review",
  });
  add({
    id: "identity",
    title: "Identity checks to clear",
    blaze: "double",
    items: open.filter((candidate) => candidate.identityCheck === "needs"),
    reason: () => "Needs the identity check before anything moves",
    actionLabel: "Clear the check",
  });
  add({
    id: "offers",
    title: "Offers waiting on approval",
    blaze: "double",
    items: open.filter(
      (candidate) => candidate.stage === "offer" && candidate.offerNeedsApproval,
    ),
    reason: () => `Offer written, waiting on ${recruiters.hiringManager.name}`,
    actionLabel: `Remind ${recruiters.hiringManager.name}`,
    toast: `Reminder sent to ${recruiters.hiringManager.name}.`,
  });
  add({
    id: "scorecards",
    title: "Interviews with no scorecard",
    blaze: "double",
    items: open.filter((candidate) => candidate.needsScorecard),
    reason: () => "Interviewed, scorecard not filed",
    actionLabel: "File the scorecard",
  });
  add({
    id: "waiting",
    title: "Waiting more than 5 days",
    blaze: "single",
    items: open
      .filter((candidate) => candidate.waitingDays > 5)
      .sort((a, b) => b.waitingDays - a.waitingDays),
    reason: (candidate) => `Waiting ${stagePhrase[candidate.stage]}`,
    actionLabel: "Open",
    shown: 5,
  });
  add({
    id: "automated",
    title: "Likely automated applications",
    blaze: "double",
    items: open.filter((candidate) => candidate.personCheck === "likely-automated"),
    reason: (candidate) => candidate.personCheckNote ?? "Quiet signals flagged this application",
    actionLabel: "Open",
    note: "Marked, never auto rejected. A person makes every call.",
  });

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <article>
      <header className={styles.head}>
        <h1 className={styles.title}>{demoToday}</h1>
        <p className={styles.count}>
          {total === 1 ? "1 thing needs you today" : `${total} things need you today`}
        </p>
      </header>

      <div className={styles.cols}>
        <section aria-label="Needs you" className={styles.needs}>
          {groups.map((group) => {
            if (group.items.length === 0) return null;
            const shown = group.shown ? group.items.slice(0, group.shown) : group.items;
            const rest = group.items.length - shown.length;
            return (
              <section key={group.id} aria-labelledby={`g-${group.id}`} className={styles.group}>
                <div className={styles.groupHead}>
                  <h2 id={`g-${group.id}`} className={styles.groupTitle}>
                    {group.title}
                  </h2>
                  <span className={styles.groupCount}>{group.items.length}</span>
                </div>
                <ul className={styles.rows}>
                  {shown.map((candidate) => (
                    <li key={candidate.id} className={styles.row}>
                      <Blaze variant={group.blaze} className={styles.rowBlaze} />
                      <span className={styles.rowMain}>
                        <span className={styles.rowName}>{candidate.name}</span>
                        <span className={styles.rowMeta}>
                          {getJob(candidate.jobId)?.title}. {group.reason(candidate)}.
                        </span>
                      </span>
                      <Tally days={candidate.waitingDays} className={styles.rowTally} />
                      <Button
                        variant="secondary"
                        size="sm"
                        onPress={() =>
                          group.toast
                            ? setToast(group.toast)
                            : navigate(`/recruit/candidates/${candidate.id}`)
                        }
                      >
                        {group.actionLabel}
                      </Button>
                    </li>
                  ))}
                </ul>
                {rest > 0 ? (
                  <p className={styles.more}>
                    <Link to="/recruit/candidates">{rest} more in Candidates</Link>
                  </p>
                ) : null}
                {group.note ? <p className={styles.note}>{group.note}</p> : null}
              </section>
            );
          })}
        </section>

        <aside className={styles.rail}>
          <section aria-labelledby="since-h" className={styles.railSection}>
            <h2 id="since-h" className={styles.groupTitle}>
              Since yesterday
            </h2>
            <ul className={styles.log}>
              {sinceYesterday.map((entry) => (
                <li key={entry.when} className={styles.logRow}>
                  <span className={styles.logWhen}>{entry.when}</span>
                  <span className={styles.logWhat}>{entry.what}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="roles-h" className={styles.railSection}>
            <h2 id="roles-h" className={styles.groupTitle}>
              Your open roles
            </h2>
            <ul className={styles.roles}>
              {jobs.map((job) => (
                <li key={job.id} className={styles.role}>
                  <Link to={`/recruit/jobs/${job.id}`} className={styles.roleName}>
                    {job.title}
                  </Link>
                  <RoleTracks jobId={job.id} />
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <ToastRegion>
        {toast ? <Toast variant="success" title={toast} onDismiss={() => setToast(null)} /> : null}
      </ToastRegion>
    </article>
  );
}
