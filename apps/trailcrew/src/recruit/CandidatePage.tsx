import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  TextField,
  Toast,
  ToastRegion,
  type BadgeVariant,
} from "@talus/react";
import {
  answersFor,
  candidatesForJob,
  evidenceFor,
  getCandidate,
  resumeFor,
} from "../fixtures/candidates";
import { demoTodayShort, statusMessages } from "../fixtures/demo";
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

function GenericResume({ candidate }: { candidate: Candidate; job: Job }) {
  const lines = resumeFor(candidate);
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

/** The job's review order: newest application first. */
function reviewOrderFor(jobId: string) {
  return candidatesForJob(jobId)
    .slice()
    .sort((a, b) => {
      const day = (candidate: Candidate) =>
        Number.parseInt(candidate.appliedOn.replace("Nov ", ""), 10) || 0;
      return day(b) - day(a) || a.name.localeCompare(b.name);
    });
}

interface RecordProps {
  candidate: Candidate;
  job: Job;
  notes: string[];
  onAddNote: (text: string) => void;
  prevId: string | null;
  nextId: string | null;
  position: number;
  total: number;
}

export function CandidatePage() {
  const { id } = useParams();
  const [notesByCandidate, setNotesByCandidate] = useState<Record<string, string[]>>({});
  const candidate = getCandidate(id);
  const job = candidate ? getJob(candidate.jobId) : undefined;
  if (!candidate || !job) {
    return (
      <p>
        No such candidate. <Link to="/recruit">Back to Jobs.</Link>
      </p>
    );
  }
  const siblings = reviewOrderFor(candidate.jobId);
  const index = siblings.findIndex((entry) => entry.id === candidate.id);
  return (
    <CandidateRecord
      key={candidate.id}
      candidate={candidate}
      job={job}
      notes={notesByCandidate[candidate.id] ?? []}
      onAddNote={(text) =>
        setNotesByCandidate((prev) => ({
          ...prev,
          [candidate.id]: [...(prev[candidate.id] ?? []), text],
        }))
      }
      prevId={index > 0 ? siblings[index - 1].id : null}
      nextId={index >= 0 && index < siblings.length - 1 ? siblings[index + 1].id : null}
      position={index + 1}
      total={siblings.length}
    />
  );
}

function CandidateRecord({
  candidate,
  job,
  notes,
  onAddNote,
  prevId,
  nextId,
  position,
  total,
}: RecordProps) {
  const navigate = useNavigate();
  const [stage, setStage] = useState<StageId | null>(null);
  const [dialog, setDialog] = useState<"forward" | "decline" | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<string, "kept" | "removed">>({});
  const [litKeys, setLitKeys] = useState<string[]>([]);
  const [noteDraft, setNoteDraft] = useState("");

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
        <div className={styles.pager}>
          <Button
            variant="secondary"
            size="sm"
            isDisabled={!prevId}
            onPress={() => prevId && navigate(`/recruit/candidates/${prevId}`)}
          >
            Previous
          </Button>
          <span className={styles.pagerCount}>
            {position} of {total}
          </span>
          <Button
            variant="secondary"
            size="sm"
            isDisabled={!nextId}
            onPress={() => nextId && navigate(`/recruit/candidates/${nextId}`)}
          >
            Next candidate
          </Button>
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
            <ul className={styles.noteList}>
              {candidate.id === "marisol-vega" ? (
                <li className={styles.railNote}>
                  "Strong component library work, exactly our gap. Check the accessibility answer
                  against a work sample." {recruiters.recruiter.name}, Nov 14.
                </li>
              ) : null}
              {notes.map((note) => (
                <li key={note} className={styles.railNote}>
                  "{note}" {recruiters.recruiter.name}, {demoTodayShort}.
                </li>
              ))}
              {candidate.id !== "marisol-vega" && notes.length === 0 ? (
                <li className={styles.railNote}>No notes yet.</li>
              ) : null}
            </ul>
            <TextField
              label="Add a note"
              multiline
              rows={3}
              value={noteDraft}
              onChange={setNoteDraft}
            />
            <Button
              variant="secondary"
              size="sm"
              onPress={() => {
                if (noteDraft.trim()) {
                  onAddNote(noteDraft.trim());
                  setNoteDraft("");
                }
              }}
            >
              Add note
            </Button>
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
