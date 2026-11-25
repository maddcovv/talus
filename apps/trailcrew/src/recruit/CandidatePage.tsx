import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  Toast,
  ToastRegion,
  type BadgeVariant,
} from "@talus/react";
import { answersFor, evidenceFor, getCandidate } from "../fixtures/candidates";
import { getJob, recruiters } from "../fixtures/jobs";
import { educationEntries, workEntries } from "../fixtures/resume";
import {
  personCheckWords,
  stageOrder,
  stageTitles,
  type Candidate,
  type IdentityCheck,
  type Job,
  type PersonCheck,
  type StageId,
} from "../fixtures/types";
import styles from "./CandidatePage.module.css";

const identityWords: Record<IdentityCheck, { label: string; variant: BadgeVariant }> = {
  needs: { label: "Needs a check", variant: "warning" },
  checked: { label: "Checked", variant: "success" },
  "not-started": { label: "Not started", variant: "neutral" },
};

const checkVariant: Record<PersonCheck, BadgeVariant> = {
  "verified-text": "success",
  "verified-email": "success",
  "likely-automated": "warning",
  "not-checked": "neutral",
};

const stageVariant: Record<StageId, BadgeVariant> = {
  applied: "neutral",
  review: "info",
  interview: "info",
  offer: "warning",
  hired: "success",
  closed: "neutral",
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

function nextStepFor(candidate: Candidate, stage: StageId): string {
  if (stage === "closed") {
    return candidate.closedReason ? `Closed: ${candidate.closedReason.toLowerCase()}` : "Closed";
  }
  if (stage === "applied") return "Review the application and decide, with a reason";
  if (stage === "review") return "Decide: interview or not, with a reason";
  if (stage === "interview") {
    return candidate.needsScorecard
      ? "File the interview scorecard"
      : "Hold the interview, then file the scorecard";
  }
  if (stage === "offer") {
    return candidate.offerNeedsApproval
      ? `Waiting on ${recruiters.hiringManager.name} to approve the offer`
      : "Send the offer";
  }
  return "Onboarding";
}

function ResumePreview({ candidate, job }: { candidate: Candidate; job: Job }) {
  const isJune = candidate.id === "june-halloran";
  const genericLines = evidenceFor(candidate, job.requirements)
    .map((row) => row.quote)
    .filter((quote): quote is string => quote !== null);
  return (
    <div className={styles.resumeDoc}>
      <p className={styles.resumeName}>{candidate.name}</p>
      <p className={styles.resumeContact}>
        {candidate.email}. {candidate.location}.
      </p>
      {isJune ? (
        <>
          <h3 className={styles.resumeH}>Experience</h3>
          {workEntries.map((entry) => (
            <div key={entry.id} className={styles.resumeEntry}>
              <p className={styles.resumeRole}>
                {entry.title}, {entry.company}
              </p>
              <p className={styles.resumeDates}>
                {entry.startMonth} {entry.startYear} to{" "}
                {entry.current ? "now" : `${entry.endMonth} ${entry.endYear}`}. {entry.location}.
              </p>
              <ul className={styles.resumeList}>
                {entry.bullets.split("\n").map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
          <h3 className={styles.resumeH}>Education</h3>
          {educationEntries.map((entry) => (
            <p key={entry.id} className={styles.resumeRole}>
              {entry.credential}, {entry.school}, {entry.year}
            </p>
          ))}
          <h3 className={styles.resumeH}>Skills</h3>
          <p className={styles.resumeRole}>
            React, TypeScript, design systems, accessibility, testing
          </p>
        </>
      ) : (
        <>
          <h3 className={styles.resumeH}>Experience</h3>
          <p className={styles.resumeRole}>{candidate.currentRole}.</p>
          <ul className={styles.resumeList}>
            {genericLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}
      <p className={styles.resumeNote}>
        Fictional resume, rendered from the uploaded file for this demo.
      </p>
    </div>
  );
}

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

  const activity: Array<{ when: string; what: string }> = [];
  if (candidate.stageDates.applied) {
    activity.push({
      when: candidate.stageDates.applied,
      what: `Applied via ${candidate.source.toLowerCase()}. Person check: ${personCheckWords[candidate.personCheck].toLowerCase()}.`,
    });
  }
  if (candidate.stageDates.review) {
    activity.push({
      when: candidate.stageDates.review,
      what: `Moved to In review by ${recruiters.recruiter.name}. AI suggested evidence the same day; ${recruiters.recruiter.name} reviewed it.`,
    });
  }
  if (candidate.stageDates.interview) {
    activity.push({
      when: candidate.stageDates.interview,
      what: `Moved to Interview by ${recruiters.recruiter.name}.`,
    });
  }
  if (candidate.stageDates.offer) {
    activity.push({
      when: candidate.stageDates.offer,
      what: `Moved to Offer. ${candidate.offerNeedsApproval ? `Waiting on ${recruiters.hiringManager.name}.` : "Approved."}`,
    });
  }
  if (candidate.stageDates.hired) {
    activity.push({ when: candidate.stageDates.hired, what: "Hired." });
  }
  if (candidate.stageDates.closed) {
    activity.push({
      when: candidate.stageDates.closed,
      what: `Closed by ${recruiters.recruiter.name}: ${candidate.closedReason?.toLowerCase() ?? "no reason recorded"}.`,
    });
  }

  function decide() {
    if (!reason) return;
    if (dialog === "forward" && nextStage) {
      setStage(nextStage);
      setToast(
        `Moved to ${stageTitles[nextStage]}. Decided by ${recruiters.recruiter.name}, logged on the job.`,
      );
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
            {job.title}. Applied {candidate.appliedOn} via {candidate.source.toLowerCase()}. Owner:{" "}
            {recruiters.recruiter.name}.
          </p>
          <div className={styles.tags}>
            <Badge variant={stageVariant[currentStage]}>{stageTitles[currentStage]}</Badge>
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

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          <Tabs defaultSelectedKey="evidence">
            <TabList aria-label="Candidate record">
              <Tab id="evidence">Evidence</Tab>
              <Tab id="application">Application</Tab>
              <Tab id="resume">Resume</Tab>
              <Tab id="activity">Activity</Tab>
            </TabList>

            <TabPanel id="evidence">
              <section aria-labelledby="evidence-heading" className={styles.section}>
                <h2 id="evidence-heading" className={styles.h2}>
                  Evidence against the requirements
                </h2>
                <p className={styles.sectionNote}>
                  AI suggested these matches from the resume. {recruiters.recruiter.name} reviews
                  each one. There is no score.
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
            </TabPanel>

            <TabPanel id="application">
              <section aria-labelledby="answers-heading" className={styles.section}>
                <h2 id="answers-heading" className={styles.h2}>
                  Application answers
                </h2>
                <p className={styles.sectionNote}>
                  Written by the candidate. AI does not draft these.
                </p>
                <dl className={styles.answers}>
                  {job.questions.map((question, index) => (
                    <div key={question.id} className={styles.answerRow}>
                      <dt>{question.label}</dt>
                      <dd>{answers[index]}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </TabPanel>

            <TabPanel id="resume">
              <section aria-labelledby="resume-heading" className={styles.section}>
                <h2 id="resume-heading" className={styles.h2}>
                  Resume
                </h2>
                <ResumePreview candidate={candidate} job={job} />
              </section>
            </TabPanel>

            <TabPanel id="activity">
              <section aria-labelledby="activity-heading" className={styles.section}>
                <h2 id="activity-heading" className={styles.h2}>
                  Activity
                </h2>
                <p className={styles.sectionNote}>
                  Every move, who made it, and everything AI touched.
                </p>
                <ol className={styles.timeline}>
                  {activity.map((event) => (
                    <li key={`${event.when}-${event.what.slice(0, 16)}`}>
                      <span className={styles.when}>{event.when}</span>
                      {event.what}
                    </li>
                  ))}
                </ol>
              </section>
            </TabPanel>
          </Tabs>
        </div>

        <aside className={styles.rail} aria-label="Where this stands">
          <div className={styles.railCard}>
            <dl className={styles.railList}>
              <dt>Stage</dt>
              <dd>
                <Badge variant={stageVariant[currentStage]}>{stageTitles[currentStage]}</Badge>
              </dd>
              <dt>Owner</dt>
              <dd>{recruiters.recruiter.name}</dd>
              <dt>Person check</dt>
              <dd className={styles.railStack}>
                <Badge variant={checkVariant[candidate.personCheck]}>
                  {personCheckWords[candidate.personCheck]}
                </Badge>
                {candidate.personCheckNote ? (
                  <span className={styles.railNote}>{candidate.personCheckNote}.</span>
                ) : null}
              </dd>
              <dt>Identity check</dt>
              <dd>
                <Badge variant={identity.variant}>{identity.label}</Badge>
              </dd>
              <dt>Next step</dt>
              <dd>{nextStepFor(candidate, currentStage)}</dd>
            </dl>
          </div>
          <div className={styles.railCard}>
            <h2 className={styles.railHeading}>Notes</h2>
            {candidate.id === "june-halloran" ? (
              <p className={styles.railNote}>
                "Strong component library work, exactly our gap. Check the accessibility answer
                against a work sample." {recruiters.recruiter.name}, Nov 14.
              </p>
            ) : (
              <p className={styles.railNote}>No notes yet.</p>
            )}
          </div>
        </aside>
      </div>

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
