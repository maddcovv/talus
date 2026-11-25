import { jobs } from "./jobs";
import type { Candidate, EvidenceRow, Source, StageId } from "./types";
import { stageOrder } from "./types";

// 39 invented names plus June Halloran. None belongs to a real hiring product.
const names = [
  "Priya Natarajan",
  "Cole Bratton",
  "Mara Odell",
  "Tomas Herrera",
  "Keisha Boyd",
  "Owen Fitzwater",
  "Lena Marsh",
  "Dev Rao",
  "Sofia Crane",
  "Jordan Pike",
  "Amara Diallo",
  "Felix Tran",
  "Noor Haddad",
  "Casey Lofgren",
  "Ivy Chen",
  "Ruth Calloway",
  "Theo Brandt",
  "Nia Okafor",
  "Gil Santos",
  "Harper Voss",
  "Dmitri Volkov",
  "Quinn Abernathy",
  "Rosa Jimenez",
  "Eli Thornton",
  "Maya Krishnan",
  "Walt Dempsey",
  "Zoe Castellano",
  "Ben Okada",
  "Tessa Grey",
  "Ray Whitfield",
  "Ana Petrova",
  "Hugo Lindqvist",
  "Imani Walker",
  "Seth Mercer",
  "Lucia Marino",
  "Kofi Mensah",
  "Erin Dulaney",
  "Pat Nowak",
  "Vera Lindholm",
];

const jobCycle = [
  "warehouse-lead",
  "senior-frontend",
  "customer-support",
  "warehouse-lead",
  "seasonal-fulfillment",
  "customer-support",
  "senior-frontend",
  "warehouse-lead",
  "seasonal-fulfillment",
  "customer-support",
];

const stageCycle: StageId[] = [
  "applied",
  "review",
  "applied",
  "interview",
  "review",
  "applied",
  "offer",
  "closed",
  "review",
  "interview",
  "applied",
  "hired",
  "applied",
  "closed",
  "review",
  "applied",
];

const sourceCycle: Source[] = [
  "Job board",
  "Company site",
  "Referral",
  "Company site",
  "Career fair",
  "Job board",
  "Referral",
  "Company site",
];

const locationCycle = [
  "Salida, Colorado",
  "Denver, Colorado",
  "Fort Collins, Colorado",
  "Pueblo, Colorado",
  "Remote (Ohio)",
  "Remote (Vermont)",
];

const closedReasons = [
  "Experience does not match the requirements",
  "Withdrew",
  "Timing or availability",
  "Location or work authorization",
];

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z]+/g, "-");
}

function email(name: string): string {
  return `${slug(name).replace(/-/g, ".")}@example.com`;
}

function stageDatesFor(stage: StageId, appliedDay: number): Partial<Record<StageId, string>> {
  const dates: Partial<Record<StageId, string>> = { applied: `Nov ${appliedDay}` };
  if (stage === "closed") {
    dates.closed = `Nov ${Math.min(appliedDay + 6, 30)}`;
    return dates;
  }
  const upto = stageOrder.indexOf(stage);
  for (let i = 1; i <= upto; i += 1) {
    dates[stageOrder[i]] = `Nov ${Math.min(appliedDay + i * 3, 30)}`;
  }
  return dates;
}

function makeCandidate(name: string, index: number): Candidate {
  const stage = stageCycle[index % stageCycle.length];
  const appliedDay = 3 + (index % 19);
  const waitingDays = (index * 7) % 13;
  return {
    id: slug(name),
    name,
    email: email(name),
    location: locationCycle[index % locationCycle.length],
    jobId: jobCycle[index % jobCycle.length],
    stage,
    appliedOn: `Nov ${appliedDay}`,
    stageDates: stageDatesFor(stage, appliedDay),
    source: sourceCycle[index % sourceCycle.length],
    waitingDays,
    needsScorecard: stage === "interview" && index % 4 === 3,
    offerNeedsApproval: stage === "offer" && index % 3 !== 2,
    identityCheck:
      stage === "offer" || stage === "hired"
        ? index % 4 === 0
          ? "needs"
          : "checked"
        : stage === "interview"
          ? index % 3 === 0
            ? "needs"
            : "checked"
          : "not-started",
    reviewRequested: index === 5 || index === 17,
    closedReason: stage === "closed" ? closedReasons[index % closedReasons.length] : undefined,
  };
}

export const june: Candidate = {
  id: "june-halloran",
  name: "June Halloran",
  email: "june.halloran@example.com",
  location: "Fort Collins, Colorado",
  jobId: "senior-frontend",
  stage: "interview",
  appliedOn: "Nov 12",
  stageDates: { applied: "Nov 12", review: "Nov 14", interview: "Nov 20" },
  source: "Company site",
  waitingDays: 5,
  needsScorecard: false,
  offerNeedsApproval: false,
  identityCheck: "checked",
  reviewRequested: false,
};

export const candidates: Candidate[] = [june, ...names.map(makeCandidate)];

export function getCandidate(id: string | undefined): Candidate | undefined {
  return candidates.find((candidate) => candidate.id === id);
}

export function candidatesForJob(jobId: string): Candidate[] {
  return candidates.filter((candidate) => candidate.jobId === jobId);
}

/** The status page token for the one demo application. */
export const statusToken = "june-halloran";

// Plausible resume lines per job, one per requirement, used as suggested
// evidence. A deterministic hash drops about a third, so "No evidence found"
// shows up naturally.
const evidencePools: Record<string, string[]> = {
  "warehouse-lead": [
    "Four years receiving and fulfillment at a regional parts distributor",
    "Ran a pick and pack crew of five on the afternoon shift",
    "Daily cycle counts in Fishbowl with RF scanners",
    "Forklift certified, sit down and stand up, renewed 2025",
    "Loaded and unloaded trucks through peak season",
  ],
  "customer-support": [
    "Three years on the support desk at a mail order nursery",
    "Wrote the macros the rest of the team used for order status",
    "Handled returns and reshipments end to end",
    "Covered chat and phone on the weekend rotation",
  ],
  "senior-frontend": [
    "Eight years building web applications, the last five in React",
    "TypeScript across the whole codebase, strict mode on",
    "Maintained the shared component library used by four teams",
    "Audited checkout against WCAG 2.1 AA and fixed every blocker",
    "Vitest unit tests and Playwright integration tests on every feature",
  ],
  "seasonal-fulfillment": [
    "Two holiday seasons picking orders at a book warehouse",
    "Comfortable on my feet with totes up to 40 pounds",
    "Picked with 99.8 percent accuracy last December",
  ],
};

function hash(text: string): number {
  let value = 0;
  for (let i = 0; i < text.length; i += 1) {
    value = (value * 31 + text.charCodeAt(i)) % 997;
  }
  return value;
}

export function evidenceFor(candidate: Candidate, requirements: string[]): EvidenceRow[] {
  if (candidate.id === "june-halloran") {
    return [
      {
        requirement: requirements[0],
        quote: "Eight years building for the web, senior for the last four",
        where: "Resume, page 1",
      },
      {
        requirement: requirements[1],
        quote: "React and TypeScript daily since 2018",
        where: "Resume, page 1",
      },
      {
        requirement: requirements[2],
        quote: "Led the component library used by four product teams at Blue Mesa",
        where: "Resume, page 1",
      },
      {
        requirement: requirements[3],
        quote: "Shipped the accessibility pass that took dashboards to WCAG 2.1 AA",
        where: "Resume, page 2",
      },
      { requirement: requirements[4], quote: null },
    ];
  }
  const pool = evidencePools[candidate.jobId] ?? [];
  return requirements.map((requirement, index) => {
    const found = (hash(candidate.id) + index) % 3 !== 1;
    return {
      requirement,
      quote: found ? (pool[index % pool.length] ?? null) : null,
      where: found ? `Resume, page ${(index % 2) + 1}` : undefined,
    };
  });
}

// Application answers shown on the recruiter's candidate page.
const answerPools: Record<string, string[]> = {
  "warehouse-lead": [
    "Clear lanes, nothing staged in the walk path, and everyone knows who is spotting. The dock plate gets checked every morning, not just after something slips.",
    "We were double handling returns. I moved inspection to the receiving bench, which cut a day off restock and freed an afternoon of labor a week.",
  ],
  "customer-support": [
    "First I tell them what happens next: a replacement ships today and they keep the damaged one until the carrier decides on pickup. Then I file the claim so they never deal with the carrier.",
    "It names the actual problem in the first line and makes one promise it keeps. No template smell, no fake apology stack.",
  ],
  "senior-frontend": [
    "I built the form field wrapper our teams use. The API took a label, help text and error as first class props, so skipping the label took effort instead of being the default.",
    "When the third team asks for it, or when two implementations drift apart in a way users can see.",
    "Keyboard first by hand, axe on every story in CI, and a screen reader pass before anything ships to the design system.",
  ],
  "seasonal-fulfillment": [
    "Weekday mornings all season, plus weekends after December 15.",
    "Two seasons at a book warehouse: pick to cart, pack to carrier boxes, end of day counts.",
  ],
};

export function answersFor(candidate: Candidate, questionCount: number): string[] {
  const pool = answerPools[candidate.jobId] ?? [];
  return Array.from({ length: questionCount }, (_, i) => pool[i % pool.length] ?? "");
}
