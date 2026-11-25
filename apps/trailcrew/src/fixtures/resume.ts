// June Halloran's sample resume as the AI fill sees it: field values with the
// source line each one came from. Phone, work authorization, sponsorship and
// two links have no source, so the form marks them "Needs your answer."

export interface FieldSource {
  /** The line the AI read, shown by the SourceChip. */
  line: string;
  where: string;
}

export interface FilledField {
  id: string;
  label: string;
  value: string;
  source?: FieldSource;
  /** Must be answered before the application can continue. */
  required?: boolean;
  multiline?: boolean;
  /** Short helper text under the field. */
  hint?: string;
}

export interface FilledSection {
  id: string;
  title: string;
  fields: FilledField[];
}

/** One job on the resume, split into the fields a person can correct. */
export interface WorkEntry {
  id: string;
  company: string;
  title: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  /** "I work here now": clears the end date. */
  current: boolean;
  /** What you did there, one line per bullet. */
  bullets: string;
  source?: FieldSource;
}

export interface EducationEntry {
  id: string;
  school: string;
  credential: string;
  year: string;
  source?: FieldSource;
}

export const sampleResumeName = "june-halloran-resume.pdf";
export const sampleResumeSize = "84 KB";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const filledSections: FilledSection[] = [
  {
    id: "contact",
    title: "Contact",
    fields: [
      {
        id: "name",
        label: "Full name",
        value: "June Halloran",
        source: { line: "June Halloran, frontend engineer", where: "your resume, page 1" },
      },
      {
        id: "email",
        label: "Email",
        value: "june.halloran@example.com",
        source: { line: "june.halloran@example.com", where: "your resume, page 1" },
      },
      { id: "phone", label: "Phone", value: "", required: true },
      {
        id: "location",
        label: "Location",
        value: "Fort Collins, Colorado",
        source: { line: "Fort Collins, CO", where: "your resume, page 1" },
      },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    fields: [
      {
        id: "skills",
        label: "Skills",
        value: "React, TypeScript, design systems, accessibility, testing",
        source: {
          line: "Skills: React, TypeScript, design systems, accessibility, testing",
          where: "your resume, page 1",
        },
      },
    ],
  },
  {
    id: "authorization",
    title: "Work authorization",
    fields: [
      {
        id: "authorized",
        label: "Are you authorized to work in the United States?",
        value: "",
        required: true,
      },
      {
        id: "sponsorship",
        label: "Will you now or in the future need visa sponsorship?",
        value: "",
        required: true,
      },
    ],
  },
  {
    id: "links",
    title: "Links",
    fields: [
      {
        id: "linkedin",
        label: "LinkedIn",
        value: "",
        hint: "Optional.",
      },
      {
        id: "portfolio",
        label: "Portfolio",
        value: "junehalloran.example",
        hint: "Optional.",
        source: { line: "junehalloran.example", where: "your resume, page 1" },
      },
      {
        id: "github",
        label: "GitHub",
        value: "",
        hint: "Optional.",
      },
    ],
  },
];

export const workEntries: WorkEntry[] = [
  {
    id: "blue-mesa",
    company: "Blue Mesa Software",
    title: "Senior Frontend Engineer",
    location: "Remote, from Fort Collins, Colorado",
    startMonth: "March",
    startYear: "2022",
    endMonth: "",
    endYear: "",
    current: true,
    bullets:
      "Led the component library used by four product teams.\nShipped the accessibility pass that took dashboards to WCAG 2.1 AA.\nCut the checkout bundle by a third and wrote up how.\nRan the frontend side of the hiring loop.",
    source: {
      line: "Blue Mesa Software. Senior Frontend Engineer, March 2022 to present.",
      where: "your resume, page 1",
    },
  },
  {
    id: "cairn",
    company: "Cairn Analytics",
    title: "Frontend Engineer",
    location: "Denver, Colorado",
    startMonth: "June",
    startYear: "2018",
    endMonth: "March",
    endYear: "2022",
    current: false,
    bullets:
      "Built dashboard views in React and TypeScript.\nOwned the charting layer and its tests.\nIntroduced Vitest and got the frontend to 80 percent coverage.",
    source: {
      line: "Cairn Analytics. Frontend Engineer, June 2018 to March 2022.",
      where: "your resume, page 2",
    },
  },
  {
    id: "hogback",
    company: "Hogback Gear Works",
    title: "Trail guide",
    location: "Salida, Colorado",
    startMonth: "May",
    startYear: "2016",
    endMonth: "June",
    endYear: "2018",
    current: false,
    bullets: "Led day trips of up to twelve guests.\nKept the gear inventory and the booking calendar.",
    source: {
      line: "Hogback Gear Works. Trail guide, May 2016 to June 2018.",
      where: "your resume, page 2",
    },
  },
];

export const educationEntries: EducationEntry[] = [
  {
    id: "csu",
    school: "Colorado State University",
    credential: "BS, Computer Science",
    year: "2016",
    source: {
      line: "Colorado State University, BS Computer Science, 2016",
      where: "your resume, page 2",
    },
  },
];
