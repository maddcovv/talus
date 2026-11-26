import type { Department, Job } from "./types";

export const employer = {
  name: "Two Track Supply",
  blurb: "Outdoor gear, made and shipped from Salida, Colorado.",
  about: [
    "Two Track Supply makes packs, dry bags and camp hardware in Salida, Colorado, and ships them from the same building. About sixty people work across the shop floor, the warehouse and the support team.",
    "Most of us use the gear on weekends, which keeps the arguments about zipper placement honest.",
  ],
};

export const recruiters = {
  recruiter: { name: "Dana Ruiz", role: "Recruiter" },
  hiringManager: { name: "Marcus Lee", role: "Hiring manager" },
};

export const departments: Department[] = ["Operations", "Customer experience", "Engineering"];

export const departmentNotes: Record<Department, string> = {
  Operations: "The shop floor and the warehouse in Salida.",
  "Customer experience": "The people our customers talk to.",
  Engineering: "The storefront and the tools behind it.",
};

/** Shown under pay on every posting. */
export const payNote =
  "The posted range is the whole range for the role. Where an offer lands depends on experience, and we tell you the number we're thinking before your final interview.";

/** The four stops, the same on every posting. */
export const hiringStops = [
  {
    n: "1",
    title: "You apply",
    body: "Upload a resume, check what AI filled in, answer three questions.",
  },
  {
    n: "2",
    title: "A person reads it, within 5 days",
    body: "Dana Ruiz, our recruiter, reads every application herself.",
  },
  {
    n: "3",
    title: "Two conversations",
    body: "A 30 minute call with Dana, then a working session with the team. We send the topics ahead.",
  },
  {
    n: "4",
    title: "A decision, with a reason",
    body: "Yes or no, you hear it from a person, and we tell you why.",
  },
];

const startQuestion = {
  id: "start",
  label: "When could you start?",
  short: "Could start",
  type: "choice" as const,
  options: ["Within 2 weeks", "Within a month", "Later than that"],
};

const payHint =
  "Either answer is fine. Saying you'd like to talk doesn't take you out of the running.";
const payOptions = ["Yes, it works", "I'd like to talk about it"];

export const jobs: Job[] = [
  {
    id: "warehouse-lead",
    title: "Warehouse Lead",
    department: "Operations",
    location: "Salida, Colorado",
    type: "Full time",
    workplace: "On site",
    flsa: "Non-exempt",
    postedOn: "November 3, 2026",
    postedShort: "Nov 3",
    jobCode: "TTS-26-041",
    deadline: "December 15, 2026",
    deadlineShort: "Dec 15",
    applyLine: "Apply by December 15 · 20 days left",
    pay: "$56,000 to $64,000 a year",
    payShort: "$56,000 to $64,000",
    payTail: "a year, plus overtime at time and a half",
    payPlus: "plus overtime at time and a half. Holiday season Saturdays are voluntary and paid the same way.",
    schedule:
      "Monday to Friday, 7:00 am to 3:30 pm, on site at the Salida warehouse. The schedule is steady through the year; the only seasonal change is the optional Saturday shifts between Thanksgiving and mid January.",
    scheduleShort: "Mon to Fri, 7:00 to 3:30",
    whereLine: "On site in Salida, Colorado",
    summary: [
      "You run the floor of our Salida warehouse: receiving, putaway, pick and pack, and the afternoon carrier pickups. A team of six looks to you for the plan each morning, and the plan changes when trucks run late or a product drops, so you adjust it out loud, on the floor, where everyone can hear the why.",
      "This is a working lead role, not an office job. You are on the floor most of the day, and you own the numbers the rest of the company plans around: order accuracy, time to ship, and a dock that is safe to walk through at any hour.",
    ],
    team: "You lead a crew of six across receiving, picking and packing, and you report to Marcus Lee, who runs operations. Day to day you also work with purchasing on inbound trucks and with the support team on anything a customer is waiting on.",
    responsibilities: [
      "Plan the day for a crew of six across receiving, putaway, picking, packing and the 3:30 carrier pickup",
      "Walk the morning safety check and keep the dock clear, labeled and documented",
      "Run weekly cycle counts and chase down every variance the same week",
      "Train new hires on scanners, pallet jacks and the pack stations",
      "Clear receiving within a day so purchasing sees honest stock numbers",
      "Report order accuracy and time to ship at the Friday ops meeting",
      "Step into the line wherever the day needs you",
    ],
    requirements: [
      "Three or more years of warehouse or fulfillment work",
      "Experience leading a small team day to day",
      "Comfortable with inventory software and barcode scanners",
      "Forklift certification, or ready to get certified in your first month",
      "Able to lift 50 pounds regularly",
    ],
    niceToHave: [
      "Experience with Fishbowl, NetSuite or another inventory system",
      "An OSHA 10 card",
      "Spanish is a plus on our floor",
    ],
    benefits: [
      "Medical, dental and vision insurance, with 75 percent of the premium paid for you and 50 percent for dependents",
      "401(k) with a 4 percent match, vested from day one",
      "Three weeks paid time off, seven paid holidays, and Colorado paid sick leave that accrues from your first shift",
      "40 percent employee discount on everything we make",
      "A $200 a year boot and gear allowance",
    ],
    conditions: [
      "Lift up to 50 pounds regularly; anything heavier is a team lift",
      "Stand and walk on a concrete floor for most of the shift",
      "Forklift certification provided if you do not have it",
      "The warehouse is heated, not air conditioned",
    ],
    questions: [
      {
        id: "opener",
        label: "Tell us about a time you changed a process that was slowing your team down.",
        short: "A process you changed",
        hint: "What was slow, what you changed, and what happened after.",
        type: "long",
      },
      startQuestion,
      {
        id: "pay",
        short: "The pay range",
        label:
          "The pay is $56,000 to $64,000 a year, plus overtime at time and a half. Does that range work for you?",
        hint: payHint,
        type: "choice",
        options: payOptions,
      },
    ],
  },
  {
    id: "customer-support",
    title: "Customer Support Specialist",
    department: "Customer experience",
    location: "Remote (US)",
    type: "Full time",
    workplace: "Remote",
    flsa: "Non-exempt",
    postedOn: "November 10, 2026",
    postedShort: "Nov 10",
    jobCode: "TTS-26-044",
    deadline: "December 15, 2026",
    deadlineShort: "Dec 15",
    applyLine: "Apply by December 15 · 20 days left",
    pay: "$44,000 to $52,000 a year",
    payShort: "$44,000 to $52,000",
    payTail: "a year, plus a $75 weekend shift payment",
    payPlus: "plus a $75 payment for the monthly weekend rotation day.",
    schedule:
      "Full time, remote from anywhere in the United States. Core hours are 9 am to 3 pm Mountain and the rest of the day flexes around them. One weekend day a month on rotation, scheduled a month ahead.",
    scheduleShort: "Full time, core hours 9 to 3 MT",
    whereLine: "Remote, anywhere in the US",
    summary: [
      "You answer the people who bought our gear: where an order is, how a return works, which pack fits a 19 inch torso. Mostly email and chat, some phone. The questions repeat enough that you get fast, and vary enough that you never finish learning the product line.",
      "We measure whether the customer's problem actually ended, not how fast the ticket closed. If an answer takes three more minutes and saves a second email, take the three minutes.",
    ],
    team: "You join a support team of five, report to the customer experience lead, and talk to the warehouse and the shop floor every week, because the fastest fix for a support problem is often upstream of support.",
    responsibilities: [
      "Answer email, chat and some phone, about 40 conversations a day once you are ramped",
      "Track orders, fix addresses, file carrier claims, and set up returns and repairs end to end",
      "Turn repeat questions into help center articles",
      "Flag product problems to the shop floor with photos and order numbers",
      "Keep notes other people can pick up mid conversation",
      "Suggest the next gear honestly, including telling someone not to buy",
    ],
    requirements: [
      "Two or more years in customer support",
      "Writes clearly and kindly under volume",
      "Has worked order, shipping and returns workflows",
      "Comfortable moving between chat, email and phone",
    ],
    niceToHave: [
      "Gorgias, Zendesk or similar helpdesk experience",
      "You have used the gear: packs, paddles or a winter of skiing all count",
      "A second language, especially Spanish or French",
    ],
    benefits: [
      "Medical, dental and vision insurance, with 75 percent of the premium paid for you and 50 percent for dependents",
      "401(k) with a 4 percent match, vested from day one",
      "Three weeks paid time off, seven paid holidays, and paid sick leave that accrues from your first week",
      "A $500 home office stipend in your first month",
      "40 percent employee discount and a $200 a year gear allowance",
    ],
    questions: [
      {
        id: "opener",
        label: "Walk us through answering a customer whose order arrived damaged.",
        short: "A damaged order, answered",
        hint: "What you'd say first, and what you'd do behind the scenes.",
        type: "long",
      },
      startQuestion,
      {
        id: "pay",
        short: "The pay range",
        label: "The pay is $44,000 to $52,000 a year. Does that range work for you?",
        hint: payHint,
        type: "choice",
        options: payOptions,
      },
    ],
  },
  {
    id: "senior-frontend",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full time",
    workplace: "Remote",
    flsa: "Exempt",
    postedOn: "November 7, 2026",
    postedShort: "Nov 7",
    jobCode: "TTS-26-042",
    deadline: "December 15, 2026",
    deadlineShort: "Dec 15",
    applyLine: "Apply by December 15 · 20 days left",
    pay: "$150,000 to $175,000 a year",
    payShort: "$150,000 to $175,000",
    payTail: "a year, plus a 10 percent bonus target",
    payPlus: "plus an annual bonus target of 10 percent, paid on company results.",
    schedule:
      "Full time, remote from anywhere in the United States. The team overlaps 10 am to 2 pm Mountain and guards those hours for pairing and review. Two team weeks a year in Salida, travel paid.",
    scheduleShort: "Full time, overlap 10 to 2 MT",
    whereLine: "Remote, anywhere in the US",
    summary: [
      "You build the storefront and the internal tools behind it, in React and TypeScript, on a product team small enough that engineers talk to customers and decisions do not wait for a committee.",
      "The next year includes rebuilding our checkout and growing a shared component library that two other teams already build on. Both projects are funded, scoped and waiting on this hire.",
    ],
    team: "You join a product team of six engineers and two designers, report to the head of engineering, and pair weekly with design. Two mid level engineers will look to you for reviews and mentoring.",
    responsibilities: [
      "Build and maintain the storefront, the checkout and the internal tools behind them",
      "Grow the shared component library, with reviews, docs and release notes other teams can trust",
      "Own accessibility on what you ship: keyboard paths, screen reader passes, WCAG 2.1 AA",
      "Write unit and integration tests as part of the work, not after it",
      "Pair with design on a component's API before anyone builds it",
      "Mentor two mid level engineers through reviews and pairing",
    ],
    requirements: [
      "Six or more years building web applications",
      "Deep React and TypeScript experience",
      "Has shipped and maintained a design system or component library",
      "Works accessibly and can speak to WCAG in practice",
      "Tests their work: unit and integration",
    ],
    niceToHave: [
      "Design systems work at a company that actually shipped one",
      "Vite, Storybook and visual regression testing",
      "You have made a storefront measurably faster and can say how",
    ],
    benefits: [
      "Medical, dental and vision, with 90 percent of the premium paid for you and 75 percent for dependents",
      "401(k) with a 4 percent match, vested from day one",
      "Four weeks paid time off, seven paid holidays, and paid sick leave on top",
      "$1,500 a year for courses, conferences or books",
      "A home office budget, a 40 percent employee discount and a $200 a year gear allowance",
    ],
    questions: [
      {
        id: "opener",
        label:
          "Tell us about a component you built that other teams used. What did you change once they started using it?",
        short: "A component other teams used",
        hint: "What it was, who used it, and one thing you learned from them.",
        type: "long",
      },
      startQuestion,
      {
        id: "pay",
        short: "The pay range",
        label:
          "The pay is $150,000 to $175,000 a year, plus a 10 percent bonus target. Does that range work for you?",
        hint: payHint,
        type: "choice",
        options: payOptions,
      },
    ],
  },
  {
    id: "seasonal-fulfillment",
    title: "Seasonal Fulfillment Associate",
    department: "Operations",
    location: "Salida, Colorado",
    type: "Seasonal",
    workplace: "On site",
    flsa: "Non-exempt",
    postedOn: "November 12, 2026",
    postedShort: "Nov 12",
    jobCode: "TTS-26-038",
    deadline: null,
    deadlineShort: null,
    applyLine: "Open until filled",
    pay: "$19 to $22 an hour",
    payShort: "$19 to $22",
    payTail: "an hour, plus a $1 evening premium",
    payPlus: "plus a $1 an hour premium after 5 pm and a $500 bonus if you stay through January.",
    schedule:
      "November through January, on site in Salida. Morning shift is 6:00 am to 2:30 pm, afternoon shift is 2:00 pm to 10:30 pm. Pick your shift at hire; it stays yours for the season.",
    scheduleShort: "Nov to Jan, pick your shift",
    whereLine: "On site in Salida, Colorado",
    summary: [
      "November through January is our busiest stretch, when a quiet warehouse turns into the loudest room in Salida. You pick, pack and label orders so they leave the building the day they come in.",
      "Seasonal crew who want to stay are first in line for full time openings. Three of last winter's crew are full time today, and one of them is now the person who would train you.",
    ],
    team: "You work on a seasonal crew of ten, inside the regular warehouse team, and report to the Warehouse Lead on your shift.",
    responsibilities: [
      "Pick orders to cart with an RF scanner",
      "Pack to carrier boxes, add the packing slip, label and stage by carrier",
      "Count down one bin location at the end of each shift",
      "Keep your station stocked and swept",
    ],
    requirements: [
      "Available November through January",
      "Able to lift 40 pounds",
      "Careful attention to detail on pick and pack",
    ],
    niceToHave: [
      "Warehouse or retail stockroom experience",
      "Comfortable reading pick tickets and part numbers quickly",
    ],
    benefits: [
      "Paid weekly",
      "Colorado paid sick leave accrues from your first shift",
      "40 percent employee discount from day one",
      "First in line for full time openings after the season",
      "Seasonal roles are not eligible for medical insurance or the 401(k); full time roles are, and seasonal crew who convert get them on day one of the new role",
    ],
    conditions: [
      "Lift up to 40 pounds through the shift",
      "Stand and walk on a concrete floor for the full shift",
      "The warehouse is heated, not air conditioned",
    ],
    questions: [
      {
        id: "opener",
        label: "Have you done pick and pack work before? Tell us a little about it.",
        short: "Pick and pack before",
        hint: "No warehouse experience is fine too; say what kind of work you have done.",
        type: "long",
      },
      startQuestion,
      {
        id: "pay",
        short: "The pay range",
        label:
          "The pay is $19 to $22 an hour, plus a $1 premium after 5 pm. Does that range work for you?",
        hint: payHint,
        type: "choice",
        options: payOptions,
      },
    ],
  },
];

export function getJob(jobId: string | undefined): Job | undefined {
  return jobs.find((job) => job.id === jobId);
}

/** Roles that already ran their course, shown under the open list. */
export const closedJobs = [
  {
    id: "gear-repair",
    title: "Gear Repair Technician",
    closedOn: "November 3, 2026",
    note: "Filled. Sam Whitaker starts December 1.",
  },
  {
    id: "ops-coordinator",
    title: "Operations Coordinator",
    closedOn: "October 18, 2026",
    note: "Filled from the seasonal crew.",
  },
];
