import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  Disclosure,
  ErrorSummary,
  FileUpload,
  InlineAlert,
  OneTimeCodeInput,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  SourceChip,
  Stepper,
  TextField,
  type ErrorSummaryItem,
} from "@talus/react";
import { employer, getJob } from "../fixtures/jobs";
import {
  educationEntries,
  filledSections,
  months,
  sampleResumeName,
  workEntries,
  type EducationEntry,
  type FilledField,
  type WorkEntry,
} from "../fixtures/resume";
import { statusToken } from "../fixtures/candidates";
import styles from "./ApplyPage.module.css";

const DEMO_CODE = "482913";

const steps = [
  { label: "Resume" },
  { label: "Your details" },
  { label: "Job questions" },
  { label: "Review and submit" },
];

const stepTitles = ["Upload your resume", "Your details", "Job questions", "Review and submit"];

const fillLines = ["Reading your resume", "Found 3 jobs and 1 degree", "Filling your details"];

const selfIdQuestions = [
  { id: "gender", label: "Gender", options: ["Woman", "Man", "Non-binary"] },
  {
    id: "ethnicity",
    label: "Race or ethnicity",
    options: [
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic or Latino",
      "Native Hawaiian or Pacific Islander",
      "White",
      "Two or more races",
    ],
  },
  { id: "veteran", label: "Veteran status", options: ["I am a veteran", "I am not a veteran"] },
  {
    id: "disability",
    label: "Disability status",
    options: ["Yes, I have or have had a disability", "No"],
  },
];

const DECLINE = "I don't wish to answer";

type UploadState = {
  status: "idle" | "uploading" | "success";
  progress: number;
  fileName?: string;
};

export function ApplyPage() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const [step, setStep] = useState(0);
  const [upload, setUpload] = useState<UploadState>({ status: "idle", progress: 0 });
  const [fill, setFill] = useState<{ stage: "idle" | "running" | "done"; line: number }>({
    stage: "idle",
    line: 0,
  });
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      filledSections.flatMap((section) => section.fields.map((field) => [field.id, field.value])),
    ),
  );
  const [work, setWork] = useState<WorkEntry[]>(() => workEntries.map((entry) => ({ ...entry })));
  const [education, setEducation] = useState<EducationEntry[]>(() =>
    educationEntries.map((entry) => ({ ...entry })),
  );
  const [openWork, setOpenWork] = useState<Set<string | number>>(new Set());
  const [openEducation, setOpenEducation] = useState<Set<string | number>>(new Set());
  const [coverLetter, setCoverLetter] = useState("");
  const [coverUpload, setCoverUpload] = useState<UploadState>({ status: "idle", progress: 0 });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selfId, setSelfId] = useState<Record<string, string>>({});
  const [personChannel, setPersonChannel] = useState<"text" | "email" | null>(null);
  const [personCheck, setPersonCheck] = useState<"idle" | "sent" | "passed">("idle");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>();
  const [resendLeft, setResendLeft] = useState(0);
  const [certify, setCertify] = useState(false);
  const [aiNotice, setAiNotice] = useState(false);
  const [attempted, setAttempted] = useState<Record<number, boolean>>({});
  const [attemptNonce, setAttemptNonce] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const uploadTimer = useRef<number | null>(null);
  const fillTimer = useRef<number | null>(null);
  const resendTimer = useRef<number | null>(null);
  const newEntryCount = useRef(0);

  useEffect(
    () => () => {
      for (const timer of [uploadTimer, fillTimer, resendTimer]) {
        if (timer.current !== null) {
          window.clearInterval(timer.current);
          window.clearTimeout(timer.current);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (upload.status === "success" && fill.stage === "idle") {
      setFill({ stage: "running", line: 0 });
      let line = 0;
      const tick = () => {
        line += 1;
        if (line < fillLines.length) {
          setFill({ stage: "running", line });
          fillTimer.current = window.setTimeout(tick, 600);
        } else {
          setFill({ stage: "done", line });
        }
      };
      fillTimer.current = window.setTimeout(tick, 600);
    }
  }, [upload.status, fill.stage]);

  if (!job) {
    return (
      <div className={styles.container}>
        <p>
          That job is not open. <Link to="/">See all open jobs.</Link>
        </p>
      </div>
    );
  }

  function setField(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function isMissing(field: FilledField) {
    return Boolean(field.required) && (values[field.id] ?? "").trim() === "";
  }

  function problemsFor(stepIndex: number): ErrorSummaryItem[] {
    if (stepIndex === 0) {
      if (upload.status !== "success") {
        return [
          { targetId: "resume-upload", label: "Upload your resume, or use the sample resume." },
        ];
      }
      if (fill.stage !== "done") {
        return [
          { targetId: "resume-upload", label: "Give AI a moment to finish reading your resume." },
        ];
      }
      return [];
    }
    if (stepIndex === 1) {
      const problems: ErrorSummaryItem[] = [];
      if ((values.phone ?? "").trim() === "") {
        problems.push({ targetId: "field-phone", label: "Add your phone number." });
      }
      if ((values.authorized ?? "") === "") {
        problems.push({
          targetId: "field-authorized",
          label: "Answer: Are you authorized to work in the United States?",
        });
      }
      if ((values.sponsorship ?? "") === "") {
        problems.push({
          targetId: "field-sponsorship",
          label: "Answer: Will you now or in the future need visa sponsorship?",
        });
      }
      return problems;
    }
    if (stepIndex === 2) {
      return (job?.questions ?? [])
        .filter((question) => !question.optional && (answers[question.id] ?? "").trim() === "")
        .map((question) => ({
          targetId: `field-q-${question.id}`,
          label: `Answer: ${question.label}`,
        }));
    }
    const problems: ErrorSummaryItem[] = [];
    if (personCheck !== "passed") {
      problems.push({ targetId: "person-check", label: "Finish the person check." });
    }
    if (!certify) {
      problems.push({ targetId: "field-certify", label: "Check the certification box." });
    }
    if (!aiNotice) {
      problems.push({
        targetId: "field-ai-notice",
        label: "Confirm you have read how Trailcrew uses AI.",
      });
    }
    return problems;
  }

  // Recomputed on every render, so the list shrinks as each problem is fixed.
  const problems = attempted[step] ? problemsFor(step) : [];
  const problemTitle =
    problems.length === 1 ? "There is 1 thing to fix" : `There are ${problems.length} things to fix`;

  function tryAdvance() {
    if (problemsFor(step).length > 0) {
      setAttempted((prev) => ({ ...prev, [step]: true }));
      setAttemptNonce((nonce) => nonce + 1);
      return;
    }
    if (step === 3) {
      setSubmitted(true);
      return;
    }
    setStep(step + 1);
  }

  function goToStep(next: number) {
    setStep(next);
  }

  function simulateUpload(fileName: string) {
    setFill({ stage: "idle", line: 0 });
    setUpload({ status: "uploading", progress: 0, fileName });
    uploadTimer.current = window.setInterval(() => {
      setUpload((prev) => {
        const progress = Math.min(prev.progress + 12, 100);
        if (progress === 100) {
          if (uploadTimer.current !== null) window.clearInterval(uploadTimer.current);
          return { status: "success", progress, fileName: prev.fileName };
        }
        return { ...prev, progress };
      });
    }, 140);
  }

  function updateWork(id: string, patch: Partial<WorkEntry>) {
    setWork((all) => all.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function updateEducation(id: string, patch: Partial<EducationEntry>) {
    setEducation((all) => all.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function addJob() {
    newEntryCount.current += 1;
    const id = `new-job-${newEntryCount.current}`;
    setWork((all) => [
      ...all,
      {
        id,
        company: "",
        title: "",
        location: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        current: false,
        bullets: "",
      },
    ]);
    setOpenWork((prev) => new Set([...prev, id]));
  }

  function addEducation() {
    newEntryCount.current += 1;
    const id = `new-education-${newEntryCount.current}`;
    setEducation((all) => [...all, { id, school: "", credential: "", year: "" }]);
    setOpenEducation((prev) => new Set([...prev, id]));
  }

  function startCountdown() {
    setResendLeft(30);
    if (resendTimer.current !== null) window.clearInterval(resendTimer.current);
    resendTimer.current = window.setInterval(() => {
      setResendLeft((left) => {
        if (left <= 1) {
          if (resendTimer.current !== null) window.clearInterval(resendTimer.current);
          return 0;
        }
        return left - 1;
      });
    }, 1000);
  }

  function sendCode(channel: "text" | "email") {
    setPersonChannel(channel);
    setPersonCheck("sent");
    setCode("");
    setCodeError(undefined);
    startCountdown();
  }

  function verifyCode(value: string) {
    if (value === DEMO_CODE) {
      setPersonCheck("passed");
      setCodeError(undefined);
      if (resendTimer.current !== null) window.clearInterval(resendTimer.current);
    } else {
      setCodeError("That code did not match. Check the newest message, or resend the code.");
    }
  }

  function workTitleFor(entry: WorkEntry) {
    const title = entry.title.trim() || "New job";
    const company = entry.company.trim();
    return company ? `${title}, ${company}` : title;
  }

  function workDetailFor(entry: WorkEntry) {
    if (!entry.startYear.trim()) return "Add the dates";
    const start = `${entry.startMonth} ${entry.startYear}`.trim();
    const end = entry.current ? "now" : `${entry.endMonth} ${entry.endYear}`.trim() || "?";
    return `${start} to ${end}`;
  }

  function renderField(field: FilledField) {
    if (field.id === "authorized" || field.id === "sponsorship") {
      return (
        <div key={field.id} id={`field-${field.id}`} className={styles.fieldWrap}>
          <RadioGroup
            label={field.label}
            value={values[field.id] === "" ? null : values[field.id]}
            onChange={(value) => setField(field.id, value)}
            errorMessage={attempted[1] && isMissing(field) ? "Needs your answer." : undefined}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </RadioGroup>
          {!attempted[1] && isMissing(field) ? (
            <div className={styles.chipRow}>
              <Badge variant="warning">Needs your answer</Badge>
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <div key={field.id} id={`field-${field.id}`} className={styles.fieldWrap}>
        <TextField
          label={field.label}
          value={values[field.id] ?? ""}
          onChange={(value) => setField(field.id, value)}
          multiline={field.multiline}
          rows={field.multiline ? 4 : undefined}
          hint={field.hint}
          errorMessage={attempted[1] && isMissing(field) ? "Needs your answer." : undefined}
        />
        <div className={styles.chipRow}>
          {field.source ? (
            <>
              <span className={styles.aiLabel}>AI filled</span>
              <SourceChip source={field.source.where}>{field.source.line}</SourceChip>
            </>
          ) : isMissing(field) ? (
            <Badge variant="warning">Needs your answer</Badge>
          ) : null}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <article className={styles.container}>
        <h1 className={styles.title}>Application sent</h1>
        <div className={styles.stepBody}>
          <InlineAlert variant="success" title={`Your application went to ${employer.name}.`}>
            A person reviews every application. Nothing is decided by AI.
          </InlineAlert>
          <p className={styles.body}>
            You can see where you stand at any time, including whether a person has reviewed your
            application and what happens next.
          </p>
          <p className={styles.body}>
            <Link to={`/status/${statusToken}`}>See where you stand</Link>
          </p>
        </div>
      </article>
    );
  }

  const answeredCount = job.questions.filter(
    (question) => (answers[question.id] ?? "").trim() !== "",
  ).length;
  const linkCount = ["linkedin", "portfolio", "github"].filter(
    (id) => (values[id] ?? "").trim() !== "",
  ).length;
  const coverAdded = coverLetter.trim() !== "" || coverUpload.status === "success";

  return (
    <article className={styles.container}>
      <p className={styles.stepCount}>Step {step + 1} of 4</p>
      <h1 className={styles.title}>{stepTitles[step]}</h1>
      <p className={styles.employer}>
        Applying for {job.title} at {employer.name}
      </p>
      <Stepper label="Application steps" steps={steps} current={step} onStepClick={goToStep} />

      {problems.length > 0 ? (
        <ErrorSummary
          key={`problems-${step}-${attemptNonce}`}
          className={styles.problems}
          title={problemTitle}
          items={problems}
        />
      ) : null}

      {step === 0 ? (
        <section id="resume-upload" aria-label="Upload your resume" className={styles.stepBody}>
          <FileUpload
            label="Resume"
            accept={["pdf", "docx"]}
            maxSizeMb={10}
            status={upload.status}
            progress={upload.progress}
            fileName={upload.fileName}
            onSelect={(files) => simulateUpload(files[0]?.name ?? sampleResumeName)}
          />
          <div className={styles.sampleRow}>
            <Button variant="secondary" onPress={() => simulateUpload(sampleResumeName)}>
              Use the sample resume
            </Button>
            <span className={styles.sampleNote}>June Halloran, Senior Frontend Engineer</span>
          </div>
          <p aria-live="polite" className={styles.fillLine}>
            {fill.stage === "running" ? `${fillLines[fill.line]}...` : ""}
          </p>
          {upload.status === "success" && fill.stage === "done" ? (
            <InlineAlert variant="success" title="Resume read.">
              AI filled the application from it: 3 jobs, 1 degree, your contact details and your
              skills. Next, check every field; nothing is sent without your sign off.
            </InlineAlert>
          ) : null}
          {upload.status === "idle" ? (
            <InlineAlert variant="info" title="How this works">
              AI can fill the application from your resume. You review every field before anything
              is sent. A person reviews every application.
            </InlineAlert>
          ) : null}
        </section>
      ) : null}

      {step === 1 ? (
        <section aria-label="Your details" className={styles.stepBody}>
          <InlineAlert variant="info" title="AI filled these fields from your resume.">
            Go down the list and fix anything wrong. Fields it could not read are marked "Needs
            your answer." Sending the application counts as your sign-off on every field.
          </InlineAlert>

          <section aria-labelledby="contact-heading" className={styles.formSection}>
            <h2 id="contact-heading" className={styles.h2}>
              Contact
            </h2>
            {filledSections
              .find((section) => section.id === "contact")!
              .fields.map(renderField)}
          </section>

          <section aria-labelledby="work-heading" className={styles.formSection}>
            <h2 id="work-heading" className={styles.h2}>
              Work history
            </h2>
            <p className={styles.sectionNote}>
              AI pulled these from your resume, newest first. Open each job to check the details.
              Everything is editable.
            </p>
            <Accordion
              expandedKeys={openWork}
              onExpandedChange={(keys) => setOpenWork(new Set(keys))}
            >
              {work.map((entry) => (
                <Disclosure
                  key={entry.id}
                  id={entry.id}
                  title={workTitleFor(entry)}
                  detail={workDetailFor(entry)}
                  headingLevel={3}
                >
                  <div className={styles.entryGrid}>
                    <TextField
                      label="Job title"
                      value={entry.title}
                      onChange={(value) => updateWork(entry.id, { title: value })}
                    />
                    <TextField
                      label="Company"
                      value={entry.company}
                      onChange={(value) => updateWork(entry.id, { company: value })}
                    />
                    <div className={styles.span2}>
                      <TextField
                        label="Location"
                        value={entry.location}
                        onChange={(value) => updateWork(entry.id, { location: value })}
                      />
                    </div>
                    <Select
                      label="Start month"
                      selectedKey={entry.startMonth || null}
                      onSelectionChange={(key) => updateWork(entry.id, { startMonth: String(key) })}
                    >
                      {months.map((month) => (
                        <SelectItem key={month} id={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </Select>
                    <TextField
                      label="Start year"
                      value={entry.startYear}
                      onChange={(value) => updateWork(entry.id, { startYear: value })}
                    />
                    {!entry.current ? (
                      <>
                        <Select
                          label="End month"
                          selectedKey={entry.endMonth || null}
                          onSelectionChange={(key) =>
                            updateWork(entry.id, { endMonth: String(key) })
                          }
                        >
                          {months.map((month) => (
                            <SelectItem key={month} id={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </Select>
                        <TextField
                          label="End year"
                          value={entry.endYear}
                          onChange={(value) => updateWork(entry.id, { endYear: value })}
                        />
                      </>
                    ) : null}
                    <div className={styles.span2}>
                      <Checkbox
                        isSelected={entry.current}
                        onChange={(selected) => updateWork(entry.id, { current: selected })}
                      >
                        I work here now
                      </Checkbox>
                    </div>
                    <div className={styles.span2}>
                      <TextField
                        label={`What you did at ${entry.company.trim() || "this job"}`}
                        multiline
                        rows={4}
                        hint="One line per bullet."
                        value={entry.bullets}
                        onChange={(value) => updateWork(entry.id, { bullets: value })}
                      />
                    </div>
                    {entry.source ? (
                      <div className={styles.span2}>
                        <div className={styles.chipRow}>
                          <span className={styles.aiLabel}>AI filled</span>
                          <SourceChip source={entry.source.where}>{entry.source.line}</SourceChip>
                        </div>
                      </div>
                    ) : null}
                    <div className={styles.span2}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onPress={() => setWork((all) => all.filter((e) => e.id !== entry.id))}
                      >
                        Remove this job
                      </Button>
                    </div>
                  </div>
                </Disclosure>
              ))}
            </Accordion>
            <div className={styles.sectionActions}>
              <Button variant="secondary" onPress={addJob}>
                Add a job
              </Button>
            </div>
          </section>

          <section aria-labelledby="education-heading" className={styles.formSection}>
            <h2 id="education-heading" className={styles.h2}>
              Education
            </h2>
            <Accordion
              expandedKeys={openEducation}
              onExpandedChange={(keys) => setOpenEducation(new Set(keys))}
            >
              {education.map((entry) => (
                <Disclosure
                  key={entry.id}
                  id={entry.id}
                  title={
                    entry.credential.trim() || entry.school.trim()
                      ? `${entry.credential.trim() || "Add the credential"}, ${entry.school.trim() || "add the school"}`
                      : "New education"
                  }
                  detail={entry.year.trim() || "Add the year"}
                  headingLevel={3}
                >
                  <div className={styles.entryGrid}>
                    <TextField
                      label="School"
                      value={entry.school}
                      onChange={(value) => updateEducation(entry.id, { school: value })}
                    />
                    <TextField
                      label="Degree or credential"
                      value={entry.credential}
                      onChange={(value) => updateEducation(entry.id, { credential: value })}
                    />
                    <TextField
                      label="Year finished"
                      value={entry.year}
                      onChange={(value) => updateEducation(entry.id, { year: value })}
                    />
                    {entry.source ? (
                      <div className={styles.span2}>
                        <div className={styles.chipRow}>
                          <span className={styles.aiLabel}>AI filled</span>
                          <SourceChip source={entry.source.where}>{entry.source.line}</SourceChip>
                        </div>
                      </div>
                    ) : null}
                    <div className={styles.span2}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onPress={() => setEducation((all) => all.filter((e) => e.id !== entry.id))}
                      >
                        Remove this entry
                      </Button>
                    </div>
                  </div>
                </Disclosure>
              ))}
            </Accordion>
            <div className={styles.sectionActions}>
              <Button variant="secondary" onPress={addEducation}>
                Add education
              </Button>
            </div>
          </section>

          <section aria-labelledby="skills-heading" className={styles.formSection}>
            <h2 id="skills-heading" className={styles.h2}>
              Skills
            </h2>
            {filledSections.find((section) => section.id === "skills")!.fields.map(renderField)}
          </section>

          <section aria-labelledby="links-heading" className={styles.formSection}>
            <h2 id="links-heading" className={styles.h2}>
              Links
            </h2>
            {filledSections.find((section) => section.id === "links")!.fields.map(renderField)}
          </section>

          {job.coverLetter ? (
            <section aria-labelledby="cover-heading" className={styles.formSection}>
              <h2 id="cover-heading" className={styles.h2}>
                Cover letter
              </h2>
              <p className={styles.sectionNote}>
                Optional. The hiring team reads it if you send one, and skipping it does not count
                against you.
              </p>
              <TextField
                label="Cover letter"
                multiline
                rows={6}
                hint="Paste it here, or attach a file below."
                value={coverLetter}
                onChange={setCoverLetter}
              />
              <FileUpload
                label="Or attach a file"
                accept={["pdf", "docx"]}
                maxSizeMb={5}
                status={coverUpload.status}
                progress={coverUpload.progress}
                fileName={coverUpload.fileName}
                onSelect={(files) =>
                  setCoverUpload({
                    status: "success",
                    progress: 100,
                    fileName: files[0]?.name ?? "cover-letter.pdf",
                  })
                }
              />
            </section>
          ) : null}

          <section aria-labelledby="authorization-heading" className={styles.formSection}>
            <h2 id="authorization-heading" className={styles.h2}>
              Work authorization
            </h2>
            {filledSections
              .find((section) => section.id === "authorization")!
              .fields.map(renderField)}
          </section>
        </section>
      ) : null}

      {step === 2 ? (
        <section aria-label="Job questions" className={styles.stepBody}>
          <p className={styles.body}>
            From the hiring team at {employer.name}. These are yours to answer; AI does not write
            them for you.
          </p>
          {job.questions.map((question) => {
            const missing =
              attempted[2] && !question.optional && (answers[question.id] ?? "").trim() === "";
            const error = missing ? "Needs your answer." : undefined;
            return (
              <div key={question.id} id={`field-q-${question.id}`} className={styles.fieldWrap}>
                {question.type === "yesno" ? (
                  <RadioGroup
                    label={question.label}
                    hint={question.hint}
                    value={answers[question.id] ?? null}
                    onChange={(value) =>
                      setAnswers((prev) => ({ ...prev, [question.id]: value }))
                    }
                    errorMessage={error}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </RadioGroup>
                ) : question.type === "select" ? (
                  <Select
                    label={question.label}
                    hint={question.hint}
                    placeholder="Pick one"
                    selectedKey={answers[question.id] ?? null}
                    onSelectionChange={(key) =>
                      setAnswers((prev) => ({ ...prev, [question.id]: String(key) }))
                    }
                    errorMessage={error}
                  >
                    {(question.options ?? []).map((option) => (
                      <SelectItem key={option} id={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <TextField
                    label={question.label}
                    hint={question.hint}
                    value={answers[question.id] ?? ""}
                    onChange={(value) =>
                      setAnswers((prev) => ({ ...prev, [question.id]: value }))
                    }
                    multiline={question.type === "long"}
                    rows={question.type === "long" ? 4 : undefined}
                    errorMessage={error}
                  />
                )}
              </div>
            );
          })}
        </section>
      ) : null}

      {step === 3 ? (
        <section aria-label="Review and submit" className={styles.stepBody}>
          <section aria-labelledby="review-resume-heading" className={styles.formSection}>
            <div className={styles.reviewHead}>
              <h2 id="review-resume-heading" className={styles.h2}>
                Resume
              </h2>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Edit your resume"
                onPress={() => goToStep(0)}
              >
                Edit
              </Button>
            </div>
            <dl className={styles.summary}>
              <dt>File</dt>
              <dd>{upload.fileName ?? "none"}</dd>
            </dl>
          </section>

          <section aria-labelledby="review-details-heading" className={styles.formSection}>
            <div className={styles.reviewHead}>
              <h2 id="review-details-heading" className={styles.h2}>
                Your details
              </h2>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Edit your details"
                onPress={() => goToStep(1)}
              >
                Edit
              </Button>
            </div>
            <dl className={styles.summary}>
              <dt>Name</dt>
              <dd>{values.name}</dd>
              <dt>Email</dt>
              <dd>{values.email}</dd>
              <dt>Phone</dt>
              <dd>{(values.phone ?? "").trim() || "Not added"}</dd>
              <dt>Location</dt>
              <dd>{values.location}</dd>
              <dt>Authorized to work in the US</dt>
              <dd>{values.authorized || "Not answered"}</dd>
              <dt>Needs visa sponsorship</dt>
              <dd>{values.sponsorship || "Not answered"}</dd>
              <dt>Work history</dt>
              <dd>
                {work.length === 1 ? "1 job" : `${work.length} jobs`}:{" "}
                {work
                  .map((entry) => entry.company.trim())
                  .filter(Boolean)
                  .join(", ") || "none named"}
              </dd>
              <dt>Education</dt>
              <dd>
                {education.length === 0
                  ? "None added"
                  : education
                      .map((entry) =>
                        `${entry.credential.trim()} ${entry.school.trim()}`.trim(),
                      )
                      .filter(Boolean)
                      .join("; ")}
              </dd>
              <dt>Links</dt>
              <dd>{linkCount === 0 ? "None added" : `${linkCount} added`}</dd>
              {job.coverLetter ? (
                <>
                  <dt>Cover letter</dt>
                  <dd>{coverAdded ? "Added" : "Skipped"}</dd>
                </>
              ) : null}
            </dl>
          </section>

          <section aria-labelledby="review-questions-heading" className={styles.formSection}>
            <div className={styles.reviewHead}>
              <h2 id="review-questions-heading" className={styles.h2}>
                Job questions
              </h2>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Edit your answers"
                onPress={() => goToStep(2)}
              >
                Edit
              </Button>
            </div>
            <p className={styles.sectionNote}>
              {answeredCount} of {job.questions.length} answered.
            </p>
            <dl className={styles.summary}>
              {job.questions.map((question) => (
                <div key={question.id} className={styles.summaryRow}>
                  <dt>{question.label}</dt>
                  <dd>
                    {(answers[question.id] ?? "").trim() ||
                      (question.optional ? "Skipped" : "Not answered")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="selfid-heading" className={styles.formSection}>
            <h2 id="selfid-heading" className={styles.h2}>
              Voluntary self identification
            </h2>
            <p className={styles.sectionNote}>
              Optional, and separate from your application. The hiring team never sees these
              answers; they become counts in aggregate reports only. "{DECLINE}" is a full answer
              to every question.
            </p>
            {selfIdQuestions.map((question) => (
              <Select
                key={question.id}
                label={question.label}
                placeholder={DECLINE}
                selectedKey={selfId[question.id] ?? null}
                onSelectionChange={(key) =>
                  setSelfId((prev) => ({ ...prev, [question.id]: String(key) }))
                }
              >
                {[...question.options, DECLINE].map((option) => (
                  <SelectItem key={option} id={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select>
            ))}
          </section>

          <section id="person-check" aria-labelledby="person-check-heading" className={styles.formSection}>
            <h2 id="person-check-heading" className={styles.h2}>
              Person check
            </h2>
            <p className={styles.body}>
              Bots and AI agents apply to jobs at volume. This quick check keeps them out, so a
              person reads your application sooner.
            </p>
            <div aria-live="polite" className={styles.personBody}>
              {personCheck === "idle" ? (
                <div className={styles.personRow}>
                  <Button variant="secondary" onPress={() => sendCode("text")}>
                    Text me a code
                  </Button>
                  <Button variant="secondary" onPress={() => sendCode("email")}>
                    Email me a code
                  </Button>
                </div>
              ) : null}
              {personCheck === "sent" ? (
                <>
                  <p className={styles.body}>
                    We sent a 6 digit code to{" "}
                    {personChannel === "text"
                      ? (values.phone ?? "").trim() || "your phone"
                      : values.email}
                    .
                  </p>
                  <OneTimeCodeInput
                    label="Enter the 6 digit code"
                    value={code}
                    onChange={(value) => {
                      setCode(value);
                      if (codeError) setCodeError(undefined);
                    }}
                    errorMessage={codeError}
                  />
                  <div className={styles.personRow}>
                    <Button onPress={() => verifyCode(code)}>Verify code</Button>
                    <Button
                      variant="secondary"
                      isDisabled={resendLeft > 0}
                      onPress={() => sendCode(personChannel ?? "text")}
                    >
                      {resendLeft > 0 ? `Resend code (${resendLeft}s)` : "Resend code"}
                    </Button>
                  </div>
                </>
              ) : null}
              {personCheck === "passed" ? (
                <div className={styles.personRow}>
                  <Badge variant="success">Person check passed</Badge>
                  <span className={styles.sampleNote}>
                    Verified by {personChannel === "email" ? "email" : "text"} code. Quiet signals
                    agree: typed answers, normal time on the form.
                  </span>
                </div>
              ) : null}
            </div>
            <p className={styles.demoNote}>
              In this demo the check is simulated and the code is always {DEMO_CODE}.
            </p>
          </section>

          <section aria-labelledby="attest-heading" className={styles.attest}>
            <h2 id="attest-heading" className={styles.h2}>
              Certification
            </h2>
            <div id="field-certify">
              <Checkbox isSelected={certify} onChange={setCertify}>
                I certify that the information in this application is true and complete to the best
                of my knowledge. I understand that false or misleading information, or leaving out
                important facts, may remove me from consideration or end my employment if hired. I
                authorize Two Track Supply to verify the information I have provided.
              </Checkbox>
            </div>
            <p className={styles.noticeLink}>
              <Link to="/how-ai-works">Read how Trailcrew uses AI and how your data is handled.</Link>
            </p>
            <div id="field-ai-notice">
              <Checkbox isSelected={aiNotice} onChange={setAiNotice}>
                I have read how Trailcrew uses AI and how my data is handled.
              </Checkbox>
            </div>
          </section>
        </section>
      ) : null}

      <div className={styles.navRow}>
        {step > 0 ? (
          <Button variant="secondary" onPress={() => setStep(step - 1)}>
            Back
          </Button>
        ) : null}
        <Button onPress={tryAdvance}>{step < 3 ? "Continue" : "Submit application"}</Button>
      </div>
    </article>
  );
}
