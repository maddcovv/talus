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

export type QuestionType = "short" | "long" | "yesno" | "select";

export interface JobQuestion {
  id: string;
  label: string;
  type: QuestionType;
  /** Choices, for select questions. */
  options?: string[];
  hint?: string;
  /** Optional questions never block the apply flow. */
  optional?: boolean;
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
  jobCode: string;
  /** e.g. "December 15, 2026", or null when applications stay open. */
  deadline: string | null;
  pay: string;
  /** Bonus, overtime or premium pay, when the role has any. */
  bonusNote?: string;
  /** One or two sentences on shift, hours and where the work happens. */
  schedule: string;
  /** Short form for the summary card, e.g. "Mon to Fri, 7:00 am to 3:30 pm". */
  scheduleShort: string;
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
  /** The apply flow asks for an optional cover letter. */
  coverLetter?: boolean;
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
  /** The matching line quoted from the resume, or null when none was found. */
  quote: string | null;
  where?: string;
}

export interface AiLogEntry {
  id: string;
  when: string;
  where: string;
  what: "Filled an application" | "Suggested evidence" | "Drafted job setup";
  reviewedBy: string;
  reviewedOn: string;
}
