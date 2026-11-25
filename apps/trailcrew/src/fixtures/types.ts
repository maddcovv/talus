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

export interface JobQuestion {
  id: string;
  label: string;
  hint?: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  type: "Full time" | "Seasonal" | "Remote, US";
  pay: string;
  summary: string[];
  requirements: string[];
  questions: JobQuestion[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  location: string;
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
