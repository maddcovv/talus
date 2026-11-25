// June Halloran's sample resume as the AI fill sees it: field values with the
// source line each one came from. Phone, work authorization and one link have
// no source, so the form marks them "Needs your answer."

export interface FilledField {
  id: string;
  label: string;
  value: string;
  /** The line the AI read, shown by the SourceChip. */
  source?: { line: string; where: string };
  /** Must be answered before the application can continue. */
  required?: boolean;
  multiline?: boolean;
  /** When set, the field renders inside a collapsed Disclosure row. */
  collapse?: { title: string; detail?: string };
}

export interface FilledSection {
  id: string;
  title: string;
  fields: FilledField[];
}

export const sampleResumeName = "june-halloran-resume.pdf";
export const sampleResumeSize = "84 KB";

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
    id: "work",
    title: "Work history",
    fields: [
      {
        id: "job1",
        label: "What you did at Blue Mesa Software",
        collapse: { title: "Senior Frontend Engineer, Blue Mesa Software", detail: "2022 to now" },
        value:
          "Led the component library used by four product teams.\nShipped the accessibility pass that took dashboards to WCAG 2.1 AA.\nCut the checkout bundle by a third and wrote up how.\nRan the frontend side of the hiring loop.",
        source: {
          line: "Blue Mesa Software. Senior Frontend Engineer, 2022 to present.",
          where: "your resume, page 1",
        },
        multiline: true,
      },
      {
        id: "job2",
        label: "What you did at Cairn Analytics",
        collapse: { title: "Frontend Engineer, Cairn Analytics", detail: "2018 to 2022" },
        value:
          "Built dashboard views in React and TypeScript.\nOwned the charting layer and its tests.\nIntroduced Vitest and got the frontend to 80 percent coverage.",
        source: {
          line: "Cairn Analytics. Frontend Engineer, 2018 to 2022.",
          where: "your resume, page 2",
        },
        multiline: true,
      },
      {
        id: "job3",
        label: "What you did at Hogback Gear Works",
        collapse: { title: "Trail guide, Hogback Gear Works", detail: "2016 to 2018" },
        value:
          "Led day trips of up to twelve guests.\nKept the gear inventory and the booking calendar.",
        source: {
          line: "Hogback Gear Works. Trail guide, 2016 to 2018.",
          where: "your resume, page 2",
        },
        multiline: true,
      },
    ],
  },
  {
    id: "education",
    title: "Education",
    fields: [
      {
        id: "school",
        label: "Education",
        value: "BS Computer Science, Colorado State University, 2016",
        source: {
          line: "Colorado State University, BS Computer Science, 2016",
          where: "your resume, page 2",
        },
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
    ],
  },
  {
    id: "links",
    title: "Links",
    fields: [
      {
        id: "portfolio",
        label: "Portfolio",
        value: "junehalloran.example",
        source: { line: "junehalloran.example", where: "your resume, page 1" },
      },
      { id: "other-link", label: "Anything else you want us to see", value: "" },
    ],
  },
];
