import { candidatesForJob } from "./candidates";
import type { AiLogEntry } from "./types";

/** Every place AI touched this job's candidates, who reviewed it and when. */
export function aiLogForJob(jobId: string): AiLogEntry[] {
  const entries: AiLogEntry[] = [
    {
      id: `${jobId}-setup`,
      when: "Nov 2",
      where: "Job setup",
      what: "Drafted job setup",
      reviewedBy: "Marcus Lee (hiring manager)",
      reviewedOn: "Nov 2",
    },
  ];
  for (const candidate of candidatesForJob(jobId)) {
    entries.push({
      id: `${candidate.id}-fill`,
      when: candidate.appliedOn,
      where: candidate.name,
      what: "Filled an application",
      reviewedBy: `${candidate.name} (candidate)`,
      reviewedOn: candidate.appliedOn,
    });
    if (candidate.stageDates.review) {
      entries.push({
        id: `${candidate.id}-evidence`,
        when: candidate.stageDates.review,
        where: candidate.name,
        what: "Suggested evidence",
        reviewedBy: "Dana Ruiz (recruiter)",
        reviewedOn: candidate.stageDates.review,
      });
    }
  }
  return entries;
}

export function aiLogCsv(entries: AiLogEntry[]): string {
  const header = "When,Where,What AI did,Reviewed by,Reviewed on";
  const rows = entries.map((entry) =>
    [entry.when, entry.where, entry.what, entry.reviewedBy, entry.reviewedOn]
      .map((value) => `"${value.replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header, ...rows].join("\n");
}
