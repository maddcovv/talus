import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Checkbox,
  Disclosure,
  FileUpload,
  InlineAlert,
  Radio,
  RadioGroup,
  SourceChip,
  Stepper,
  TextField,
} from "@talus/react";
import { employer, getJob } from "../fixtures/jobs";
import { filledSections, sampleResumeName, type FilledField } from "../fixtures/resume";
import { statusToken } from "../fixtures/candidates";
import styles from "./ApplyPage.module.css";

const steps = [
  { label: "Resume" },
  { label: "Review" },
  { label: "Questions" },
  { label: "Submit" },
];

const stepTitles = [
  "Upload your resume",
  "Review your application",
  "Questions from the hiring team",
  "Submit your application",
];

type UploadState = {
  status: "idle" | "uploading" | "success";
  progress: number;
  fileName?: string;
};

type PersonCheck = "idle" | "checking" | "passed";

export function ApplyPage() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const [step, setStep] = useState(0);
  const [upload, setUpload] = useState<UploadState>({ status: "idle", progress: 0 });
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      filledSections.flatMap((section) => section.fields.map((field) => [field.id, field.value])),
    ),
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [personCheck, setPersonCheck] = useState<PersonCheck>("idle");
  const [certify, setCertify] = useState(false);
  const [attempted, setAttempted] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) {
        window.clearInterval(timer.current);
        window.clearTimeout(timer.current);
      }
    },
    [],
  );

  if (!job) {
    return (
      <p>
        That job is not open. <Link to="/">See all open jobs.</Link>
      </p>
    );
  }

  function isMissing(field: FilledField) {
    return Boolean(field.required) && (values[field.id] ?? "").trim() === "";
  }

  function problemsFor(stepIndex: number): string[] {
    if (stepIndex === 0) {
      return upload.status === "success"
        ? []
        : ["Upload your resume, or use the sample resume, to continue."];
    }
    if (stepIndex === 1) {
      return filledSections.flatMap((section) =>
        section.fields.filter(isMissing).map((field) => `${field.label}, under ${section.title}.`),
      );
    }
    if (stepIndex === 2) {
      return (job?.questions ?? [])
        .filter((question) => !question.optional && (answers[question.id] ?? "").trim() === "")
        .map((question) => `Answer: ${question.label}`);
    }
    const problems: string[] = [];
    if (personCheck !== "passed") problems.push("Finish the person check.");
    if (!certify) problems.push("Check the certification box.");
    return problems;
  }

  // Recomputed on every render, so the list shrinks as each problem is fixed.
  const problems = attempted[step] ? problemsFor(step) : [];

  function tryAdvance() {
    if (problemsFor(step).length > 0) {
      setAttempted((prev) => ({ ...prev, [step]: true }));
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
    setUpload({ status: "uploading", progress: 0, fileName });
    timer.current = window.setInterval(() => {
      setUpload((prev) => {
        const progress = Math.min(prev.progress + 9, 100);
        if (progress === 100) {
          if (timer.current !== null) window.clearInterval(timer.current);
          return { status: "success", progress, fileName: prev.fileName };
        }
        return { ...prev, progress };
      });
    }, 160);
  }

  function startPersonCheck() {
    setPersonCheck("checking");
    timer.current = window.setTimeout(() => setPersonCheck("passed"), 1400);
  }

  function setField(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function renderField(field: FilledField) {
    if (field.id === "authorized") {
      return (
        <div key={field.id} className={styles.fieldWrap}>
          <RadioGroup
            label={field.label}
            value={values[field.id] === "" ? null : values[field.id]}
            onChange={(value) => setField(field.id, value)}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </RadioGroup>
          {isMissing(field) ? (
            <div className={styles.chipRow}>
              <Badge variant="warning">Needs your answer</Badge>
            </div>
          ) : null}
        </div>
      );
    }
    const body = (
      <div key={field.id} className={styles.fieldWrap}>
        <TextField
          label={field.label}
          value={values[field.id] ?? ""}
          onChange={(value) => setField(field.id, value)}
          multiline={field.multiline}
          rows={field.multiline ? 4 : undefined}
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
    if (field.collapse) {
      return (
        <Disclosure
          key={field.id}
          title={field.collapse.title}
          detail={field.collapse.detail}
          headingLevel={3}
        >
          {body}
        </Disclosure>
      );
    }
    return body;
  }

  if (submitted) {
    return (
      <article>
        <h1 className={styles.title}>Application sent</h1>
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
      </article>
    );
  }

  return (
    <article>
      <p className={styles.employer}>
        Applying for {job.title} at {employer.name}
      </p>
      <h1 className={styles.title}>{stepTitles[step]}</h1>
      <Stepper label="Application steps" steps={steps} current={step} onStepClick={goToStep} />

      {step === 0 ? (
        <section aria-label="Upload your resume" className={styles.stepBody}>
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
          {upload.status === "success" ? (
            <InlineAlert variant="success" title="Resume read.">
              AI filled the form from your resume. Next, review every field before anything is
              sent. In this demo the fill is simulated from the sample resume.
            </InlineAlert>
          ) : (
            <InlineAlert variant="info" title="How this works">
              AI can fill the application from your resume. You review every field before anything
              is sent. A person reviews every application.
            </InlineAlert>
          )}
        </section>
      ) : null}

      {step === 1 ? (
        <section aria-label="Review your application" className={styles.stepBody}>
          <InlineAlert variant="info" title="AI filled these fields from your resume.">
            Go down the list and fix anything wrong. Fields it could not read are marked "Needs
            your answer." Sending the application counts as your sign-off on every field.
          </InlineAlert>
          {filledSections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`${section.id}-heading`}
              className={styles.formSection}
            >
              <h2 id={`${section.id}-heading`} className={styles.h2}>
                {section.title}
              </h2>
              {section.fields.map(renderField)}
            </section>
          ))}
        </section>
      ) : null}

      {step === 2 ? (
        <section aria-label="Questions from the hiring team" className={styles.stepBody}>
          <p className={styles.body}>These are yours to answer. AI does not write them for you.</p>
          {job.questions.map((question) => (
            <TextField
              key={question.id}
              label={question.label}
              hint={question.hint}
              value={answers[question.id] ?? ""}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
              multiline
              rows={3}
              errorMessage={
                attempted[2] && !question.optional && (answers[question.id] ?? "").trim() === ""
                  ? "Needs your answer."
                  : undefined
              }
            />
          ))}
        </section>
      ) : null}

      {step === 3 ? (
        <section aria-label="Summary and submit" className={styles.stepBody}>
          <h2 className={styles.h2}>Summary</h2>
          <dl className={styles.summary}>
            <dt>Name</dt>
            <dd>{values.name}</dd>
            <dt>Email</dt>
            <dd>{values.email}</dd>
            <dt>Phone</dt>
            <dd>{values.phone}</dd>
            <dt>Job</dt>
            <dd>
              {job.title}, {employer.name}
            </dd>
            <dt>Resume</dt>
            <dd>{upload.fileName ?? "none"}</dd>
            <dt>Questions answered</dt>
            <dd>
              {
                job.questions.filter((question) => (answers[question.id] ?? "").trim() !== "")
                  .length
              }{" "}
              of {job.questions.length}
            </dd>
          </dl>

          <section aria-labelledby="person-check-heading" className={styles.formSection}>
            <h2 id="person-check-heading" className={styles.h2}>
              Person check
            </h2>
            <p className={styles.body}>
              Bots and AI agents apply to jobs at volume. This quick check keeps them out, so a
              person reads your application sooner.
            </p>
            <div aria-live="polite" className={styles.personRow}>
              {personCheck === "idle" ? (
                <Button variant="secondary" onPress={startPersonCheck}>
                  Start the person check
                </Button>
              ) : personCheck === "checking" ? (
                <span className={styles.checking}>Checking your browser...</span>
              ) : (
                <Badge variant="success">Person check passed</Badge>
              )}
            </div>
            <p className={styles.demoNote}>In this demo the check is simulated.</p>
          </section>

          <Checkbox isSelected={certify} onChange={setCertify}>
            I certify that the information in this application is true and complete to the best of
            my knowledge. I understand that false or misleading answers can end my application, or
            my employment if found later.
          </Checkbox>
        </section>
      ) : null}

      {problems.length > 0 ? (
        <div className={styles.problems}>
          <InlineAlert
            variant="warning"
            title={step === 3 ? "Before you submit" : "Before you continue"}
          >
            <ul className={styles.problemList}>
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </InlineAlert>
        </div>
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
