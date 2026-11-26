import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Toast,
  ToastRegion,
  type BadgeVariant,
} from "@talus/react";
import { answersFor, evidenceFor, getCandidate } from "../fixtures/candidates";
import { statusMessages } from "../fixtures/demo";
import { getJob, recruiters } from "../fixtures/jobs";
import { resumeLines, workEntries } from "../fixtures/resume";
import { ResumePaper } from "../components/ResumePaper";
import { Blaze } from "../components/Blaze";
import {
  personCheckWords,
  stageOrder,
  stageTitles,
  type Candidate,
  type IdentityCheck,
  type Job,
  type StageId,
} from "../fixtures/types";
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
  "At Blue Mesa I built the date picker in our component library. Four teams picked it up within a month, and their first bug reports were all about keyboard use inside data tables. I rewrote its focus handling, added a keyboard test to our release checklist, and wrote a short guide on using it inside grids.",
  "Within a month",
  "Yes, it works",
];

/** How many of the shared status messages this stage has earned. */
const messagesForStage: Record<StageId, number> = {
  applied: 1,
  review: 2,
  interview: 3,
  offer: 5,
  hired: 5,
  closed: 1,
};

function nextStepFor(candidate: Candidate, stage: StageId): string {
  if (stage === "closed") {
    return candidate.closedReason ? `Closed: ${candidate.closedReason.toLowerCase()}` : "Closed";
  }
  if (stage === "applied") return "Read the application and decide, with a reason";
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

/** Which resume line a June quote lights up. */
function lineKeyFor(quote: string): string | null {
  const line = resumeLines.find((entry) => entry.text.includes(quote));
  if (line) return line.key;
  const entry = workEntries.find((work) => work.bullets.includes(quote));
  return entry ? entry.lineKey : null;
}

function GenericResume({ candidate, job }: { candidate: Candidate; job: Job }) {
  const lines = evidenceFor(candidate, job.requirements).flatMap((row) => row.quotes);
  return (
    <div className={styles.genericDoc}>
      <p className={styles.genericName}>{candidate.name}</p>
      <p className={styles.genericContact}>
        {candidate.email}. {candidate.location}.
      </p>
      <h3 className={styles.genericH}>Experience</h3>
      <p className={styles.genericRole}>{candidate.currentRole}.</p>
      <ul className={styles.genericList}>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className={styles.genericNote}>Fictional resume, rendered for this demo.</p>
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
  const [marks, setMarks] = useState<Record<string, "kept" | "removed">>({});
  const [litKeys, setLitKeys] = useState<string[]>([]);

  if (!candidate || !job) {
    return (
      <p>
        No such candidate. <Link to="/recruit">Back to Today.</Link>
      </p>
    );
  }

  const isJune = candidate.id === "june-halloran";
  const currentStage = stage ?? candidate.stage;
  const evidence = evidenceFor(candidate, job.requirements);
  const answers =
    isJune ? juneAnswers : answersFor(candidate, job.questions.length);
  const identity = identityWords[candidate.identityCheck];
  const nextStage =
    currentStage === "closed"
      ? null
      : stageOrder[Math.min(stageOrder.indexOf(currentStage) + 1, stageOrder.length - 1)];
  const activity = statusMessages
    .slice(0, messagesForStage[candidate.stage])
    .slice()
    .reverse();

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
      <p className={styles.crumbs}>
        <Link to="/recruit">All jobs</Link> {"·"}{" "}
        <Link to={`/recruit/jobs/${candidate.jobId}`}>{job.title}</Link>
      </p>
      <header className={styles.head}>
        <Avatar name={candidate.name} size="lg" />
        <div className={styles.headText}>
          <h1 className={styles.title}>{candidate.name}</h1>
          <p className={styles.meta}>
            {job.title}. Applied {candidate.appliedOn} via {candidate.source.toLowerCase()}.
          </p>
        </div>
      </header>

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
                  AI matched resume lines to the posting. {recruiters.recruiter.name} keeps or
                  removes each one; the AI rank view orders by this evidence, and no one is
                  rejected by it.
                </p>
                <div className={styles.evidenceCols}>
                  <ul className={styles.evidenceList}>
                    {evidence.map((row) => {
                      const mark = marks[row.requirement];
                      const keys = row.quotes
                        .map(lineKeyFor)
                        .filter((key): key is string => key !== null);
                      return (
                        <li
                          key={row.requirement}
                          className={styles.evidenceRow}
                          onMouseEnter={() => setLitKeys(keys)}
                          onMouseLeave={() => setLitKeys([])}
                        >
                          <span className={styles.requirement}>{row.requirement}</span>
                          {row.quotes.length > 0 ? (
                            <>
                              <blockquote className={styles.quote}>
                                {row.quotes.map((quote) => (
                                  <span key={quote} className={styles.quoteLine}>
                                    "{quote}"
                                  </span>
                                ))}
                                <cite className={styles.cite}>
                                  {row.where}. AI suggested.
                                </cite>
                              </blockquote>
                              {row.note ? (
                                <span
                                  className={row.partial ? styles.partialNote : styles.howNote}
                                >
                                  {row.note}
                                </span>
                              ) : null}
                              <div className={styles.markRow}>
                                <button
                                  type="button"
                                  aria-pressed={mark === "kept"}
                                  className={`${styles.markBtn} ${
                                    mark === "kept" ? styles.markOn : ""
                                  }`}
                                  onFocus={() => setLitKeys(keys)}
                                  onClick={() =>
                                    setMarks((prev) => ({ ...prev, [row.requirement]: "kept" }))
                                  }
                                >
                                  Keep
                                </button>
                                <button
                                  type="button"
                                  aria-pressed={mark === "removed"}
                                  className={`${styles.markBtn} ${
                                    mark === "removed" ? styles.markOn : ""
                                  }`}
                                  onFocus={() => setLitKeys(keys)}
                                  onClick={() =>
                                    setMarks((prev) => ({
                                      ...prev,
                                      [row.requirement]: "removed",
                                    }))
                                  }
                                >
                                  Remove
                                </button>
                                {mark === "removed" ? (
                                  <span className={styles.markNote}>
                                    The team won&apos;t see this match.
                                  </span>
                                ) : null}
                              </div>
                            </>
                          ) : (
                            <span className={styles.gap}>
                              No line on the resume. Ask about it in the interview.
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <div className={styles.paperCol}>
                    {isJune ? (
                      <ResumePaper lit={(key) => litKeys.includes(key)} />
                    ) : (
                      <GenericResume candidate={candidate} job={job} />
                    )}
                  </div>
                </div>
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
                {isJune ? (
                  <div className={styles.resumeWrap}>
                    <ResumePaper />
                  </div>
                ) : (
                  <GenericResume candidate={candidate} job={job} />
                )}
              </section>
            </TabPanel>

            <TabPanel id="activity">
              <section aria-labelledby="activity-heading" className={styles.section}>
                <h2 id="activity-heading" className={styles.h2}>
                  Activity
                </h2>
                <p className={styles.sectionNote}>
                  The same messages the candidate sees on their status page, newest first.
                </p>
                <ul className={styles.activityList}>
                  {activity.map((message) => (
                    <li key={message.when} className={styles.activityRow}>
                      <span className={styles.activityWhen}>
                        {message.when} {"·"} {message.how}
                      </span>
                      <span className={styles.activityTitle}>{message.title}</span>
                      <span className={styles.activityBody}>{message.body}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </TabPanel>
          </Tabs>
        </div>

        <aside className={styles.rail} aria-label="Where this stands">
          <Card variant="feature" className={styles.decisionPanel}>
            <dl className={styles.railList}>
              <dt>Stage</dt>
              <dd className={styles.stageRow}>
                <Blaze
                  variant={candidate.reviewRequested ? "double" : "single"}
                  className={styles.stageBlaze}
                />
                {stageTitles[currentStage]}
              </dd>
              <dt>Owner</dt>
              <dd>{recruiters.recruiter.name}</dd>
              <dt>Person check</dt>
              <dd className={styles.railStack}>
                <span>{personCheckWords[candidate.personCheck]}</span>
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
          </Card>
          <div className={styles.notes}>
            <h2 className={styles.notesH}>Notes</h2>
            {candidate.id === "marisol-vega" ? (
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
              Logged on the job.
              {dialog === "decline"
                ? " The reason goes to the candidate, because the careers site promises a decision with a reason."
                : ""}
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
