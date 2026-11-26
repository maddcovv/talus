import { useState } from "react";
import { Select, SelectItem, Switch } from "@talus/react";
import styles from "./SettingsPage.module.css";

export function SettingsPage() {
  const [suggestEvidence, setSuggestEvidence] = useState(true);
  const [draftPostings, setDraftPostings] = useState(true);
  const [rankByEvidence, setRankByEvidence] = useState(true);
  const [requireCheck, setRequireCheck] = useState(true);
  const [flagged, setFlagged] = useState("mark");
  const [waitingAlerts, setWaitingAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);

  return (
    <article className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.meta}>For Two Track Supply hiring. Changes here are demo only.</p>

      <section aria-labelledby="ai-heading" className={styles.section}>
        <h2 id="ai-heading" className={styles.h2}>
          AI
        </h2>
        <Switch isSelected={suggestEvidence} onChange={setSuggestEvidence}>
          Suggest evidence from resumes
        </Switch>
        <Switch isSelected={draftPostings} onChange={setDraftPostings}>
          Draft job postings for review
        </Switch>
        <Switch isSelected={rankByEvidence} onChange={setRankByEvidence}>
          Suggest a reading order from resume evidence
        </Switch>
        <p className={styles.note}>
          AI never rejects or hides anyone, and these switches cannot make it. Its suggestions,
          ranking included, are advice a person can ignore, and everything it does lands in the
          activity log.
        </p>
      </section>

      <section aria-labelledby="check-heading" className={styles.section}>
        <h2 id="check-heading" className={styles.h2}>
          Person check
        </h2>
        <Switch isSelected={requireCheck} onChange={setRequireCheck}>
          Require the person check before an application can be submitted
        </Switch>
        <Select
          label="When quiet signals flag an application"
          selectedKey={flagged}
          onSelectionChange={(key) => setFlagged(String(key))}
        >
          <SelectItem id="mark">Mark it likely automated, a person decides</SelectItem>
          <SelectItem id="list">Also collect them in a Today list</SelectItem>
        </Select>
        <p className={styles.note}>
          Flagged applications are never rejected automatically. They are marked, and a person makes
          the call.
        </p>
      </section>

      <section aria-labelledby="alerts-heading" className={styles.section}>
        <h2 id="alerts-heading" className={styles.h2}>
          Notifications
        </h2>
        <Switch isSelected={waitingAlerts} onChange={setWaitingAlerts}>
          Email me when a candidate waits more than 5 days
        </Switch>
        <Switch isSelected={reviewAlerts} onChange={setReviewAlerts}>
          Email me when a candidate asks for a person to review
        </Switch>
      </section>
    </article>
  );
}
