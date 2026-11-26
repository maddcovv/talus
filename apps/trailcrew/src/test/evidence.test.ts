import { candidates, evidenceFor, june } from "../fixtures/candidates";
import { getJob } from "../fixtures/jobs";
import { resumeLines, workEntries } from "../fixtures/resume";

// June's resume is one page, defined in fixtures/resume.ts. Every evidence
// quote the recruiter sees must be a verbatim line from it; a match may cite
// more than one line, and anything the resume does not say shows in words,
// never as an invented quote.

const corpus = [
  ...resumeLines.map((line) => line.text),
  ...workEntries.flatMap((entry) => entry.bullets.split("\n")),
];

function juneRows() {
  const job = getJob(june.jobId);
  if (!job) throw new Error("June's job is missing");
  return evidenceFor(june, job.requirements);
}

describe("evidence quotes", () => {
  it("every cited line for June is verbatim on her one-page resume", () => {
    for (const row of juneRows()) {
      for (const quote of row.quotes) {
        const found = corpus.some((line) => line.includes(quote));
        expect({ quote, found }).toEqual({ quote, found: true });
      }
      if (row.quotes.length > 0) {
        expect(row.where).toBe("Resume, page 1");
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
