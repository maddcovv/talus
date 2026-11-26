export type StageId = "applied" | "review" | "interview" | "offer" | "hired" | "closed";

export const stageOrder: StageId[] = ["applied", "review", "interview", "offer", "hired"];

export const stageTitles: Record<StageId, string> = {
  applied: "Applied",
  review: "In review",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  closed: "Closed",
};

export type Source = "Company site" | "Referral" | "Job board" | "Career fair";

export type IdentityCheck = "needs" | "checked" | "not-started";

/** How the application passed, or did not pass, the person check. */
export type PersonCheck = "verified-text" | "verified-email" | "likely-automated" | "not-checked";

export const personCheckWords: Record<PersonCheck, string> = {
  "verified-text": "Verified by text code",
  "verified-email": "Verified by email code",
  "likely-automated": "Likely automated",
  "not-checked": "Not checked",
};

export type QuestionType = "long" | "choice";

export interface JobQuestion {
  id: string;
  label: string;
  /** Short form for the review step, e.g. "A component other teams used". */
  short?: string;
  type: QuestionType;
  /** The press-to-pick answers, for choice questions. */
  options?: string[];
  hint?: string;
}

export type Department = "Operations" | "Customer experience" | "Engineering";

export interface Job {
  id: string;
  title: string;
  department: Department;
  /** Display location: a city or "Remote (US)". */
  location: string;
  type: "Full time" | "Seasonal";
  workplace: "On site" | "Remote" | "Hybrid";
  flsa: "Exempt" | "Non-exempt";
  /** e.g. "November 7, 2026" */
  postedOn: string;
  /** e.g. "Nov 7", for the jobs index rows. */
  postedShort: string;
  jobCode: string;
  /** e.g. "December 15, 2026", or null when applications stay open. */
  deadline: string | null;
  /** e.g. "Dec 15", or null when applications stay open. */
  deadlineShort: string | null;
  /** The deadline line on the feature card, e.g. "Apply by December 15 · 20 days left". */
  applyLine: string;
  pay: string;
  /** The range alone, for the feature card, e.g. "$150,000 to $175,000". */
  payShort: string;
  /** Under the range on the feature card, e.g. "a year, plus a 10 percent bonus target". */
  payTail: string;
  /** Finishes the pay sentence on the posting, e.g. "plus an annual bonus target...". */
  payPlus?: string;
  /** One or two sentences on shift, hours and where the work happens. */
  schedule: string;
  /** Short form for the facts grid, e.g. "Full time, overlap 10 to 2 MT". */
  scheduleShort: string;
  /** The Where fact, e.g. "Remote, anywhere in the US". */
  whereLine: string;
  /** About the role: two short paragraphs. */
  summary: string[];
  /** Who you work with and who you report to. */
  team: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  /** Physical requirements, for roles that have them. */
  conditions?: string[];
  questions: JobQuestion[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  location: string;
  /** What they do today, from the resume. */
  currentRole: string;
  jobId: string;
  stage: StageId;
  appliedOn: string;
  stageDates: Partial<Record<StageId, string>>;
  source: Source;
  /** Days since the last stage change. */
  waitingDays: number;
  /** Interview happened but no scorecard was filed. */
  needsScorecard: boolean;
  /** Offer stage only: waiting on the hiring manager's approval. */
  offerNeedsApproval: boolean;
  identityCheck: IdentityCheck;
  personCheck: PersonCheck;
  /** Why the application looks automated, in words. */
  personCheckNote?: string;
  /** The candidate asked for a person to review their application. */
  reviewRequested: boolean;
  /** Closed stage only: the reason category, in words. */
  closedReason?: string;
}

export interface EvidenceRow {
  requirement: string;
  /** Verbatim lines quoted from the resume. Empty means no evidence found. */
  quotes: string[];
  where?: string;
  /** How the match came about, or what it leaves uncovered, in words. */
  note?: string;
  /** The quote covers part of the requirement and the note names the hole. */
  partial?: boolean;
}

