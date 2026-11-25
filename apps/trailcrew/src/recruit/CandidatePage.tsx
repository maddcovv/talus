import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  Radio,
  RadioGroup,
  Tag,
  Toast,
  ToastRegion,
  type BadgeVariant,
} from "@talus/react";
import { answersFor, evidenceFor, getCandidate } from "../fixtures/candidates";
import { getJob, recruiters } from "../fixtures/jobs";
import { stageOrder, stageTitles, type IdentityCheck, type StageId } from "../fixtures/types";
import styles from "./CandidatePage.module.css";

const identityWords: Record<IdentityCheck, { label: string; variant: BadgeVariant }> = {
  needs: { label: "Needs a check", variant: "warning" },
  checked: { label: "Checked", variant: "success" },
  "not-started": { label: "Not started", variant: "neutral" },
};

const forwardReasons = [
  "Meets the requirements with evidence",
  "Strong answers to the job questions",
  "Referral vouched for the work",
];

const declineReasons = [
  "Experience does not match the requirements",
  "Timing or availability",
  "Location or work authorization",
  "Withdrew",
];

const juneAnswers = [
  "I designed the form field wrapper at Blue Mesa. Label, help text and error were first class props, so every form the teams shipped came out accessible by default.",
  "When a second team copies it, it belongs to the system. Before that it is still an experiment.",
  "Keyboard first by hand, axe in CI on every story, and a screen reader pass before a component graduates.",
];

export function CandidatePage() {
  const { id } = useParams();
  const candidate = getCandidate(id);
  const job = candidate ? getJob(candidate.jobId) : undefined;
  const [stage, setStage] = useState<StageId | null>(null);
  const [dialog, setDialog] = useState<"forward" | "decline" | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!candidate || !job) {
    return (
      <p>
        No such candidate. <Link to="/recruit">Back to Today.</Link>
      </p>
    );
  }

  const currentStage = stage ?? candidate.stage;
  const evidence = evidenceFor(candidate, job.requirements);
  const answers =
    candidate.id === "june-halloran" ? juneAnswers : answersFor(candidate, job.questions.length);
  const identity = identityWords[candidate.identityCheck];
  const nextStage =
    currentStage === "closed"
      ? null
      : stageOrder[Math.min(stageOrder.indexOf(currentStage) + 1, stageOrder.length - 1)];

  function decide() {
    if (!reason) return;
    if (dialog === "forward" && nextStage) {
      setStage(nextStage);
      setToast(`Moved to ${stageTitles[nextStage]}. Decided by ${recruiters.recruiter.name}, logged on the job.`);
    }
    if (dialog === "decline") {
      setStage("closed");
      setToast(`Closed: ${reason}. Decided by ${recruiters.recruiter.name}, logged on the job.`);
    }
    setDialog(null);
    setReason(null);
  }

  return (
    <article>
      <div className={styles.head}>
        <Avatar name={candidate.name} size="lg" />
        <div className={styles.headText}>
          <h1 className={styles.title}>{candidate.name}</h1>
          <p className={styles.meta}>
            {job.title}. Applied {candidate.appliedOn} via {candidate.source.toLowerCase()}.
          </p>
          <div className={styles.tags}>
            <Badge variant={currentStage === "closed" ? "neutral" : "info"}>
              {stageTitles[currentStage]}
            </Badge>
            <Tag>{candidate.location}</Tag>
            <Tag>{candidate.email}</Tag>
          </div>
        </div>
        <div className={styles.decisions}>
          <Button
            isDisabled={currentStage === "closed" || currentStage === "hired"}
            onPress={() => setDialog("forward")}
          >
            Move forward
          </Button>
          <Button
            variant="secondary"
            isDisabled={currentStage === "closed"}
            onPress={() => setDialog("decline")}
          >
            Not moving forward
          </Button>
        </div>
      </div>

      <div className={styles.identityRow}>
        <span className={styles.identityLabel}>Identity check</span>
        <Badge variant={identity.variant}>{identity.label}</Badge>
      </div>

      <section aria-labelledby="evidence-heading" className={styles.section}>
        <h2 id="evidence-heading" className={styles.h2}>
          Evidence against the requirements
        </h2>
        <p className={styles.sectionNote}>
          AI suggested these matches from the resume. {recruiters.recruiter.name} reviews each one.
          There is no score.
        </p>
        <ul className={styles.evidenceList}>
          {evidence.map((row) => (
            <li key={row.requirement} className={styles.evidenceRow}>
              <span className={styles.requirement}>{row.requirement}</span>
              {row.quote ? (
                <blockquote className={styles.quote}>
                  "{row.quote}"
                  <cite className={styles.cite}>{row.where}. AI suggested.</cite>
                </blockquote>
              ) : (
                <span className={styles.noEvidence}>No evidence found.</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="answers-heading" className={styles.section}>
        <h2 id="answers-heading" className={styles.h2}>
          Application answers
        </h2>
        <dl className={styles.answers}>
          {job.questions.map((question, index) => (
            <div key={question.id} className={styles.answerRow}>
              <dt>{question.label}</dt>
              <dd>{answers[index]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Dialog
        title={dialog === "forward" ? "Move forward" : "Not moving forward"}
        isOpen={dialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialog(null);
            setReason(null);
          }
        }}
      >
        {({ close }) => (
          <div className={styles.dialogBody}>
            <RadioGroup label="Reason" value={reason} onChange={setReason}>
              {(dialog === "forward" ? forwardReasons : declineReasons).map((item) => (
                <Radio key={item} value={item}>
                  {item}
                </Radio>
              ))}
            </RadioGroup>
            <p className={styles.dialogNote}>
              Decided by {recruiters.recruiter.name}, {recruiters.recruiter.role.toLowerCase()}.
              Logged on the job, visible to the candidate's status page.
            </p>
            <div className={styles.dialogActions}>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button isDisabled={!reason} onPress={decide}>
                Confirm decision
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <ToastRegion>
        {toast ? <Toast variant="success" title={toast} onDismiss={() => setToast(null)} /> : null}
      </ToastRegion>
    </article>
  );
}
