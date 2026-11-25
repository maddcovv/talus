import type { Job } from "./types";

export const employer = {
  name: "Two Track Supply",
  blurb: "Outdoor gear, made and shipped from Salida, Colorado.",
};

export const recruiters = {
  recruiter: { name: "Dana Ruiz", role: "Recruiter" },
  hiringManager: { name: "Marcus Lee", role: "Hiring manager" },
};

export const jobs: Job[] = [
  {
    id: "warehouse-lead",
    title: "Warehouse Lead",
    location: "Salida, Colorado",
    type: "Full time",
    pay: "$56,000 to $64,000 a year",
    summary: [
      "You run the floor of our Salida warehouse: receiving, putaway, pick and pack, and the afternoon carrier pickups. A team of six looks to you for the plan each morning.",
      "This is a working lead role. You are on the floor most of the day, and you own the numbers: order accuracy, time to ship, and a dock that is safe to walk through.",
    ],
    requirements: [
      "Three or more years of warehouse or fulfillment work",
      "Experience leading a small team day to day",
      "Comfortable with inventory software and barcode scanners",
      "Forklift certification, or ready to get certified in your first month",
      "Able to lift 50 pounds regularly",
    ],
    questions: [
      {
        id: "dock-safety",
        label: "What does a safe loading dock look like to you?",
      },
      {
        id: "process-change",
        label: "Tell us about a time you changed a process that was slowing your team down.",
      },
    ],
  },
  {
    id: "customer-support",
    title: "Customer Support Specialist",
    location: "Remote, United States",
    type: "Remote, US",
    pay: "$44,000 to $52,000 a year",
    summary: [
      "You answer the people who bought our gear: where an order is, how a return works, which pack fits a 19 inch torso. Mostly email and chat, some phone.",
      "We measure whether the customer's problem ended, not how fast the ticket closed.",
    ],
    requirements: [
      "Two or more years in customer support",
      "Writes clearly and kindly under volume",
      "Has worked order, shipping and returns workflows",
      "Comfortable moving between chat, email and phone",
    ],
    questions: [
      {
        id: "damaged-order",
        label: "Walk us through answering a customer whose order arrived damaged.",
      },
      {
        id: "human-reply",
        label: "What makes a support reply feel human?",
      },
    ],
  },
  {
    id: "senior-frontend",
    title: "Senior Frontend Engineer",
    location: "Remote, United States",
    type: "Remote, US",
    pay: "$150,000 to $175,000 a year",
    summary: [
      "You build the storefront and the internal tools behind it, in React and TypeScript, on a small product team where engineers talk to customers.",
      "The next year includes rebuilding our checkout and growing a shared component library that two other teams already use.",
    ],
    requirements: [
      "Six or more years building web applications",
      "Deep React and TypeScript experience",
      "Has shipped and maintained a design system or component library",
      "Works accessibly and can speak to WCAG in practice",
      "Tests their work: unit and integration",
    ],
    questions: [
      {
        id: "component-api",
        label: "Tell us about a component API you designed that other people built on.",
      },
      {
        id: "system-or-not",
        label: "How do you decide when a pattern belongs in the design system?",
      },
      {
        id: "a11y-testing",
        label: "What is your approach to accessibility testing?",
      },
    ],
  },
  {
    id: "seasonal-fulfillment",
    title: "Seasonal Fulfillment Associate",
    location: "Salida, Colorado",
    type: "Seasonal",
    pay: "$19 to $22 an hour",
    summary: [
      "November through January, our busiest stretch. You pick, pack and label orders so they leave the building the day they come in.",
      "Shifts are morning or afternoon, and seasonal crew who want to stay are first in line for full time openings.",
    ],
    requirements: [
      "Available November through January",
      "Able to lift 40 pounds",
      "Careful attention to detail on pick and pack",
    ],
    questions: [
      {
        id: "shifts",
        label: "Which shifts are you available for?",
      },
      {
        id: "pick-pack",
        label: "Have you done pick and pack work before? Tell us a little about it.",
      },
    ],
  },
];

export function getJob(jobId: string | undefined): Job | undefined {
  return jobs.find((job) => job.id === jobId);
}
