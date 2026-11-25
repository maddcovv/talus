import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  InlineAlert,
  StatusTracker,
  Toast,
  ToastRegion,
  type StatusTrackerStage,
} from "@talus/react";
import { getCandidate } from "../fixtures/candidates";
import { employer, getJob, recruiters } from "../fixtures/jobs";
import { stageOrder, stageTitles } from "../fixtures/types";
import styles from "./StatusPage.module.css";

function nextStepText(stage: string): string {
  switch (stage) {
    case "applied":
      return "Next: a person reviews your application. That takes up to 5 business days.";
    case "review":
      return "Next: you hear whether we move to an interview, within 5 business days of the review.";
    case "interview":
      return `Next: your interview with ${recruiters.hiringManager.name}, ${recruiters.hiringManager.role.toLowerCase()}, is on Dec 2. You hear back within 3 days after.`;
    case "offer":
      return "Next: your offer letter arrives by email once it clears approval, usually within 2 business days.";
    case "hired":
      return "You are hired. Your start date details arrive by email.";
    default:
      return "";
  }
}

export function StatusPage() {
  const { token } = useParams();
  const candidate = getCandidate(token);
  const job = candidate ? getJob(candidate.jobId) : undefined;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  if (!candidate || !job) {
    return (
      <p>
        We could not find that application. Check the link from your confirmation, or{" "}
        <Link to="/">see all open jobs.</Link>
      </p>
    );
  }

  const isClosed = candidate.stage === "closed";
  const stages: StatusTrackerStage[] = isClosed
    ? [
        {
          label: stageTitles.applied,
          date: candidate.stageDates.applied,
          state: "done",
        },
        {
          label: stageTitles.closed,
          date: candidate.stageDates.closed,
          state: "closed",
          reason: candidate.closedReason,
        },
      ]
    : stageOrder.map((stage, index) => {
        const currentIndex = stageOrder.indexOf(candidate.stage);
        return {
          label: stageTitles[stage],
          date: candidate.stageDates[stage],
          state: index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming",
        } as StatusTrackerStage;
      });

  return (
    <article>
      <p className={styles.employer}>
        {employer.name}: {job.title}
      </p>
      <h1 className={styles.title}>Where you stand</h1>
      <p className={styles.candidateLine}>Application for {candidate.name}</p>

      <StatusTracker label="Application progress" stages={stages} className={styles.tracker} />

      {candidate.stageDates.review ? (
        <p className={styles.reviewLine}>
          Reviewed by a person on {candidate.stageDates.review} ({recruiters.recruiter.name},{" "}
          {recruiters.recruiter.role.toLowerCase()}).
        </p>
      ) : (
        <p className={styles.reviewLine}>Not yet reviewed by a person.</p>
      )}

      {!isClosed ? <p className={styles.nextLine}>{nextStepText(candidate.stage)}</p> : null}

      <InlineAlert variant="info" title="Where AI was used">
        AI filled this application from the resume, and {candidate.name.split(" ")[0]} confirmed
        every field before it was sent. AI also suggests evidence to the recruiter, labeled as a
        suggestion. No decision about you is made by AI.
      </InlineAlert>

      <div className={styles.actionRow}>
        <Button variant="secondary" isDisabled={requested} onPress={() => setDialogOpen(true)}>
          {requested ? "Review requested" : "Ask for a person to review"}
        </Button>
      </div>

      <Dialog
        title="Ask for a person to review"
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        {({ close }) => (
          <div className={styles.dialogBody}>
            <p className={styles.dialogText}>
              A person already reviews every application. This sends a direct request to{" "}
              {recruiters.recruiter.name}, the recruiter on this job, to take another look and
              reply to you.
            </p>
            <div className={styles.dialogActions}>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setRequested(true);
                  setToastVisible(true);
                  close();
                }}
              >
                Send request
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <ToastRegion>
        {toastVisible ? (
          <Toast
            variant="success"
            title="Request sent."
            onDismiss={() => setToastVisible(false)}
          >
            {recruiters.recruiter.name} will reply within 2 business days.
          </Toast>
        ) : null}
      </ToastRegion>
    </article>
  );
}
