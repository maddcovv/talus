import { candidates, evidenceFor, june } from "../fixtures/candidates";
import { getJob } from "../fixtures/jobs";
import { resumeLines, workEntries } from "../fixtures/resume";

// June's resume is one page, defined in fixtures/resume.ts. Every evidence
// quote the recruiter sees must be a verbatim line from it; anything the
// resume does not say shows as a gap, never as an invented quote.

const corpus = [
  ...resumeLines.map((line) => line.text),
  ...workEntries.flatMap((entry) => entry.bullets.split("\n")),
];

describe("evidence quotes", () => {
  it("every quote for June is a verbatim line on her one-page resume", () => {
    const job = getJob(june.jobId);
    if (!job) throw new Error("June's job is missing");
    const rows = evidenceFor(june, job.requirements);
    for (const row of rows) {
      if (row.quote === null) continue;
      const quote = row.quote;
      const found = corpus.filter((line) => line.includes(quote));
      // On failure, the diff names the quote that is not on the resume.
      expect({ quote, found: found.length > 0 }).toEqual({ quote, found: true });
      expect(row.where).toBe("Resume, page 1");
    }
  });

  it("the years requirement shows as a gap, because no line covers it", () => {
    const job = getJob(june.jobId);
    if (!job) throw new Error("June's job is missing");
    const rows = evidenceFor(june, job.requirements);
    expect(rows[0].quote).toBeNull();
    expect(rows.filter((row) => row.quote !== null).length).toBeGreaterThanOrEqual(3);
  });

  it("no candidate's evidence ever cites a page other than 1", () => {
    for (const candidate of candidates) {
      const job = getJob(candidate.jobId);
      if (!job) continue;
      for (const row of evidenceFor(candidate, job.requirements)) {
        if (row.where) expect(row.where).toBe("Resume, page 1");
      }
    }
  });
});
