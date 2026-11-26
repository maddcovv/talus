import { jobs } from "./jobs";
import { resumeLines, workEntries } from "./resume";
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

// Every candidate gets a resume of their own. Each requirement has a few
// line shapes, and every line carries a number derived from the candidate's
// place in the job's list, so no two candidates ever share a line.
type LineMaker = (ord: number) => string;

const lineMakers: Record<string, LineMaker[][]> = {
  "senior-frontend": [
    [
      (o) => `${6 + o} years building web applications, agency first, then product`,
      (o) => `Shipped web products for ${6 + o} years across two storefronts`,
      (o) => `Frontend engineer since ${2019 - o}, full stack before that`,
    ],
    [
      (o) => `React and TypeScript daily across ${2 + o} product teams`,
      (o) => `TypeScript strict mode over a ${40 + 5 * o}k line React codebase`,
      (o) => `Moved ${3 + o} legacy views to typed React without a freeze`,
    ],
    [
      (o) => `Maintained a ${12 + o} component design system used by three teams`,
      (o) => `Built the shared component library, ${18 + o} releases and counting`,
      (o) => `Ran design system reviews for ${2 + o} squads every sprint`,
    ],
    [
      (o) => `Took ${1 + o} products through a WCAG 2.1 AA audit`,
      (o) => `Closed ${38 + 3 * o} accessibility findings ahead of an AA audit`,
      (o) => `Keyboard and screen reader passes on every release since ${2021 - o}`,
    ],
    [
      (o) => `${70 + o} percent unit coverage on the storefront, integration on checkout`,
      (o) => `Wrote ${180 + 20 * o} Vitest tests and the integration harness around them`,
      (o) => `Unit and integration suites gate every merge, about ${3 + o} minutes end to end`,
    ],
  ],
  "warehouse-lead": [
    [
      (o) => `${3 + o} years receiving and fulfillment at a regional parts distributor`,
      (o) => `${3 + o} peak seasons on the floor of a furniture warehouse`,
      (o) => `Warehouse work since ${2020 - o}, receiving through outbound`,
    ],
    [
      (o) => `Ran a pick and pack crew of ${4 + o} on the afternoon shift`,
      (o) => `Led ${4 + o} temps through two holiday ramps without an injury`,
      (o) => `Trained and scheduled a dock team of ${4 + o}`,
    ],
    [
      (o) => `Daily cycle counts in Fishbowl, ${98 + o / 10} percent location accuracy`,
      (o) => `Ran NetSuite bins and RF scanners for ${2 + o} years`,
      (o) => `Cut mispicks ${20 + 5 * o} percent after relabeling the fast aisle`,
    ],
    [
      (o) => `Forklift certified, sit down and stand up, renewed ${2023 - (o % 3)}, ${1 + o} incidents free years`,
      (o) => `${1 + o} years on a reach truck in narrow aisles`,
      (o) => `Certified on counterbalance and pallet stackers, ${2 + o} years running both`,
    ],
    [
      (o) => `Loaded ${8 + o} trucks a day through peak season`,
      (o) => `Lifted 50 pounds through ${220 + 15 * o} picks a shift`,
      (o) => `Floor role for ${3 + o} years, lifting and walking all day`,
    ],
  ],
  "customer-support": [
    [
      (o) => `${2 + o} years on the support desk at a mail order nursery`,
      (o) => `Support for ${2 + o} years across retail and software`,
      (o) => `Front line support since ${2021 - o}, email first`,
    ],
    [
      (o) => `Wrote the ${10 + o} macros the rest of the team uses for order status`,
      (o) => `Closed ${1100 + 60 * o} tickets last year with top satisfaction marks`,
      (o) => `Turned ${5 + o} repeat questions into help center articles`,
    ],
    [
      (o) => `Handled ${900 + 50 * o} returns and reshipments end to end last year`,
      (o) => `Filed ${30 + 5 * o} carrier claims and won most of them`,
      (o) => `Owned order changes and address fixes for ${2 + o} storefronts`,
    ],
    [
      (o) => `Covered chat, email and phone, ${1 + o} years on the rotation`,
      (o) => `Took ${25 + 5 * o} conversations a day across three channels`,
      (o) => `Weekend phone rotation for ${1 + o} years without a miss`,
    ],
  ],
  "seasonal-fulfillment": [
    [
      (o) => `${1 + o} holiday seasons picking orders at a book warehouse`,
      (o) => `Free November through January, ${1 + o} seasons running`,
      (o) => `Seasonal warehouse work every winter since ${2023 - o}`,
    ],
    [
      (o) => `On my feet with totes up to 40 pounds, ${320 + 25 * o} cartons a shift`,
      (o) => `Moved ${300 + 25 * o} cartons a shift at a parcel depot`,
      (o) => `Comfortable lifting 40 pounds all day, ${1 + o} seasons proof`,
    ],
    [
      (o) => `${1200 + 80 * o} error free picks last December`,
      (o) => `Zero mislabels across ${2 + o} weeks of December staging`,
      (o) => `Caught ${10 + 2 * o} short picks before they shipped`,
    ],
  ],
};

const juneCorpus = [
  ...resumeLines.map((line) => line.text),
  ...workEntries.flatMap((entry) => entry.bullets.split("\n")),
];

const ordinals = new Map<string, number>();
for (const job of jobs) {
  let ord = 0;
  for (const candidate of candidates) {
    if (candidate.jobId === job.id) {
      ordinals.set(candidate.id, ord);
      ord += 1;
    }
  }
}

/** The candidate's whole resume, line by line. June's is the real fixture. */
export function resumeFor(candidate: Candidate): string[] {
  if (candidate.id === "june-halloran") return juneCorpus;
  const makers = lineMakers[candidate.jobId] ?? [];
  const ord = ordinals.get(candidate.id) ?? 0;
  return makers.map((variants, reqIdx) => variants[(ord + reqIdx) % variants.length](ord));
}

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
  const lines = resumeFor(candidate);
  return requirements.map((requirement, index) => {
    const found = (hash(candidate.id) + index) % 3 !== 1;
    return {
      requirement,
      quotes: found && lines[index] ? [lines[index]] : [],
      where: found ? "Resume, page 1" : undefined,
    };
  });
}

export interface Coverage {
  full: number;
  partial: number;
  total: number;
}

/** One evidence source for the rank view and the tables. */
export function coverageFor(rows: EvidenceRow[]): Coverage {
  return {
    full: rows.filter((row) => row.quotes.length > 0 && !row.partial).length,
    partial: rows.filter((row) => row.partial).length,
    total: rows.length,
  };
}

export function coverageWords(coverage: Coverage): string {
  const base = `Matched ${coverage.full} of ${coverage.total}`;
  return coverage.partial > 0
    ? `${base}, ${coverage.partial} partial`
    : base;
}

/** The line with the most requirement coverage; ties go to the longest. */
function strongestLine(rows: EvidenceRow[]): string | null {
  const fullRows = rows.filter((row) => row.quotes.length > 0 && !row.partial && !row.note);
  const pool = fullRows.length > 0 ? fullRows : rows.filter((row) => row.quotes.length > 0);
  let best: string | null = null;
  let bestScore = -1;
  for (const row of pool) {
    for (const quote of row.quotes) {
      const cover = rows.filter((entry) => entry.quotes.includes(quote)).length;
      const score = cover * 1000 + quote.length;
      if (score > bestScore) {
        bestScore = score;
        best = quote;
      }
    }
  }
  return best;
}

export interface RankedCandidate {
  candidate: Candidate;
  coverage: Coverage;
  /** The strongest matched line, the one with the most requirement coverage. */
  top: string | null;
}

/**
 * AI's reading order for a job: full matches first, then partial ones, from
 * the same evidence the candidate page shows. Advice only: it includes
 * everyone, hides no one, and decides nothing.
 */
export function rankedFor(jobId: string): RankedCandidate[] {
  const job = jobs.find((entry) => entry.id === jobId);
  if (!job) return [];
  return candidatesForJob(jobId)
    .map((candidate) => {
      const rows = evidenceFor(candidate, job.requirements);
      return {
        candidate,
        coverage: coverageFor(rows),
        top: strongestLine(rows),
      };
    })
    .sort((a, b) => {
      const day = (entry: RankedCandidate) =>
        Number.parseInt(entry.candidate.appliedOn.replace("Nov ", ""), 10) || 0;
      return (
        b.coverage.full - a.coverage.full ||
        b.coverage.partial - a.coverage.partial ||
        day(b) - day(a) ||
        a.candidate.name.localeCompare(b.candidate.name)
      );
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
