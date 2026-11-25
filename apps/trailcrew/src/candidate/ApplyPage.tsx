import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Checkbox,
  FileUpload,
  InlineAlert,
  Radio,
  RadioGroup,
  SourceChip,
  Stepper,
  TextField,
} from "@talus/react";
import { employer, getJob } from "../fixtures/jobs";
import { filledSections, sampleResumeName } from "../fixtures/resume";
import { statusToken } from "../fixtures/candidates";
import styles from "./ApplyPage.module.css";

const steps = [
  { label: "Upload" },
  { label: "Review" },
  { label: "Questions" },
  { label: "Submit" },
];

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
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      filledSections.flatMap((section) => section.fields.map((field) => [field.id, field.value])),
    ),
  );
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    },
    [],
  );

  const allConfirmed = useMemo(
    () => filledSections.every((section) => confirmed[section.id]),
    [confirmed],
  );
  const allAnswered = useMemo(
    () => (job ? job.questions.every((question) => (answers[question.id] ?? "").trim() !== "") : false),
    [answers, job],
  );

  if (!job) {
    return (
      <p>
        That job is not open. <Link to="/">See all open jobs.</Link>
      </p>
    );
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

  function setField(sectionId: string, fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setConfirmed((prev) => ({ ...prev, [sectionId]: false }));
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
        {employer.name}: {job.title}
      </p>
      <h1 className={styles.title}>Apply</h1>
      <Stepper label="Application steps" steps={steps} current={step} onStepClick={setStep} />

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
            Check each one. Fields it could not fill are marked "Needs your answer." Confirm each
            section to move on.
          </InlineAlert>
          {filledSections.map((section) => {
            const isConfirmed = Boolean(confirmed[section.id]);
            const missing = section.fields.filter(
              (field) => field.required && (values[field.id] ?? "") === "",
            );
            return (
              <section
                key={section.id}
                aria-labelledby={`${section.id}-heading`}
                className={styles.formSection}
              >
                <div className={styles.sectionHead}>
                  <h2 id={`${section.id}-heading`} className={styles.h2}>
                    {section.title}
                  </h2>
                  {isConfirmed ? <Badge variant="success">Confirmed</Badge> : null}
                </div>
                {section.fields.map((field) =>
                  section.id === "authorization" ? (
                    <RadioGroup
                      key={field.id}
                      label={field.label}
                      value={values[field.id] === "" ? null : values[field.id]}
                      onChange={(value) => setField(section.id, field.id, value)}
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </RadioGroup>
                  ) : (
                    <div key={field.id} className={styles.fieldWrap}>
                      <TextField
                        label={field.label}
                        value={values[field.id] ?? ""}
                        onChange={(value) => setField(section.id, field.id, value)}
                        multiline={field.multiline}
                        rows={2}
                      />
                      <div className={styles.chipRow}>
                        {field.source ? (
                          <>
                            <span className={styles.aiLabel}>AI filled</span>
                            <SourceChip source={field.source.where}>{field.source.line}</SourceChip>
                          </>
                        ) : field.required && (values[field.id] ?? "") === "" ? (
                          <Badge variant="warning">Needs your answer</Badge>
                        ) : null}
                      </div>
                    </div>
                  ),
                )}
                <div className={styles.sectionActions}>
                  <Button
                    variant="secondary"
                    isDisabled={isConfirmed || missing.length > 0}
                    onPress={() => setConfirmed((prev) => ({ ...prev, [section.id]: true }))}
                  >
                    {isConfirmed ? "Confirmed" : `Confirm ${section.title.toLowerCase()}`}
                  </Button>
                  {!isConfirmed && missing.length > 0 ? (
                    <span className={styles.missingNote}>
                      Answer every field in this section to confirm it.
                    </span>
                  ) : null}
                </div>
              </section>
            );
          })}
        </section>
      ) : null}

      {step === 2 ? (
        <section aria-label="Job questions" className={styles.stepBody}>
          <p className={styles.body}>
            These are yours to answer. AI does not write them for you.
          </p>
          {job.questions.map((question) => (
            <TextField
              key={question.id}
              label={question.label}
              value={answers[question.id] ?? ""}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
              multiline
              rows={3}
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
            <dt>Job</dt>
            <dd>
              {job.title}, {employer.name}
            </dd>
            <dt>Resume</dt>
            <dd>{upload.fileName ?? "none"}</dd>
            <dt>Questions answered</dt>
            <dd>
              {job.questions.length} of {job.questions.length}
            </dd>
          </dl>
          <Checkbox isSelected={consent} onChange={setConsent}>
            This application is accurate, and it is mine to send.
          </Checkbox>
        </section>
      ) : null}

      <div className={styles.navRow}>
        {step > 0 ? (
          <Button variant="secondary" onPress={() => setStep(step - 1)}>
            Back
          </Button>
        ) : null}
        {step < 3 ? (
          <Button
            isDisabled={
              (step === 0 && upload.status !== "success") ||
              (step === 1 && !allConfirmed) ||
              (step === 2 && !allAnswered)
            }
            onPress={() => setStep(step + 1)}
          >
            Continue
          </Button>
        ) : (
          <Button isDisabled={!consent} onPress={() => setSubmitted(true)}>
            Submit application
          </Button>
        )}
      </div>
    </article>
  );
}
