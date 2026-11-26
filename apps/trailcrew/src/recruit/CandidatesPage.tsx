import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Badge,
  DataTable,
  Select,
  SelectItem,
  type BadgeVariant,
  type DataTableColumn,
  type SortDescriptor,
} from "@talus/react";
import { candidates } from "../fixtures/candidates";
import { getJob } from "../fixtures/jobs";
import {
  personCheckWords,
  stageTitles,
  type Candidate,
  type PersonCheck,
  type StageId,
} from "../fixtures/types";
import styles from "./CandidatesPage.module.css";

const stageVariant: Record<StageId, BadgeVariant> = {
  applied: "neutral",
  review: "info",
  interview: "info",
  offer: "warning",
  hired: "success",
  closed: "neutral",
};

const checkVariant: Record<PersonCheck, BadgeVariant> = {
  "verified-text": "success",
  "verified-email": "success",
  "likely-automated": "warning",
  "not-checked": "neutral",
};

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
  const [checkFilter, setCheckFilter] = useState("all");
  const [sort, setSort] = useState<SortDescriptor>({ column: "name", direction: "ascending" });

  const rows = candidates
    .filter((candidate) => {
      if (checkFilter !== "all" && candidate.personCheck !== checkFilter) {
        if (
          !(
            checkFilter === "verified" &&
            (candidate.personCheck === "verified-text" || candidate.personCheck === "verified-email")
          )
        ) {
          return false;
        }
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
                <Badge variant={stageVariant[candidate.stage]}>
                  {stageTitles[candidate.stage]}
                </Badge>
              );
            case "personCheck":
              return (
                <Badge variant={checkVariant[candidate.personCheck]}>
                  {personCheckWords[candidate.personCheck]}
                </Badge>
              );
            case "source":
              return candidate.source;
            case "applied":
              return candidate.appliedOn;
            default:
              return null;
          }
        }}
      />
    </article>
  );
}
