import { jobs } from "./jobs";
import type { Candidate, EvidenceRow, PersonCheck, Source, StageId } from "./types";
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

const currentRolePools: Record<string, string[]> = {
  "warehouse-lead": [
    "Shift lead at a regional parts distributor",
    "Receiving associate at a grocery distribution center",
    "Fulfillment supervisor at a print shop",
  ],
  "customer-support": [
    "Support specialist at a mail order nursery",
    "Help desk agent at a software reseller",
    "Customer care at a bike shop",
  ],
  "senior-frontend": [
    "Frontend engineer at an analytics startup",
    "UI engineer at a health records company",
    "Web developer at a small agency",
  ],
  "seasonal-fulfillment": [
    "Winters at a ski rental counter",
    "Stockroom associate at an outdoor retailer",
    "Student, picks up seasonal work",
  ],
};

const automatedNotes = [
  "Applied in 9 seconds from a throwaway email",
  "No typing on the form; every field arrived in one paste",
  "The same resume hit 11 jobs in an hour from one address",
];

function personCheckFor(index: number): { personCheck: PersonCheck; personCheckNote?: string } {
  if (index % 9 === 4) {
    return {
      personCheck: "likely-automated",
      personCheckNote: automatedNotes[index % automatedNotes.length],
    };
  }
  if (index % 5 === 3) return { personCheck: "not-checked" };
  return { personCheck: index % 2 === 0 ? "verified-text" : "verified-email" };
}

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
  const jobId = jobCycle[index % jobCycle.length];
  const rolePool = currentRolePools[jobId] ?? [];
  return {
    id: slug(name),
    name,
    email: email(name),
    location: locationCycle[index % locationCycle.length],
    currentRole: rolePool[index % rolePool.length] ?? "",
    jobId,
    stage,
    ...personCheckFor(index),
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

/**
 * June applied today, through the flow on the careers site, so she lands on
 * the recruiter side as a brand-new application: nothing reviewed, no notes.
 */
export const june: Candidate = {
  id: "june-halloran",
  name: "June Halloran",
  email: "june.halloran@example.com",
  location: "Fort Collins, Colorado",
  currentRole: "Senior Frontend Engineer at Blue Mesa Software",
  jobId: "senior-frontend",
  stage: "applied",
  personCheck: "verified-text",
  appliedOn: "Nov 25",
  stageDates: { applied: "Nov 25" },
  source: "Company site",
  waitingDays: 0,
  needsScorecard: false,
  offerNeedsApproval: false,
  identityCheck: "not-started",
  reviewRequested: false,
};

/** The interview-stage story June used to carry lives with Marisol now. */
export const marisol: Candidate = {
  id: "marisol-vega",
  name: "Marisol Vega",
  email: "marisol.vega@example.com",
  location: "Longmont, Colorado",
  currentRole: "UI engineer at a mapping startup",
  jobId: "senior-frontend",
  stage: "interview",
  personCheck: "verified-text",
  appliedOn: "Nov 12",
  stageDates: { applied: "Nov 12", review: "Nov 14", interview: "Nov 20" },
  source: "Company site",
  waitingDays: 5,
  needsScorecard: false,
  offerNeedsApproval: false,
  identityCheck: "checked",
  reviewRequested: false,
};

export const candidates: Candidate[] = [june, marisol, ...names.map(makeCandidate)];

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
    // Every quote is a verbatim line from her one-page resume in
    // fixtures/resume.ts. The years match is worked out from the two date
    // lines; the testing match is partial, with the hole named in words.
    return [
      {
        requirement: requirements[0],
        quotes: [
          "Blue Mesa Software. Senior Frontend Engineer, March 2022 to present.",
          "Cairn Analytics. Frontend Engineer, June 2018 to March 2022.",
        ],
        where: "Resume, page 1",
        note: "AI worked this out from the dates. Check it.",
      },
      {
        requirement: requirements[1],
        quotes: ["Built dashboard views in React and TypeScript."],
        where: "Resume, page 1",
      },
      {
        requirement: requirements[2],
        quotes: ["Led the component library used by four product teams."],
        where: "Resume, page 1",
      },
      {
        requirement: requirements[3],
        quotes: ["Shipped the accessibility pass that took dashboards to WCAG 2.1 AA."],
        where: "Resume, page 1",
      },
      {
        requirement: requirements[4],
        quotes: ["Owned the charting layer and its tests."],
        where: "Resume, page 1",
        partial: true,
        note: "Covers testing. Integration testing isn't on the resume. Ask about it in the interview.",
      },
    ];
  }
  const pool = evidencePools[candidate.jobId] ?? [];
  return requirements.map((requirement, index) => {
    const found = (hash(candidate.id) + index) % 3 !== 1;
    return {
      requirement,
      quotes: found && pool[index % pool.length] ? [pool[index % pool.length]] : [],
      where: found ? "Resume, page 1" : undefined,
    };
  });
}

/** True when this application waits on a person's decision, not on time. */
export function needsDana(candidate: Candidate): boolean {
  return needsDanaWhy(candidate) !== null;
}

/** The first reason a person is being waited on, in words, or null. */
export function needsDanaWhy(candidate: Candidate): string | null {
  if (candidate.stage === "closed" || candidate.stage === "hired") return null;
  if (candidate.reviewRequested) return "Asked for a review";
  if (candidate.identityCheck === "needs") return "Identity check to clear";
  if (candidate.stage === "offer" && candidate.offerNeedsApproval) {
    return "Offer waiting on approval";
  }
  if (candidate.needsScorecard) return "Scorecard not filed";
  if (candidate.personCheck === "likely-automated") return "A person decides";
  if (candidate.waitingDays > 5) return "Waiting on a decision";
  return null;
}

// Application answers shown on the recruiter's candidate page, in the order
// of the three questions every job asks: the opener, the start date, the pay.
const answerPools: Record<string, string[]> = {
  "warehouse-lead": [
    "We were double handling returns. I moved inspection to the receiving bench, which cut a day off restock and freed an afternoon of labor a week.",
    "Within a month",
    "Yes, it works",
  ],
  "customer-support": [
    "First I tell them what happens next: a replacement ships today and they keep the damaged one until the carrier decides on pickup. Then I file the claim so they never deal with the carrier.",
    "Within 2 weeks",
    "Yes, it works",
  ],
  "senior-frontend": [
    "I built the form field wrapper our teams use. The API took a label, help text and error as first class props, so skipping the label took effort instead of being the default.",
    "Within a month",
    "Yes, it works",
  ],
  "seasonal-fulfillment": [
    "Two seasons at a book warehouse: pick to cart, pack to carrier boxes, end of day counts.",
    "Within 2 weeks",
    "Yes, it works",
  ],
};

export function answersFor(candidate: Candidate, questionCount: number): string[] {
  const pool = answerPools[candidate.jobId] ?? [];
  return Array.from({ length: questionCount }, (_, i) => pool[i % pool.length] ?? "");
}
