import {
  candidates,
  candidatesForJob,
  evidenceFor,
  june,
  rankedFor,
  resumeFor,
} from "../fixtures/candidates";
import { getJob, jobs } from "../fixtures/jobs";

// Every evidence quote the recruiter sees must be a verbatim line from that
// candidate's own resume. June's resume is the real one-page fixture; every
// other candidate carries generated lines of their own. Anything a resume
// does not say shows in words, never as an invented quote.

function juneRows() {
  const job = getJob(june.jobId);
  if (!job) throw new Error("June's job is missing");
  return evidenceFor(june, job.requirements);
}

describe("evidence quotes", () => {
  it("every cited line is verbatim on that candidate's own resume", () => {
    for (const candidate of candidates) {
      const job = getJob(candidate.jobId);
      if (!job) continue;
      const corpus = resumeFor(candidate);
      for (const row of evidenceFor(candidate, job.requirements)) {
        for (const quote of row.quotes) {
          const found = corpus.some((line) => line.includes(quote));
          expect({ who: candidate.id, quote, found }).toEqual({
            who: candidate.id,
            quote,
            found: true,
          });
        }
        if (row.quotes.length > 0) {
          expect(row.where).toBe("Resume, page 1");
        }
      }
    }
  });

  it("the years match is worked out from both date lines, and says so", () => {
    const years = juneRows()[0];
    expect(years.quotes).toHaveLength(2);
    expect(years.quotes[0]).toContain("March 2022 to present");
    expect(years.quotes[1]).toContain("June 2018 to March 2022");
    expect(years.note).toBe("AI worked this out from the dates. Check it.");
  });

  it("the testing match stays partial, with the hole named in words", () => {
    const testing = juneRows()[4];
    expect(testing.partial).toBe(true);
    expect(testing.quotes).toEqual(["Owned the charting layer and its tests."]);
    expect(testing.note).toContain("Integration testing isn't on the resume");
  });

  it("rank and the candidate page agree: June is 4 full and 1 partial, first", () => {
    const ranked = rankedFor("senior-frontend");
    expect(ranked).toHaveLength(candidatesForJob("senior-frontend").length);
    const first = ranked[0];
    expect(first.candidate.id).toBe("june-halloran");
    expect(first.coverage).toEqual({ full: 4, partial: 1, total: 5 });
    // Full matches order the list; partial ones break ties.
    for (let i = 1; i < ranked.length; i += 1) {
      const prev = ranked[i - 1].coverage;
      const here = ranked[i].coverage;
      expect(
        prev.full > here.full ||
          (prev.full === here.full && prev.partial >= here.partial),
      ).toBe(true);
    }
  });

  it("the why-line is strong evidence, never a job-title line", () => {
    const first = rankedFor("senior-frontend")[0];
    expect(first.top).toBe(
      "Shipped the accessibility pass that took dashboards to WCAG 2.1 AA.",
    );
  });

  it("no two candidates on a job share a why-line", () => {
    for (const job of jobs) {
      const tops = rankedFor(job.id)
        .map((entry) => entry.top)
        .filter((top): top is string => top !== null);
      expect(new Set(tops).size).toBe(tops.length);
    }
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
