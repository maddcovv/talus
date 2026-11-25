import { useState } from "react";
import { Badge, Button, InlineAlert, SourceChip, TextField } from "@talus/react";
import styles from "./JobSetupPage.module.css";

const sampleNotes = [
  "We need someone in Salida to run returns and warranty repairs. Full time.",
  "Pay lands around 50 to 58k.",
  "They should have sewn or repaired technical gear before: zippers, buckles, DWR coatings.",
  "Patience with customers matters as much as the stitching.",
  "Ask about a repair they are proud of, and how they decide repair versus replace.",
].join("\n");

interface DraftField {
  id: string;
  label: string;
  value: string;
  noteLine: string;
}

interface DraftSection {
  id: string;
  title: string;
  fields: DraftField[];
}

const draftSections: DraftSection[] = [
  {
    id: "basics",
    title: "Basics",
    fields: [
      {
        id: "title",
        label: "Job title",
        value: "Returns and Repairs Technician",
        noteLine: "run returns and warranty repairs",
      },
      {
        id: "location",
        label: "Location",
        value: "Salida, Colorado. Full time.",
        noteLine: "someone in Salida ... Full time",
      },
      {
        id: "pay",
        label: "Pay range",
        value: "$50,000 to $58,000 a year",
        noteLine: "Pay lands around 50 to 58k",
      },
    ],
  },
  {
    id: "requirements",
    title: "Requirements",
    fields: [
      {
        id: "req-1",
        label: "Requirement 1",
        value: "Has sewn or repaired technical gear",
        noteLine: "sewn or repaired technical gear before",
      },
      {
        id: "req-2",
        label: "Requirement 2",
        value: "Knows zippers, buckles and DWR coatings",
        noteLine: "zippers, buckles, DWR coatings",
      },
      {
        id: "req-3",
        label: "Requirement 3",
        value: "Patient, clear communication with customers",
        noteLine: "Patience with customers matters as much as the stitching",
      },
    ],
  },
  {
    id: "questions",
    title: "Questions for candidates",
    fields: [
      {
        id: "q-1",
        label: "Question 1",
        value: "Tell us about a repair you are proud of.",
        noteLine: "Ask about a repair they are proud of",
      },
      {
        id: "q-2",
        label: "Question 2",
        value: "How do you decide between repairing and replacing?",
        noteLine: "how they decide repair versus replace",
      },
    ],
  },
];

export function JobSetupPage() {
  const [notes, setNotes] = useState("");
  const [drafted, setDrafted] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [created, setCreated] = useState(false);

  const allConfirmed = draftSections.every((section) => confirmed[section.id]);

  function draft() {
    setValues(
      Object.fromEntries(
        draftSections.flatMap((section) => section.fields.map((field) => [field.id, field.value])),
      ),
    );
    setConfirmed({});
    setDrafted(true);
  }

  function setField(sectionId: string, fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setConfirmed((prev) => ({ ...prev, [sectionId]: false }));
  }

  if (created) {
    return (
      <article className={styles.wrap}>
        <h1 className={styles.title}>New job</h1>
        <InlineAlert variant="success" title="Job set up.">
          Returns and Repairs Technician is ready to post. Every drafted field was confirmed by a
          person. In this demo the job is not saved to the job list.
        </InlineAlert>
      </article>
    );
  }

  return (
    <article className={styles.wrap}>
      <h1 className={styles.title}>New job</h1>
      <p className={styles.lede}>
        Paste your kickoff notes. AI drafts the title, requirements and questions from them, each
        with its source, and you confirm every section before the job exists.
      </p>

      <TextField
        label="Kickoff notes"
        multiline
        rows={6}
        value={notes}
        onChange={setNotes}
        placeholder="What is the job, where, what matters, what would you ask?"
      />
      <div className={styles.noteActions}>
        <Button variant="secondary" onPress={() => setNotes(sampleNotes)}>
          Use sample notes
        </Button>
        <Button isDisabled={notes.trim() === ""} onPress={draft}>
          Draft from notes
        </Button>
      </div>

      {drafted ? (
        <div className={styles.sections}>
          <InlineAlert variant="info" title="AI drafted these fields from your notes.">
            Check each one against its source, then confirm each section.
          </InlineAlert>
          {draftSections.map((section) => {
            const isConfirmed = Boolean(confirmed[section.id]);
            return (
              <section
                key={section.id}
                aria-labelledby={`${section.id}-heading`}
                className={styles.section}
              >
                <div className={styles.sectionHead}>
                  <h2 id={`${section.id}-heading`} className={styles.h2}>
                    {section.title}
                  </h2>
                  {isConfirmed ? <Badge variant="success">Confirmed</Badge> : null}
                </div>
                {section.fields.map((field) => (
                  <div key={field.id} className={styles.fieldWrap}>
                    <TextField
                      label={field.label}
                      value={values[field.id] ?? ""}
                      onChange={(value) => setField(section.id, field.id, value)}
                    />
                    <div className={styles.chipRow}>
                      <span className={styles.aiLabel}>AI filled</span>
                      <SourceChip source="your notes">{field.noteLine}</SourceChip>
                    </div>
                  </div>
                ))}
                <div>
                  <Button
                    variant="secondary"
                    isDisabled={isConfirmed}
                    onPress={() => setConfirmed((prev) => ({ ...prev, [section.id]: true }))}
                  >
                    {isConfirmed ? "Confirmed" : `Confirm ${section.title.toLowerCase()}`}
                  </Button>
                </div>
              </section>
            );
          })}
          <div>
            <Button isDisabled={!allConfirmed} onPress={() => setCreated(true)}>
              Create job
            </Button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
