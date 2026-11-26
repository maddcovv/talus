// The audit log: every place AI touched hiring, who checked it, and what
// they did about it. Every number on the AI activity page is computed from
// these rows, which are generated from the candidate fixtures.

import { candidates } from "./candidates";
import { getJob, jobs, recruiters } from "./jobs";

export interface AiLogRow {
  id: string;
  /** Day heading, e.g. "Nov 25". */
  day: string;
  /** Time within the day, e.g. "5:14 PM". */
  when: string;
  jobId: string;
  job: string;
  /** What AI did, in plain words. */
  what: string;
  /** Who checked it, and what they did. */
  check: string;
}

function hash(text: string): number {
  let value = 0;
  for (let i = 0; i < text.length; i += 1) {
    value = (value * 31 + text.charCodeAt(i)) % 997;
  }
  return value;
}

function timeFor(id: string): string {
  const h = hash(id);
  const hour = 8 + (h % 9);
  const minute = (h * 7) % 60;
  const twelve = hour > 12 ? hour - 12 : hour;
  return `${twelve}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

function dayNumber(day: string): number {
  return Number.parseInt(day.replace("Nov ", ""), 10) || 0;
}

function build(): { rows: AiLogRow[]; touched: number; changed: number } {
  const rows: AiLogRow[] = [];
  let changed = 0;
  const touched = new Set<string>();

  for (const job of jobs) {
    rows.push({
      id: `${job.id}-posting`,
      day: "Nov 2",
      when: timeFor(job.id),
      jobId: job.id,
      job: job.title,
      what: `Drafted the posting for ${job.title}`,
      check: `${recruiters.hiringManager.name} rewrote the pay section and approved it`,
    });
    changed += 1;
  }

  for (const candidate of candidates) {
    const job = getJob(candidate.jobId);
    if (!job) continue;
    touched.add(candidate.id);
    const filled = candidate.id === "june-halloran" ? 14 : 11 + (hash(candidate.id) % 6);
    rows.push({
      id: `${candidate.id}-fill`,
      day: candidate.appliedOn,
      when: candidate.id === "june-halloran" ? "5:14 PM" : timeFor(`${candidate.id}-fill`),
      jobId: candidate.jobId,
      job: job.title,
      what: `Filled ${filled} of 17 answers for ${candidate.name}`,
      check: `${candidate.name} checked every field before sending`,
    });
    if (candidate.stageDates.review) {
      const matches = job.requirements.length;
      const removed = hash(`${candidate.id}-evidence`) % 2;
      changed += removed;
      rows.push({
        id: `${candidate.id}-evidence`,
        day: candidate.stageDates.review,
        when: timeFor(`${candidate.id}-evidence`),
        jobId: candidate.jobId,
        job: job.title,
        what: `Suggested ${matches} evidence matches for ${candidate.name}`,
        check:
          removed === 0
            ? `${recruiters.recruiter.name} kept all ${matches}`
            : `${recruiters.recruiter.name} kept ${matches - removed}, removed ${removed}`,
      });
    }
  }

  rows.sort((a, b) => dayNumber(b.day) - dayNumber(a.day) || a.job.localeCompare(b.job));
  return { rows, touched: touched.size, changed };
}

const built = build();

export const aiLog: AiLogRow[] = built.rows;

export function aiLogForJob(jobId: string): AiLogRow[] {
  return aiLog.filter((row) => row.jobId === jobId);
}

/** The honest headline, computed from the rows above. */
export const aiSummary = `AI touched ${built.touched} applications this month. People changed ${built.changed} of its suggestions.`;

export function aiLogCsv(rows: AiLogRow[]): string {
  const header = "Day,Time,Job,What AI did,Who checked it";
  const lines = rows.map((row) =>
    [row.day, row.when, row.job, row.what, row.check]
      .map((value) => `"${value.replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header, ...lines].join("\n");
}
