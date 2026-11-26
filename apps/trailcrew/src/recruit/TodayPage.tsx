import { useNavigate } from "react-router-dom";
import { Button, Card } from "@talus/react";
import { candidates } from "../fixtures/candidates";
import { getJob } from "../fixtures/jobs";
import { stageTitles, type Candidate } from "../fixtures/types";
import styles from "./TodayPage.module.css";

const changes = [
  "3 new applications came in yesterday: 2 for Seasonal Fulfillment Associate, 1 for Warehouse Lead.",
  "June Halloran moved to Interview on Nov 20.",
  "The Customer Support Specialist posting passed 100 views on the company site.",
];

interface ActionList {
  id: string;
  title: string;
  detail: (candidate: Candidate) => string;
  items: Candidate[];
  /** One line under the list, e.g. what never happens automatically. */
  note?: string;
}

export function TodayPage() {
  const navigate = useNavigate();
  const open = candidates.filter((c) => c.stage !== "closed" && c.stage !== "hired");
  const lists: ActionList[] = [
    {
      id: "waiting",
      title: "Waiting more than 5 days",
      detail: (c) => `${c.waitingDays} days in ${stageTitles[c.stage].toLowerCase()}`,
      items: open.filter((c) => c.waitingDays > 5),
    },
    {
      id: "scorecards",
      title: "Interviews with no scorecard",
      detail: () => "Interviewed, scorecard not filed",
      items: candidates.filter((c) => c.needsScorecard),
    },
    {
      id: "offers",
      title: "Offers waiting on approval",
      detail: () => "Waiting on Marcus Lee",
      items: candidates.filter((c) => c.stage === "offer" && c.offerNeedsApproval),
    },
    {
      id: "automated",
      title: "Likely automated applications",
      detail: (c) => c.personCheckNote ?? "Quiet signals flagged this application",
      note: "Marked, never auto rejected. A person makes every call.",
      items: candidates.filter((c) => c.personCheck === "likely-automated"),
    },
    {
      id: "identity",
      title: "Identity checks to clear",
      detail: () => "Needs a check",
      items: candidates.filter((c) => c.identityCheck === "needs"),
    },
    {
      id: "reviews",
      title: "Human review requests",
      detail: () => "Asked for a person to review",
      items: candidates.filter((c) => c.reviewRequested),
    },
  ];

  return (
    <article>
      <h1 className={styles.title}>Today</h1>
      <p className={styles.date}>Tuesday, Nov 25</p>

      <section aria-labelledby="changed-heading" className={styles.changed}>
        <h2 id="changed-heading" className={styles.h2}>
          What changed
        </h2>
        <ul className={styles.changeList}>
          {changes.map((change) => (
            <li key={change.slice(0, 24)}>{change}</li>
          ))}
        </ul>
      </section>

      <h2 className={styles.h2}>Needs action</h2>
      <div className={styles.grid}>
        {lists.map((list) => (
          <Card key={list.id}>
            <div className={styles.cardHead}>
              <h3 className={styles.h3}>{list.title}</h3>
              <span className={styles.count}>{list.items.length}</span>
            </div>
            {list.items.length === 0 ? (
              <p className={styles.empty}>Nothing waiting. Clear.</p>
            ) : (
              <ul className={styles.rows}>
                {list.items.slice(0, 5).map((candidate) => (
                  <li key={candidate.id} className={styles.row}>
                    <span className={styles.rowText}>
                      <span className={styles.rowName}>{candidate.name}</span>
                      <span className={styles.rowDetail}>
                        {getJob(candidate.jobId)?.title}. {list.detail(candidate)}.
                      </span>
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onPress={() => navigate(`/recruit/candidates/${candidate.id}`)}
                    >
                      Open
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {list.items.length > 5 ? (
              <p className={styles.more}>And {list.items.length - 5} more in the pipeline.</p>
            ) : null}
            {list.note && list.items.length > 0 ? (
              <p className={styles.more}>{list.note}</p>
            ) : null}
          </Card>
        ))}
      </div>
    </article>
  );
}
