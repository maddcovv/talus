// June Halloran's sample resume as the AI fill sees it: field values with the
// source line each one came from. Phone, work authorization and one link have
// no source, so the form marks them "Needs your answer."

export interface FilledField {
  id: string;
  label: string;
  value: string;
  /** The line the AI read, shown by the SourceChip. */
  source?: { line: string; where: string };
  /** Must be answered before its section can be confirmed. */
  required?: boolean;
  multiline?: boolean;
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
        label: "Most recent role",
        value: "Senior Frontend Engineer, Blue Mesa Software, 2022 to now",
        source: {
          line: "Blue Mesa Software. Senior Frontend Engineer, 2022 to present. Led the component library used by four product teams.",
          where: "your resume, page 1",
        },
        multiline: true,
      },
      {
        id: "job2",
        label: "Before that",
        value: "Frontend Engineer, Cairn Analytics, 2018 to 2022",
        source: {
          line: "Cairn Analytics. Frontend Engineer, 2018 to 2022. Built dashboard views in React and TypeScript.",
          where: "your resume, page 2",
        },
        multiline: true,
      },
      {
        id: "job3",
        label: "Earlier",
        value: "Trail guide, Hogback Gear Works, 2016 to 2018",
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
