import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CircleDashed,
  DeviceMobile,
  EnvelopeSimple,
  Robot,
} from "@phosphor-icons/react";
import {
  DataTable,
  Select,
  SelectItem,
  type DataTableColumn,
  type SortDescriptor,
} from "@talus/react";
import { Blaze } from "../components/Blaze";
import { SourceMark } from "../components/SourceMark";
import { candidates, needsDana } from "../fixtures/candidates";
import { getJob, jobs } from "../fixtures/jobs";
import {
  personCheckWords,
  stageOrder,
  stageTitles,
  type Candidate,
  type StageId,
} from "../fixtures/types";
import styles from "./CandidatesPage.module.css";

const checkIcons = {
  "verified-text": DeviceMobile,
  "verified-email": EnvelopeSimple,
  "likely-automated": Robot,
  "not-checked": CircleDashed,
} as const;

const columns: DataTableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "job", label: "Job" },
  { key: "stage", label: "Stage" },
  { key: "personCheck", label: "Person check" },
  { key: "source", label: "Source" },
  { key: "applied", label: "Applied", sortable: true },
];

function appliedDay(candidate: Candidate): number {
  return Number.parseInt(candidate.appliedOn.replace("Nov ", ""), 10) || 0;
}

export function CandidatesPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [jobFilter, setJobFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [checkFilter, setCheckFilter] = useState("all");
  const [sort, setSort] = useState<SortDescriptor>({ column: "applied", direction: "descending" });

  const rows = candidates
    .filter((candidate) => {
      if (jobFilter !== "all" && candidate.jobId !== jobFilter) return false;
      if (stageFilter !== "all" && candidate.stage !== stageFilter) return false;
      if (checkFilter === "verified") {
        if (
          candidate.personCheck !== "verified-text" &&
          candidate.personCheck !== "verified-email"
        ) {
          return false;
        }
      } else if (checkFilter !== "all" && candidate.personCheck !== checkFilter) {
        return false;
      }
      if (query === "") return true;
      const haystack =
        `${candidate.name} ${candidate.email} ${getJob(candidate.jobId)?.title ?? ""}`.toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => {
      let order = 0;
      if (sort.column === "name") order = a.name.localeCompare(b.name);
      if (sort.column === "applied") order = appliedDay(a) - appliedDay(b);
      return sort.direction === "descending" ? -order : order;
    });

  return (
    <article>
      <h1 className={styles.title}>Candidates</h1>
      <p className={styles.meta}>
        {query === "" ? (
          <>Everyone in the pipeline, across every job.</>
        ) : (
          <>
            {rows.length} of {candidates.length} match "{query}".{" "}
            <Link to="/recruit/candidates">Clear the search.</Link>
          </>
        )}
      </p>

      <div className={styles.filters}>
        <Select
          label="Job"
          selectedKey={jobFilter}
          onSelectionChange={(key) => setJobFilter(String(key))}
        >
          <SelectItem id="all">All jobs</SelectItem>
          {jobs.map((job) => (
            <SelectItem key={job.id} id={job.id}>
              {job.title}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Stage"
          selectedKey={stageFilter}
          onSelectionChange={(key) => setStageFilter(String(key))}
        >
          <SelectItem id="all">All stages</SelectItem>
          {[...stageOrder, "closed" as StageId].map((stage) => (
            <SelectItem key={stage} id={stage}>
              {stageTitles[stage]}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Person check"
          selectedKey={checkFilter}
          onSelectionChange={(key) => setCheckFilter(String(key))}
        >
          <SelectItem id="all">All</SelectItem>
          <SelectItem id="verified">Verified</SelectItem>
          <SelectItem id="likely-automated">Likely automated</SelectItem>
          <SelectItem id="not-checked">Not checked</SelectItem>
        </Select>
      </div>

      <DataTable
        aria-label="All candidates"
        className={styles.tableWrap}
        columns={columns}
        items={rows}
        sortDescriptor={sort}
        onSortChange={setSort}
        emptyState="No candidates match."
        renderCell={(candidate: Candidate, key) => {
          switch (key) {
            case "name":
              return (
                <Link className={styles.nameLink} to={`/recruit/candidates/${candidate.id}`}>
                  {candidate.name}
                </Link>
              );
            case "job":
              return getJob(candidate.jobId)?.title ?? "";
            case "stage":
              return (
                <span className={styles.stageCell}>
                  <Blaze
                    variant={needsDana(candidate) ? "double" : "single"}
                    className={styles.stageBlaze}
                  />
                  {stageTitles[candidate.stage]}
                </span>
              );
            case "personCheck": {
              const CheckIcon = checkIcons[candidate.personCheck];
              return (
                <span className={styles.checkCell}>
                  <CheckIcon aria-hidden className={styles.checkIcon} />
                  {personCheckWords[candidate.personCheck]}
                </span>
              );
            }
            case "source":
              return <SourceMark source={candidate.source} />;
            case "applied":
              return <span className={styles.dateCell}>{candidate.appliedOn}</span>;
            default:
              return null;
          }
        }}
      />
    </article>
  );
}
