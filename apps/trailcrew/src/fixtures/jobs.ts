import type { Job } from "./types";

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

/** Shown under pay on every posting. */
export const payNote =
  "The posted range is the whole range for the role. Where an offer lands in it depends on experience, and we tell you the number we are thinking before your final interview.";

/** The fine print at the bottom of every posting. */
export const finePrint = [
  "Two Track Supply is an equal opportunity employer. We consider every qualified applicant without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability or veteran status.",
  "If you need an accommodation at any point in the hiring process, say so in your application or ask for a person on your status page, and we will set it up.",
  "A background check runs only after an offer, never before, and a person goes over anything it turns up with you before any decision is made.",
];

export const jobs: Job[] = [
  {
    id: "warehouse-lead",
    title: "Warehouse Lead",
    location: "Salida, Colorado",
    type: "Full time",
    pay: "$56,000 to $64,000 a year",
    schedule:
      "Monday to Friday, 7:00 am to 3:30 pm, on site at the Salida warehouse. The occasional holiday season Saturday is paid at time and a half.",
    summary: [
      "You run the floor of our Salida warehouse: receiving, putaway, pick and pack, and the afternoon carrier pickups. A team of six looks to you for the plan each morning.",
      "This is a working lead role. You are on the floor most of the day, and you own the numbers: order accuracy, time to ship, and a dock that is safe to walk through.",
    ],
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
      "Medical, dental and vision, with 75 percent of the premium paid",
      "401(k) with a 4 percent match",
      "Three weeks paid time off plus seven paid holidays",
      "40 percent employee discount on everything we make",
      "A $200 a year boot and gear allowance",
    ],
    conditions: [
      "Concrete floor, on your feet most of the shift",
      "Regular lifting to 50 pounds; anything heavier is a team lift",
      "The warehouse is heated, not air conditioned",
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
    location: "Remote (US)",
    type: "Full time",
    pay: "$44,000 to $52,000 a year",
    schedule:
      "Full time, remote from anywhere in the United States. Core hours are 9 am to 3 pm Mountain; the rest of the day flexes. One weekend day a month on rotation.",
    summary: [
      "You answer the people who bought our gear: where an order is, how a return works, which pack fits a 19 inch torso. Mostly email and chat, some phone.",
      "We measure whether the customer's problem ended, not how fast the ticket closed.",
    ],
    responsibilities: [
      "Answer email, chat and some phone, about 40 conversations a day once you are ramped",
      "Track orders, fix addresses, file carrier claims, and set up returns and repairs end to end",
      "Turn repeat questions into help center articles",
      "Flag product problems to the shop floor with photos and order numbers",
      "Keep notes other people can pick up mid-conversation",
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
      "Medical, dental and vision, with 75 percent of the premium paid",
      "401(k) with a 4 percent match",
      "Three weeks paid time off plus seven paid holidays",
      "A $500 home office stipend in your first month",
      "40 percent employee discount and an annual gear allowance",
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
      {
        id: "cover-letter",
        label: "Anything else you want to say? A short cover letter is welcome here.",
        hint: "Optional. Skip it if your application already says it.",
        optional: true,
      },
    ],
  },
  {
    id: "senior-frontend",
    title: "Senior Frontend Engineer",
    location: "Remote (US)",
    type: "Full time",
    pay: "$150,000 to $175,000 a year",
    schedule:
      "Full time, remote from anywhere in the United States. The team overlaps 10 am to 2 pm Mountain. Two team weeks a year in Salida, travel paid.",
    summary: [
      "You build the storefront and the internal tools behind it, in React and TypeScript, on a small product team where engineers talk to customers.",
      "The next year includes rebuilding our checkout and growing a shared component library that two other teams already build on.",
    ],
    responsibilities: [
      "Build and maintain the storefront, the checkout and the internal tools behind them",
      "Grow the shared component library, with reviews, docs and release notes other teams can trust",
      "Own accessibility on what you ship: keyboard paths, screen reader passes, WCAG 2.1 AA",
      "Write unit and integration tests as part of the work, not after it",
      "Pair with design on a component's API before anyone builds it",
      "Mentor two mid-level engineers through reviews and pairing",
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
      "Medical, dental and vision, with 90 percent of the premium paid",
      "401(k) with a 4 percent match",
      "Four weeks paid time off plus seven paid holidays",
      "$1,500 a year for courses, conferences or books",
      "A home office budget, a 40 percent employee discount and an annual gear allowance",
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
    schedule:
      "November through January, in Salida. Morning shift is 6:00 am to 2:30 pm, afternoon shift is 2:00 pm to 10:30 pm. Pick your shift at hire; it stays yours for the season.",
    summary: [
      "November through January is our busiest stretch. You pick, pack and label orders so they leave the building the day they come in.",
      "Seasonal crew who want to stay are first in line for full time openings. Three of last winter's crew are full time today.",
    ],
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
      "A $1 an hour shift premium after 5 pm",
      "40 percent employee discount from day one",
      "First in line for full time openings after the season",
    ],
    conditions: ["On your feet on a concrete floor", "Lifting to 40 pounds through the shift"],
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
