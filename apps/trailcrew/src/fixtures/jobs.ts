import type { Department, Job } from "./types";

export const employer = {
  name: "Two Track Supply",
  blurb: "Outdoor gear, made and shipped from Salida, Colorado.",
  about: [
    "Two Track Supply makes packs, dry bags and camp hardware in Salida, Colorado, and ships them from the same building. About sixty people work across the shop floor, the warehouse and the support team.",
    "Most of us use the gear on weekends, which keeps the arguments about zipper placement honest. We post real pay ranges, answer every applicant, and a person makes every hiring decision.",
  ],
};

export const recruiters = {
  recruiter: { name: "Dana Ruiz", role: "Recruiter" },
  hiringManager: { name: "Marcus Lee", role: "Hiring manager" },
};

export const departments: Department[] = ["Operations", "Customer experience", "Engineering"];

/** Shown under pay on every posting. */
export const payNote =
  "The posted range is the whole range for the role. Where an offer lands in it depends on experience, and we tell you the number we are thinking before your final interview.";

/** One line on every posting. */
export const howToApply =
  "Apply with the button on this page. A resume is all you need to start: AI can fill the rest of the form from it, and you check every field before anything is sent.";

/** The fine print at the bottom of every posting. */
export const finePrint = [
  "Two Track Supply is an equal opportunity employer. We consider every qualified applicant without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability or veteran status.",
  "If you need an accommodation at any point in the hiring process, email jobs@twotracksupply.example or ask for a person from your status page, and we will set it up.",
  "A background check runs only after an offer, never before, and a person goes over anything it turns up with you before any decision is made.",
  "This description covers the main work of the role, not every task. Duties can shift with the season and the needs of the team.",
];

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
    jobCode: "TTS-26-041",
    deadline: "December 15, 2026",
    pay: "$56,000 to $64,000 a year",
    bonusNote:
      "Overtime is paid at time and a half. Holiday season Saturdays are voluntary and paid the same way.",
    schedule:
      "Monday to Friday, 7:00 am to 3:30 pm, on site at the Salida warehouse. The schedule is steady through the year; the only seasonal change is the optional Saturday shifts between Thanksgiving and mid January.",
    scheduleShort: "Mon to Fri, 7:00 am to 3:30 pm",
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
        id: "forklift",
        label: "Are you forklift certified today?",
        type: "yesno",
        hint: "No is a fine answer. We certify new leads in their first month.",
      },
      {
        id: "process-change",
        label: "Tell us about a time you changed a process that was slowing your team down.",
        type: "long",
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
    jobCode: "TTS-26-044",
    deadline: "December 15, 2026",
    pay: "$44,000 to $52,000 a year",
    bonusNote: "The monthly weekend rotation day carries a $75 shift payment.",
    schedule:
      "Full time, remote from anywhere in the United States. Core hours are 9 am to 3 pm Mountain and the rest of the day flexes around them. One weekend day a month on rotation, scheduled a month ahead.",
    scheduleShort: "Remote (US), core hours 9 am to 3 pm MT",
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
    coverLetter: true,
    questions: [
      {
        id: "damaged-order",
        label: "Walk us through answering a customer whose order arrived damaged.",
        type: "long",
      },
      {
        id: "human-reply",
        label: "What makes a support reply feel human?",
        type: "short",
      },
      {
        id: "helpdesk",
        label: "Have you worked in a helpdesk tool like Gorgias or Zendesk?",
        type: "yesno",
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
    jobCode: "TTS-26-042",
    deadline: "December 15, 2026",
    pay: "$150,000 to $175,000 a year",
    bonusNote: "Annual bonus target of 10 percent, paid on company results.",
    schedule:
      "Full time, remote from anywhere in the United States. The team overlaps 10 am to 2 pm Mountain and guards those hours for pairing and review. Two team weeks a year in Salida, travel paid.",
    scheduleShort: "Remote (US), overlap 10 am to 2 pm MT",
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
      "Medical, dental and vision insurance, with 90 percent of the premium paid for you and 75 percent for dependents",
      "401(k) with a 4 percent match, vested from day one",
      "Four weeks paid time off, seven paid holidays, and paid sick leave on top",
      "$1,500 a year for courses, conferences or books",
      "A home office budget, a 40 percent employee discount and a $200 a year gear allowance",
    ],
    coverLetter: true,
    questions: [
      {
        id: "component-api",
        label: "Tell us about a component API you designed that other people built on.",
        type: "long",
      },
      {
        id: "system-or-not",
        label: "How do you decide when a pattern belongs in the design system?",
        type: "long",
      },
      {
        id: "a11y-testing",
        label: "What is your approach to accessibility testing?",
        type: "long",
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
    postedOn: "October 27, 2026",
    jobCode: "TTS-26-038",
    deadline: null,
    pay: "$19 to $22 an hour",
    bonusNote:
      "A $1 an hour premium after 5 pm, and a $500 completion bonus if you stay through the end of January.",
    schedule:
      "November through January, on site in Salida. Morning shift is 6:00 am to 2:30 pm, afternoon shift is 2:00 pm to 10:30 pm. Pick your shift at hire; it stays yours for the season.",
    scheduleShort: "Nov to Jan, morning or afternoon shift",
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
        id: "shifts",
        label: "Which shift are you available for?",
        type: "select",
        options: [
          "Morning, 6:00 am to 2:30 pm",
          "Afternoon, 2:00 pm to 10:30 pm",
          "Either works for me",
        ],
      },
      {
        id: "pick-pack",
        label: "Have you done pick and pack work before?",
        type: "yesno",
      },
      {
        id: "pick-pack-detail",
        label: "If yes, tell us a little about that work.",
        type: "short",
        optional: true,
        hint: "Optional. A sentence is plenty.",
      },
    ],
  },
];

export function getJob(jobId: string | undefined): Job | undefined {
  return jobs.find((job) => job.id === jobId);
}
