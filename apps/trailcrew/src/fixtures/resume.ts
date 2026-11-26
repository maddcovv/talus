// June Halloran's sample resume as the AI fill sees it. The resume is one
// page, so every source points at page 1, and every claim in the apply flow
// maps to a line on the paper.

export interface FieldSource {
  /** The line the AI read. */
  line: string;
  where: string;
}

/** One contact field on the details step. */
export interface ContactField {
  id: string;
  label: string;
  value: string;
  /** Which resume line lights up when the field has focus. */
  lineKey: string | null;
  /** AI filled it from the resume. */
  filled: boolean;
}

/** One job on the resume. */
export interface WorkEntry {
  id: string;
  company: string;
  title: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  /** What you did there, one line per bullet. */
  bullets: string;
  /** Which resume line lights up for this job. */
  lineKey: string;
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
export const sampleResumePages = "1 page";

export const contactFields: ContactField[] = [
  { id: "name", label: "Full name", value: "June Halloran", lineKey: "name", filled: true },
  {
    id: "email",
    label: "Email",
    value: "june.halloran@example.com",
    lineKey: "contact",
    filled: true,
  },
  { id: "phone", label: "Phone", value: "", lineKey: null, filled: false },
  {
    id: "location",
    label: "Location",
    value: "Fort Collins, Colorado",
    lineKey: "contact",
    filled: true,
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
      "Led the component library used by four product teams.\nShipped the accessibility pass that took dashboards to WCAG 2.1 AA.\nCut the checkout bundle by a third and wrote up how.",
    lineKey: "j1",
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
    bullets: "Built dashboard views in React and TypeScript.\nOwned the charting layer and its tests.",
    lineKey: "j2",
    source: {
      line: "Cairn Analytics. Frontend Engineer, June 2018 to March 2022.",
      where: "your resume, page 1",
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
    lineKey: "j3",
    source: {
      line: "Hogback Gear Works. Trail guide, May 2016 to June 2018.",
      where: "your resume, page 1",
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
      where: "your resume, page 1",
    },
  },
];

/** The paper beside the form, line by line, as AI reads it. */
export interface ResumeLine {
  key: string;
  text: string;
  variant: "name" | "plain" | "head";
  /** Space to the next line. */
  gap: "tight" | "loose" | "none";
}

export const resumeLines: ResumeLine[] = [
  { key: "name", text: "June Halloran", variant: "name", gap: "tight" },
  {
    key: "contact",
    text: "Frontend engineer · Fort Collins, CO · june.halloran@example.com",
    variant: "plain",
    gap: "tight",
  },
  { key: "contact", text: "junehalloran.example", variant: "plain", gap: "loose" },
  {
    key: "skills",
    text: "Skills: React, TypeScript, design systems, accessibility, testing",
    variant: "plain",
    gap: "loose",
  },
  {
    key: "j1",
    text: "Blue Mesa Software. Senior Frontend Engineer, March 2022 to present.",
    variant: "head",
    gap: "tight",
  },
  {
    key: "j1",
    text: "Led the component library used by four product teams. Shipped the accessibility pass that took dashboards to WCAG 2.1 AA. Cut the checkout bundle by a third and wrote up how.",
    variant: "plain",
    gap: "loose",
  },
  {
    key: "j2",
    text: "Cairn Analytics. Frontend Engineer, June 2018 to March 2022.",
    variant: "head",
    gap: "tight",
  },
  {
    key: "j2",
    text: "Built dashboard views in React and TypeScript. Owned the charting layer and its tests.",
    variant: "plain",
    gap: "loose",
  },
  {
    key: "j3",
    text: "Hogback Gear Works. Trail guide, May 2016 to June 2018.",
    variant: "head",
    gap: "tight",
  },
  {
    key: "j3",
    text: "Led day trips of up to twelve guests. Kept the gear inventory and the booking calendar.",
    variant: "plain",
    gap: "loose",
  },
  {
    key: "edu",
    text: "Colorado State University, BS Computer Science, 2016",
    variant: "head",
    gap: "none",
  },
];
