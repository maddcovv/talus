import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CaretRight, Check } from "@phosphor-icons/react";
import {
  Button,
  Checkbox,
  ErrorSummary,
  OneTimeCodeInput,
  type ErrorSummaryItem,
} from "@talus/react";
import { useBrand } from "../lib/useBrand";
import { TwoTrackMark } from "../components/TwoTrackMark";
import { TrackProgress } from "../components/TrackProgress";
import { Postmark } from "../components/Postmark";
import { employer, getJob } from "../fixtures/jobs";
import {
  contactFields,
  resumeLines,
  sampleResumeName,
  sampleResumePages,
  workEntries,
} from "../fixtures/resume";
import { statusToken } from "../fixtures/candidates";
import styles from "./ApplyPage.module.css";

const DEMO_CODE = "482913";

type Stage = "upload" | "reading" | "details" | "questions" | "review" | "sent";

const stepLabels = ["Resume", "Your details", "Job questions", "Review and submit"];
const stepIndexFor: Record<Stage, number> = {
  upload: 0,
  reading: 0,
  details: 1,
  questions: 2,
  review: 3,
  sent: 4,
};
const progressFor: Record<Stage, number> = {
  upload: 0.06,
  reading: 0.12,
  details: 0.38,
  questions: 0.62,
  review: 0.88,
  sent: 1,
};

const READ_TICK_MS = 260;
const READ_TICKS = 11;
const readChecks = [
  { at: 3, text: "Reading your resume" },
  { at: 7, text: "Found 3 jobs and 1 degree" },
  { at: 11, text: "Filling your details" },
];

const nextSteps = [
  {
    when: "Right now",
    how: "Email",
    title: "A confirmation in your inbox",
    body: "From jobs@twotracksupply.example, with a link to your status page. Not there in 10 minutes? Check spam.",
  },
  {
    when: "By Wednesday, Dec 2",
    how: "Email, either way",
    title: "Dana Ruiz reads your application",
    body: "A person, not a filter. Yes or not this time, you hear back by email. Never silence.",
  },
  {
    when: "Within a week after",
    how: "Phone or video, your pick",
    title: "A 30 minute conversation",
    body: "If it's a match, Dana texts first to find a time, then calls. Come with questions.",
  },
  {
    when: "About a week later",
    how: "Video, 90 minutes",
    title: "A working session with the team",
    body: "We send the topics three days ahead. No trick questions, no whiteboard puzzles.",
  },
  {
    when: "Within 3 days of that",
    how: "Phone call",
    title: "A decision, with a reason",
    body: "From a person, with our pay number if it's a yes.",
  },
];

const calendarIcs = `data:text/calendar;charset=utf-8,${encodeURIComponent(
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Two Track Supply//Trailcrew demo//EN",
    "BEGIN:VEVENT",
    "UID:trailcrew-demo-reply@twotracksupply.example",
    "DTSTART;VALUE=DATE:20261202",
    "DTEND;VALUE=DATE:20261203",
    "SUMMARY:Two Track Supply replies about your application",
    "DESCRIPTION:Dana Ruiz reads your application by Wednesday\\, December 2.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n"),
)}`;

function toTop() {
  if (typeof window.scrollTo === "function") {
    try {
      window.scrollTo(0, 0);
    } catch {
      // not implemented in some test environments
    }
  }
}

function shortMonth(month: string): string {
  return month.slice(0, 3);
}

function workDates(entry: (typeof workEntries)[number]): string {
  const start = `${shortMonth(entry.startMonth)} ${entry.startYear}`;
  const end = entry.current ? "now" : `${shortMonth(entry.endMonth)} ${entry.endYear}`;
  return `${start} to ${end}`;
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function ApplyPage() {
  useBrand("consumer", "light");
  const { jobId } = useParams();
  const job = getJob(jobId);
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>("upload");
  const [aiFilled, setAiFilled] = useState(false);
  const [readIdx, setReadIdx] = useState(0);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(contactFields.map((field) => [field.id, ""])),
  );
  const [auth, setAuth] = useState<string | null>(null);
  const [spons, setSpons] = useState<string | null>(null);
  const [openJob, setOpenJob] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [opener, setOpener] = useState("");
  const [startAnswer, setStartAnswer] = useState<string | null>(null);
  const [payAnswer, setPayAnswer] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [qShowErrors, setQShowErrors] = useState(false);
  const [code, setCode] = useState("");
  const [attest, setAttest] = useState(false);
  const [rShowErrors, setRShowErrors] = useState(false);
  const [resent, setResent] = useState("");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (stage !== "reading") return;
    const timer = window.setInterval(() => setReadIdx((n) => n + 1), READ_TICK_MS);
    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage === "reading" && readIdx > READ_TICKS) {
      setStage("details");
      toTop();
    }
  }, [stage, readIdx]);

  const phone = values.phone ?? "";
  const digits = phone.replace(/\D/g, "");
  const phoneFmt =
    digits.length === 10
      ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
      : phone.trim() || "your phone";

  const detailMissing: ErrorSummaryItem[] = useMemo(() => {
    const missing: ErrorSummaryItem[] = [];
    if (!phone.trim()) missing.push({ targetId: "phone", label: "Add your phone number" });
    if (auth === null)
      missing.push({ targetId: "auth", label: "Answer whether you can work in the US" });
    if (spons === null) missing.push({ targetId: "auth", label: "Answer the sponsorship question" });
    return missing;
  }, [phone, auth, spons]);
  const n = detailMissing.length;
  const detailErrors = showErrors && n > 0;

  const openerWords = wordCount(opener);
  const qMissing: ErrorSummaryItem[] = useMemo(() => {
    const missing: ErrorSummaryItem[] = [];
    if (!openerWords)
      missing.push({
        targetId: "q1",
        label:
          job?.id === "senior-frontend"
            ? "Answer the question about a component you built"
            : "Answer the first question from the team",
      });
    if (startAnswer === null) missing.push({ targetId: "q2", label: "Say when you could start" });
    if (payAnswer === null) missing.push({ targetId: "q3", label: "Answer the pay question" });
    return missing;
  }, [openerWords, startAnswer, payAnswer, job?.id]);
  const qn = qMissing.length;
  const qErrors = qShowErrors && qn > 0;

  const codeOk = code === DEMO_CODE;
  const rMissing: ErrorSummaryItem[] = useMemo(() => {
    const missing: ErrorSummaryItem[] = [];
    if (!codeOk)
      missing.push({
        targetId: "code",
        label:
          code.length === 6
            ? "That code doesn't match the text we sent"
            : "Enter the 6-digit code from the text",
      });
    if (!attest)
      missing.push({ targetId: "attest", label: "Check the box to confirm your application" });
    return missing;
  }, [codeOk, code.length, attest]);
  const rn = rMissing.length;
  const rErrors = rShowErrors && rn > 0;

  if (!job) {
    return (
      <div className={styles.missing}>
        <p>
          That job is not open. <Link to="/">See all open roles.</Link>
        </p>
      </div>
    );
  }

  const stepIdx = stepIndexFor[stage];
  const reading = stage === "reading";
  const [openerQ, startQ, payQ] = job.questions;
  const openerErrorHint =
    job.id === "senior-frontend"
      ? "Write a few sentences about a component other teams used."
      : "Write a few sentences in your own words.";

  function useSample() {
    setAiFilled(true);
    setValues(
      Object.fromEntries(contactFields.map((field) => [field.id, field.value])),
    );
    setReadIdx(0);
    setStage("reading");
    toTop();
  }

  function fillYourself() {
    setAiFilled(false);
    setStage("details");
    toTop();
  }

  function continueDetails() {
    if (n > 0) {
      setShowErrors(true);
      setNonce((x) => x + 1);
      return;
    }
    setShowErrors(false);
    setStage("questions");
    toTop();
  }

  function continueQuestions() {
    if (qn > 0) {
      setQShowErrors(true);
      setNonce((x) => x + 1);
      return;
    }
    setQShowErrors(false);
    setStage("review");
    toTop();
  }

  function submit() {
    if (rn > 0) {
      setRShowErrors(true);
      setNonce((x) => x + 1);
      return;
    }
    setRShowErrors(false);
    setStage("sent");
    toTop();
  }

  function goTo(next: Stage) {
    setStage(next);
    toTop();
  }

  function fillJuneAnswers() {
    setOpener(
      "At Blue Mesa I built the date picker in our component library. Four teams picked it up within a month, and their first bug reports were all about keyboard use inside data tables. I rewrote its focus handling, added a keyboard test to our release checklist, and wrote a short guide on using it inside grids.",
    );
    setStartAnswer("Within a month");
    setPayAnswer("Yes, it works");
  }

  const lineLit = (index: number, key: string) =>
    reading
      ? index < readIdx && index >= readIdx - 2
      : stage === "details" && focusKey !== null && focusKey === key;

  const detailNote = detailErrors
    ? n === 1
      ? "1 answer still needs you. It is marked above."
      : `${n} answers still need you. They are marked above.`
    : "Next: 3 questions from the team";
  const qNote = qErrors
    ? qn === 1
      ? "1 answer still needs you. It is marked above."
      : `${qn} answers still need you. They are marked above.`
    : "Next: check everything and send";
  const rNote = rErrors
    ? rn === 1
      ? "1 thing still needs you. It is marked above."
      : `${rn} things still need you. They are marked above.`
    : "Goes straight to Dana Ruiz.";

  const reviewQuestions: Array<{ k: string; v: string }> = [
    { k: openerQ.short ?? openerQ.label, v: clip(opener, 220) },
    { k: startQ.short ?? startQ.label, v: startAnswer ?? "" },
    { k: payQ.short ?? payQ.label, v: payAnswer ?? "" },
    ...(note.trim() ? [{ k: "Note to Dana", v: clip(note, 160) }] : []),
  ];

  const firstName = values.name?.trim().split(/\s+/)[0] || "there";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link to={`/jobs/${job.id}`} className={styles.headerBrand}>
            <TwoTrackMark className={styles.headerMark} />
            <span className={styles.headerTitle}>
              {job.title} <span className={styles.headerAt}>at {employer.name}</span>
            </span>
          </Link>
          <Link to={`/jobs/${job.id}`} className={styles.saveLink}>
            Save and finish later
          </Link>
        </div>
        <div className={styles.headerRoad}>
          <TrackProgress progress={progressFor[stage]} />
          <ol className={styles.steps}>
            {stepLabels.map((label, index) => (
              <li
                key={label}
                className={
                  index < stepIdx
                    ? styles.stepDone
                    : index === stepIdx
                      ? styles.stepNow
                      : styles.stepAhead
                }
                aria-current={index === stepIdx ? "step" : undefined}
              >
                {label}
              </li>
            ))}
          </ol>
        </div>
      </header>

      <div className={styles.cols}>
        <main className={styles.main}>
          {stage === "upload" ? (
            <>
              <h1 className={styles.h}>Start with your resume</h1>
              <p className={styles.lede}>
                AI reads it and fills the application for you. You&apos;ll see where every answer
                came from, and you can change any of it.
              </p>
              <div data-weave="" className={styles.drop}>
                <img src="/img/tts-truck.jpg" alt="" aria-hidden="true" className={styles.dropImg} />
                <div>
                  <div className={styles.dropTitle}>Drop your resume here</div>
                  <p className={styles.dropSub}>PDF or Word document, up to 10 MB.</p>
                  <Button onPress={useSample}>Choose a file</Button>
                </div>
              </div>
              <p className={styles.selfLine}>
                No resume?{" "}
                <button type="button" className={styles.selfLink} onClick={fillYourself}>
                  Fill in the form yourself
                </button>
                . It takes about 10 minutes.
              </p>
            </>
          ) : null}

          {reading ? (
            <>
              <h1 className={styles.h}>Reading your resume</h1>
              <ul aria-live="polite" className={styles.readList}>
                {readChecks.map((item) => {
                  const done = readIdx >= item.at;
                  return (
                    <li key={item.text} className={done ? styles.readDone : styles.readAhead}>
                      <span className={done ? styles.readDotDone : styles.readDot} aria-hidden="true">
                        {done ? <Check weight="bold" /> : null}
                      </span>
                      {item.text}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}

          {stage === "details" ? (
            <>
              <h1 className={styles.h}>Your details</h1>
              {detailErrors ? (
                <ErrorSummary
                  key={`d-${nonce}`}
                  className={styles.errorBox}
                  title={n === 1 ? "There is 1 thing to fix" : `There are ${n} things to fix`}
                  items={detailMissing}
                />
              ) : null}
              {aiFilled ? (
                <div className={styles.aiBar}>
                  <span className={styles.aiBarStrong}>AI filled 14 of 17 answers.</span>
                  <span className={styles.aiBarNeed}>
                    {n === 0
                      ? "Everything is answered."
                      : n === 1
                        ? "1 answer needs you."
                        : `${n} answers need you.`}
                  </span>
                  <span className={styles.aiBarHint}>
                    Focus any field to see the line it came from.
                  </span>
                </div>
              ) : null}

              <section className={styles.sec} aria-labelledby="contact-h">
                <h2 id="contact-h" className={styles.secH}>
                  Contact
                </h2>
                <div className={styles.two}>
                  {contactFields.map((field) => {
                    const isPhone = field.id === "phone";
                    const missingPhone = isPhone && !phone.trim();
                    const phoneError = detailErrors && missingPhone;
                    const subId = `sub-${field.id}`;
                    const sub = isPhone
                      ? phoneError
                        ? "Enter a phone number so Dana can reach you."
                        : "Not on your resume. Dana uses it to set up a call."
                      : aiFilled && field.filled
                        ? "From your resume, page 1"
                        : "";
                    return (
                      <div key={field.id} id={field.id}>
                        <div className={styles.fieldHead}>
                          <label htmlFor={`in-${field.id}`} className={styles.fieldLabel}>
                            {field.label}
                          </label>
                          {isPhone ? (
                            <span className={styles.tagWarn}>Needs your answer</span>
                          ) : aiFilled && field.filled ? (
                            <span className={styles.tagAi}>AI filled</span>
                          ) : null}
                        </div>
                        <input
                          id={`in-${field.id}`}
                          className={`${styles.fld} ${phoneError ? styles.fldError : ""} ${
                            isPhone && !phoneError ? styles.fldWarn : ""
                          } ${missingPhone ? styles.fldWarnBg : ""}`}
                          value={values[field.id] ?? ""}
                          onChange={(event) =>
                            setValues((prev) => ({ ...prev, [field.id]: event.target.value }))
                          }
                          onFocus={() => setFocusKey(field.lineKey)}
                          aria-describedby={sub ? subId : undefined}
                          aria-invalid={phoneError || undefined}
                        />
                        {sub ? (
                          <div
                            id={subId}
                            className={phoneError ? styles.fieldSubError : styles.fieldSub}
                          >
                            {sub}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={styles.sec} aria-labelledby="work-h">
                <h2 id="work-h" className={styles.secH}>
                  Work history
                </h2>
                <p className={styles.secNote}>Open a job to check the dates and what you did there.</p>
                {workEntries.map((entry, index) => {
                  const open = openJob === index;
                  return (
                    <div key={entry.id} className={styles.jobRow}>
                      <button
                        type="button"
                        className={styles.jobToggle}
                        aria-expanded={open}
                        onClick={() => {
                          setOpenJob(open ? -1 : index);
                          setFocusKey(entry.lineKey);
                        }}
                        onFocus={() => setFocusKey(entry.lineKey)}
                      >
                        <CaretRight
                          aria-hidden
                          weight="bold"
                          className={`${styles.jobCaret} ${open ? styles.jobCaretOpen : ""}`}
                        />
                        <span className={styles.jobText}>
                          <span className={styles.jobTitle}>{entry.title}</span>
                          <span className={styles.jobCompany}>{entry.company}</span>
                        </span>
                        <span className={styles.jobDates}>{workDates(entry)}</span>
                      </button>
                      {open ? (
                        <div className={styles.jobPanel}>
                          <ul className={styles.jobBullets}>
                            {entry.bullets.split("\n").map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                          {aiFilled ? (
                            <span className={styles.sourceChip}>From your resume, page 1</span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </section>

              <section id="auth" className={styles.sec} aria-labelledby="auth-h">
                <h2 id="auth-h" className={styles.secH}>
                  Work authorization
                </h2>
                {[
                  {
                    key: "auth",
                    label: "Are you authorized to work in the United States?",
                    value: auth,
                    set: setAuth,
                  },
                  {
                    key: "spons",
                    label: "Will you now or in the future need visa sponsorship?",
                    value: spons,
                    set: setSpons,
                  },
                ].map((question) => {
                  const miss = question.value === null;
                  return (
                    <fieldset key={question.key} className={styles.ynSet}>
                      <legend className={styles.ynLegend}>
                        {question.label}{" "}
                        {miss ? <span className={styles.tagWarn}>Needs your answer</span> : null}
                      </legend>
                      <div className={styles.ynRow}>
                        {["Yes", "No"].map((option) => {
                          const on = question.value === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={on}
                              onClick={() => question.set(option)}
                              className={`${styles.choice} ${on ? styles.choiceOn : ""} ${
                                detailErrors && miss ? styles.choiceError : ""
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </section>

              <div className={styles.continueRow}>
                <Button size="lg" onPress={continueDetails}>
                  Continue to job questions
                </Button>
                <span className={detailErrors ? styles.noteError : styles.noteQuiet}>
                  {detailNote}
                </span>
              </div>
            </>
          ) : null}

          {stage === "questions" ? (
            <>
              <h1 className={styles.h}>Three questions from the team</h1>
              <p className={styles.lede}>
                Dana Ruiz and the engineering lead wrote these. AI leaves them to you, so answer in
                your own words. A few sentences is plenty.
              </p>
              {qErrors ? (
                <ErrorSummary
                  key={`q-${nonce}`}
                  className={styles.errorBox}
                  title={qn === 1 ? "There is 1 thing to fix" : `There are ${qn} things to fix`}
                  items={qMissing}
                />
              ) : null}

              <section className={styles.sec} id="q1">
                <label htmlFor="in-q1" className={styles.qLabel}>
                  {openerQ.label}
                </label>
                {openerQ.hint ? <p className={styles.qHint}>{openerQ.hint}</p> : null}
                <textarea
                  id="in-q1"
                  rows={7}
                  className={`${styles.fld} ${styles.area} ${
                    qErrors && !openerWords ? styles.fldError : ""
                  }`}
                  value={opener}
                  onChange={(event) => setOpener(event.target.value)}
                  aria-describedby="q1-sub"
                  aria-invalid={(qErrors && !openerWords) || undefined}
                />
                <div className={styles.qUnder}>
                  <span
                    id="q1-sub"
                    className={qErrors && !openerWords ? styles.fieldSubError : styles.fieldSub}
                  >
                    {qErrors && !openerWords
                      ? openerErrorHint
                      : "Plain words are fine. No need to polish it."}
                  </span>
                  <span className={styles.qCount}>
                    {openerWords === 1 ? "1 word" : `${openerWords} words`}
                  </span>
                </div>
              </section>

              <section className={styles.sec} id="q2">
                <fieldset className={styles.qSet}>
                  <legend className={styles.qLegend}>{startQ.label}</legend>
                  <div className={styles.choiceRow}>
                    {(startQ.options ?? []).map((option) => {
                      const on = startAnswer === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setStartAnswer(option)}
                          className={`${styles.choice} ${on ? styles.choiceOn : ""} ${
                            qErrors && startAnswer === null ? styles.choiceError : ""
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </section>

              <section className={styles.sec} id="q3">
                <fieldset className={styles.qSet}>
                  <legend className={styles.qLegend}>{payQ.label}</legend>
                  {payQ.hint ? <p className={styles.qHint}>{payQ.hint}</p> : null}
                  <div className={styles.choiceRow}>
                    {(payQ.options ?? []).map((option) => {
                      const on = payAnswer === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setPayAnswer(option)}
                          className={`${styles.choice} ${on ? styles.choiceOn : ""} ${
                            qErrors && payAnswer === null ? styles.choiceError : ""
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </section>

              <section className={styles.sec}>
                <div className={styles.qLabel}>
                  A note to Dana <span className={styles.qOptional}>(optional)</span>
                </div>
                <p className={styles.qHint}>
                  A cover letter is never required here. Add one if there&apos;s something your
                  resume doesn&apos;t say.
                </p>
                {noteOpen ? (
                  <>
                    <label htmlFor="in-note" className={styles.fieldLabel}>
                      Your note
                    </label>
                    <textarea
                      id="in-note"
                      rows={5}
                      autoFocus
                      className={`${styles.fld} ${styles.area}`}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.choice}
                    onClick={() => setNoteOpen(true)}
                  >
                    Add a note or cover letter
                  </button>
                )}
              </section>

              <div className={styles.continueRow}>
                <Button size="lg" onPress={continueQuestions}>
                  Continue to review
                </Button>
                <button type="button" className={styles.backLink} onClick={() => goTo("details")}>
                  Back to your details
                </button>
                <span className={qErrors ? styles.noteError : styles.noteQuiet}>{qNote}</span>
              </div>
            </>
          ) : null}

          {stage === "review" ? (
            <>
              <h1 className={styles.h}>Check it and send</h1>
              <p className={styles.lede}>
                Dana Ruiz gets exactly what you see here. Change anything you like before you send
                it.
              </p>
              {rErrors ? (
                <ErrorSummary
                  key={`r-${nonce}`}
                  className={styles.errorBox}
                  title={rn === 1 ? "There is 1 thing to fix" : `There are ${rn} things to fix`}
                  items={rMissing}
                />
              ) : null}

              <section className={styles.sec}>
                <div className={styles.reviewHead}>
                  <h2 className={styles.secH}>Contact</h2>
                  <button type="button" className={styles.editLink} onClick={() => goTo("details")}>
                    Edit<span className={styles.srOnly}> contact</span>
                  </button>
                </div>
                <dl className={styles.reviewList}>
                  {[
                    { k: "Full name", v: values.name },
                    { k: "Email", v: values.email },
                    { k: "Phone", v: phoneFmt },
                    { k: "Location", v: values.location },
                  ].map((row) => (
                    <div key={row.k} className={styles.reviewRow}>
                      <dt>{row.k}</dt>
                      <dd>{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className={styles.sec}>
                <div className={styles.reviewHead}>
                  <h2 className={styles.secH}>Work history</h2>
                  <button type="button" className={styles.editLink} onClick={() => goTo("details")}>
                    Edit<span className={styles.srOnly}> work history</span>
                  </button>
                </div>
                <ul className={styles.reviewPlain}>
                  {workEntries.map((entry) => (
                    <li key={entry.id} className={styles.reviewRow}>
                      <span className={styles.reviewKey}>{workDates(entry)}</span>
                      <span className={styles.reviewVal}>
                        {entry.title}, {entry.company}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={styles.sec}>
                <div className={styles.reviewHead}>
                  <h2 className={styles.secH}>Work authorization</h2>
                  <button type="button" className={styles.editLink} onClick={() => goTo("details")}>
                    Edit<span className={styles.srOnly}> work authorization</span>
                  </button>
                </div>
                <dl className={styles.reviewList}>
                  <div className={styles.reviewRow}>
                    <dt>Authorized to work in the US</dt>
                    <dd>{auth ?? ""}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>Needs visa sponsorship</dt>
                    <dd>{spons ?? ""}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.sec}>
                <div className={styles.reviewHead}>
                  <h2 className={styles.secH}>Job questions</h2>
                  <button
                    type="button"
                    className={styles.editLink}
                    onClick={() => goTo("questions")}
                  >
                    Edit<span className={styles.srOnly}> job questions</span>
                  </button>
                </div>
                <dl className={styles.reviewList}>
                  {reviewQuestions.map((row) => (
                    <div key={row.k} className={styles.reviewRow}>
                      <dt>{row.k}</dt>
                      <dd>{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className={styles.sec} id="code">
                <h2 className={styles.secH}>One quick check that you&apos;re a person</h2>
                <p className={styles.codeLede}>
                  We texted a 6-digit code to {phoneFmt}. It keeps bots and mass-apply tools out of
                  Dana&apos;s inbox, so she has time to read yours.
                </p>
                <OneTimeCodeInput
                  label="Code from the text"
                  value={code}
                  onChange={setCode}
                  hint="Demo: the code is 482913."
                  errorMessage={
                    rErrors && !codeOk
                      ? code.length === 6
                        ? "That code doesn't match. Check the latest text from Two Track Supply, or get a new code."
                        : "Enter all 6 digits from the text."
                      : undefined
                  }
                />
                <div className={styles.resendRow}>
                  <button
                    type="button"
                    className={styles.backLink}
                    onClick={() =>
                      setResent(`New code sent to ${phoneFmt}. It can take a minute to arrive.`)
                    }
                  >
                    Text me a new code
                  </button>
                  <button
                    type="button"
                    className={styles.backLink}
                    onClick={() =>
                      setResent(`We're calling ${phoneFmt} now. A recording reads the code twice.`)
                    }
                  >
                    Call me with the code instead
                  </button>
                </div>
                {resent ? (
                  <p role="status" className={styles.resentNote}>
                    {resent}
                  </p>
                ) : null}
              </section>

              <section className={styles.sec} id="attest">
                <h2 className={styles.secH}>Before you send</h2>
                <div
                  className={`${styles.attestBox} ${rErrors && !attest ? styles.attestError : ""} ${
                    attest ? styles.attestOn : ""
                  }`}
                >
                  <Checkbox isSelected={attest} onChange={setAttest}>
                    I confirm that what&apos;s in this application is true and complete as far as I
                    know. I understand that false or misleading answers can end the hiring process,
                    or my employment if I&apos;m hired. AI filled parts of this form from my
                    resume, and I checked every answer.
                  </Checkbox>
                </div>
                <p className={styles.attestLinks}>
                  Read <Link to="/how-ai-works">how Two Track Supply uses AI in hiring</Link> and{" "}
                  <Link to="/how-ai-works">how we use and keep your information</Link>. Two Track
                  Supply is an equal opportunity employer.
                </p>
              </section>

              <div className={styles.continueRow}>
                <Button size="lg" onPress={submit}>
                  Send my application
                </Button>
                <span className={rErrors ? styles.noteError : styles.noteQuiet}>{rNote}</span>
              </div>
            </>
          ) : null}

          {stage === "sent" ? (
            <>
              <svg viewBox="0 0 640 150" aria-hidden="true" className={styles.trailSvg}>
                <path
                  className={styles.trail}
                  d="M10 140 C120 140 150 60 260 70 S420 120 500 50 S600 20 620 24"
                  stroke="var(--talus-color-action-primary-bg)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  className={styles.trail}
                  d="M10 128 C118 128 148 48 260 58 S416 108 496 38 S596 8 616 12"
                  stroke="var(--talus-color-action-primary-bg)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <g transform="translate(606 0)">
                  <rect x="0" y="0" width="5" height="40" fill="var(--talus-color-text-on-feature)" />
                  <path d="M5 2 L30 10 L5 18Z" fill="var(--talus-color-bg-accent)" />
                </g>
              </svg>
              <h1 className={styles.hSent}>Sent. Nice work, {firstName}.</h1>
              <p className={styles.sentLede}>
                Your application for {job.title} is with {employer.name}. Here&apos;s exactly what
                to expect, and when.
              </p>
              <h2 className={styles.sentH2}>What happens next</h2>
              <ol className={styles.nextList}>
                {nextSteps.map((step) => (
                  <li key={step.title} className={styles.nextRow}>
                    <div>
                      <div className={styles.nextWhen}>{step.when}</div>
                      <div className={styles.nextHow}>{step.how}</div>
                    </div>
                    <div>
                      <div className={styles.nextTitle}>{step.title}</div>
                      <div className={styles.nextBody}>{step.body}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.headsUp}>
                <strong>A heads up.</strong> We will never ask you for money, bank details or to
                buy equipment to get hired. If anyone does, it isn&apos;t us.
              </div>
              <div className={styles.sentBtns}>
                <Button size="lg" onPress={() => navigate(`/status/${statusToken}`)}>
                  See where you stand
                </Button>
                <a href={calendarIcs} download="two-track-reply.ics" className={styles.ghostBtn}>
                  Add December 2 to my calendar
                </a>
                <Link to="/" className={styles.ghostBtn}>
                  Back to open roles
                </Link>
              </div>
            </>
          ) : null}
        </main>

        <aside className={styles.paper}>
          {stage === "upload" ? (
            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>No resume handy?</div>
              <p className={styles.sideBody}>
                Try the flow with June Halloran&apos;s sample resume. It&apos;s made up, like
                everything in this demo.
              </p>
              <button type="button" className={styles.sideBtn} onClick={useSample}>
                Use June&apos;s sample resume
              </button>
            </div>
          ) : null}

          {(reading || stage === "details") && aiFilled ? (
            <div>
              <div className={styles.paperHead}>
                <span>{sampleResumeName}</span>
                <span>{sampleResumePages}</span>
              </div>
              <div className={styles.paperDoc}>
                {resumeLines.map((line, index) => (
                  <div
                    key={`${line.key}-${line.text.slice(0, 12)}`}
                    className={[
                      styles.paperLine,
                      line.variant === "name" ? styles.paperName : "",
                      line.variant === "head" ? styles.paperHeadLine : "",
                      line.gap === "loose" ? styles.paperGapLoose : "",
                      line.gap === "none" ? styles.paperGapNone : "",
                      lineLit(index, line.key) ? styles.paperLit : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {stage === "questions" ? (
            <>
              <div className={styles.sideCard}>
                <div className={styles.sideTitle}>Demo shortcut</div>
                <p className={styles.sideBody}>
                  Typing answers is the point for a real applicant. For a quick look, fill in
                  June&apos;s.
                </p>
                <button type="button" className={styles.sideBtn} onClick={fillJuneAnswers}>
                  Fill June&apos;s answers
                </button>
              </div>
              <div className={styles.whoReads}>
                <strong>Who reads these.</strong> Dana and the engineering lead read your answers
                together. Nothing here is scored by software.
              </div>
            </>
          ) : null}

          {stage === "review" && aiFilled ? (
            <div className={styles.aiUsed}>
              <div className={styles.aiUsedTitle}>How AI was used here</div>
              <p>AI read your resume and filled 14 of 17 answers. You checked each one.</p>
              <p>AI did not write your answers to the team&apos;s questions.</p>
              <p>
                AI doesn&apos;t score, rank or reject anyone at {employer.name}. Dana reads every
                application.
              </p>
            </div>
          ) : null}

          {stage === "sent" ? (
            <div className={styles.postcard}>
              <div className={styles.postcardTop}>
                <img
                  src="/img/tts-hero.jpg"
                  alt=""
                  aria-hidden="true"
                  className={styles.postcardImg}
                />
                <Postmark className={styles.stamp} />
              </div>
              <div className={styles.postcardBody}>
                <div className={styles.sideTitle}>Landed in Salida</div>
                <p className={styles.sideBodyTight}>
                  Your application for {job.title} arrived November 25. Dana Ruiz reads it by
                  Wednesday, December 2.
                </p>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
