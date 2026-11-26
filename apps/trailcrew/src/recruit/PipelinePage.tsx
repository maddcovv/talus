import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  CircleDashed,
  DeviceMobile,
  EnvelopeSimple,
  Robot,
} from "@phosphor-icons/react";
import {
  Board,
  BoardCard,
  BoardColumn,
  Button,
  DataTable,
  Select,
  SelectItem,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Toast,
  ToastRegion,
  type DataTableColumn,
  type Selection,
  type SortDescriptor,
} from "@talus/react";
import { Blaze } from "../components/Blaze";
import { SourceMark } from "../components/SourceMark";
import { Tally } from "../components/Tally";
import { candidatesForJob, evidenceFor, needsDanaWhy, rankedFor } from "../fixtures/candidates";
import { aiLogCsv, aiLogForJob } from "../fixtures/ailog";
import { getJob } from "../fixtures/jobs";
import { ActivityTable } from "./AiActivityPage";
import {
  personCheckWords,
  stageOrder,
  stageTitles,
  type Candidate,
  type Job,
  type StageId,
} from "../fixtures/types";
import styles from "./PipelinePage.module.css";

const tableColumns: DataTableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "stage", label: "Stage" },
  { key: "evidence", label: "Evidence", sortable: true },
  { key: "source", label: "Source" },
  { key: "applied", label: "Applied", sortable: true },
  { key: "waiting", label: "Waiting", sortable: true, align: "end" },
];

const sources = ["Company site", "Referral", "Job board", "Career fair"];

const checkIcons = {
  "verified-text": DeviceMobile,
  "verified-email": EnvelopeSimple,
  "likely-automated": Robot,
  "not-checked": CircleDashed,
} as const;

/** What fills an empty column, in words. */
const emptyColumn: Record<StageId, string> = {
  applied: "No new applications. The careers site sends them here.",
  review: "Nothing in review. Dana moves applications here as she reads.",
  interview: "No interviews on the books yet.",
  offer: "No offers yet. People land here when Dana sends one.",
  hired: "No hires yet this season.",
  closed: "Nothing closed.",
};

function appliedDay(candidate: Candidate): number {
  return Number.parseInt(candidate.appliedOn.replace("Nov ", ""), 10);
}

/** How many requirements have a matched line. Coverage, never a score. */
function covered(candidate: Candidate, job: Job): number {
  return evidenceFor(candidate, job.requirements).filter((row) => row.quotes.length > 0).length;
}

export function PipelinePage() {
  const { jobId = "" } = useParams();
  const job = getJob(jobId);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") ?? "board";
  const [rows, setRows] = useState<Candidate[]>(() => candidatesForJob(jobId));
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [hideAutomated, setHideAutomated] = useState(false);
  const [selected, setSelected] = useState<Selection>(new Set());
  const [bulkStage, setBulkStage] = useState<string | null>(null);
  const [sort, setSort] = useState<SortDescriptor>({ column: "name", direction: "ascending" });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRows(candidatesForJob(jobId));
    setSelected(new Set());
    setFilterStage("all");
    setFilterSource("all");
  }, [jobId]);

  if (!job) {
    return (
      <p>
        That job does not exist. <Link to="/recruit">Back to Jobs.</Link>
      </p>
    );
  }

  const bySource = rows.filter(
    (candidate) =>
      (filterSource === "all" || candidate.source === filterSource) &&
      (!hideAutomated || candidate.personCheck !== "likely-automated"),
  );
  const tableRows = bySource
    .filter((candidate) => filterStage === "all" || candidate.stage === filterStage)
    .sort((a, b) => {
      let order = 0;
      if (sort.column === "name") order = a.name.localeCompare(b.name);
      if (sort.column === "applied") order = appliedDay(a) - appliedDay(b);
      if (sort.column === "waiting") order = a.waitingDays - b.waitingDays;
      if (sort.column === "evidence") order = covered(a, job) - covered(b, job);
      return sort.direction === "descending" ? -order : order;
    });

  function moveOne(cardId: string, toColumnId: string) {
    setRows((all) =>
      all.map((candidate) =>
        candidate.id === cardId ? { ...candidate, stage: toColumnId as StageId } : candidate,
      ),
    );
  }

  function moveSelected() {
    if (!bulkStage) return;
    const ids =
      selected === "all" ? new Set(tableRows.map((row) => row.id)) : new Set([...selected]);
    setRows((all) =>
      all.map((candidate) =>
        ids.has(candidate.id) ? { ...candidate, stage: bulkStage as StageId } : candidate,
      ),
    );
    setToast(
      `Moved ${ids.size} ${ids.size === 1 ? "candidate" : "candidates"} to ${stageTitles[bulkStage as StageId]}.`,
    );
    setSelected(new Set());
  }

  function exportCsv() {
    const entries = aiLogForJob(jobId);
    const blob = new Blob([aiLogCsv(entries)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${jobId}-ai-activity.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const selectedCount = selected === "all" ? tableRows.length : selected.size;

  return (
    <article>
      <div className={styles.head}>
        <div>
          <p className={styles.crumbs}>
            <Link to="/recruit">All jobs</Link>
          </p>
          <h1 className={styles.title}>{job.title}</h1>
          <p className={styles.meta}>
            {rows.length} candidates {"·"} {job.applyLine}
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        <Select
          label="Stage"
          selectedKey={filterStage}
          onSelectionChange={(key) => setFilterStage(String(key))}
        >
          <SelectItem id="all">All stages</SelectItem>
          {[...stageOrder, "closed" as StageId].map((stage) => (
            <SelectItem key={stage} id={stage}>
              {stageTitles[stage]}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Source"
          selectedKey={filterSource}
          onSelectionChange={(key) => setFilterSource(String(key))}
        >
          <SelectItem id="all">All sources</SelectItem>
          {sources.map((source) => (
            <SelectItem key={source} id={source}>
              {source}
            </SelectItem>
          ))}
        </Select>
        <div className={styles.filterSwitch}>
          <Switch isSelected={hideAutomated} onChange={setHideAutomated}>
            Hide likely automated
          </Switch>
        </div>
      </div>

      <Tabs
        selectedKey={view}
        onSelectionChange={(key) => setSearchParams({ view: String(key) }, { replace: true })}
      >
        <TabList aria-label="Views of this job">
          <Tab id="board">Board</Tab>
          <Tab id="candidates">Candidates</Tab>
          <Tab id="rank">AI rank</Tab>
          <Tab id="ai">AI activity</Tab>
        </TabList>

        <TabPanel id="board">
          <div className={styles.boardWrap}>
            <Board
              aria-label={`${job.title} pipeline`}
              columns={stageOrder.map((stage) => ({ id: stage, title: stageTitles[stage] }))}
              onMove={moveOne}
            >
              {stageOrder.map((stage) => {
                const inStage = bySource.filter((candidate) => candidate.stage === stage);
                const totalWait = inStage.reduce(
                  (sum, candidate) => sum + candidate.waitingDays,
                  0,
                );
                return (
                  <BoardColumn
                    key={stage}
                    id={stage}
                    title={stageTitles[stage]}
                    count={inStage.length}
                    detail={
                      inStage.length > 0 ? `${totalWait} days waiting in total` : undefined
                    }
                    headingLevel={2}
                  >
                    {inStage.length === 0 ? (
                      <li className={styles.emptyCol}>{emptyColumn[stage]}</li>
                    ) : (
                      inStage.map((candidate) => {
                        const CheckIcon = checkIcons[candidate.personCheck];
                        const why = needsDanaWhy(candidate);
                        return (
                          <BoardCard
                            key={candidate.id}
                            id={candidate.id}
                            title={candidate.name}
                            onOpen={() => navigate(`/recruit/candidates/${candidate.id}`)}
                          >
                            <span className={styles.cardTop}>
                              <span className={styles.cardRole}>{candidate.currentRole}</span>
                              <Tally
                                days={candidate.waitingDays}
                                className={styles.cardTally}
                              />
                            </span>
                            <span className={styles.checkRow}>
                              <CheckIcon aria-hidden className={styles.checkIcon} />
                              {personCheckWords[candidate.personCheck]}
                            </span>
                            <span className={styles.cardFoot}>
                              <span className={styles.cardSource}>
                                <SourceMark source={candidate.source} />
                              </span>
                              {why ? (
                                <span className={styles.cardAsk}>
                                  <Blaze variant="double" className={styles.cardBlaze} />
                                  {why}
                                </span>
                              ) : null}
                            </span>
                          </BoardCard>
                        );
                      })
                    )}
                  </BoardColumn>
                );
              })}
            </Board>
          </div>
        </TabPanel>

        <TabPanel id="candidates">
          <p className={styles.coverageNote}>
            Evidence counts requirements with a matched resume line. The AI rank view orders by
            it; Dana decides.
          </p>
          {selectedCount > 0 ? (
            <div className={styles.bulkBar}>
              <span className={styles.bulkCount}>{selectedCount} selected</span>
              <Select
                label="Move to"
                placeholder="Pick a stage"
                selectedKey={bulkStage}
                onSelectionChange={(key) => setBulkStage(String(key))}
              >
                {stageOrder.map((stage) => (
                  <SelectItem key={stage} id={stage}>
                    {stageTitles[stage]}
                  </SelectItem>
                ))}
              </Select>
              <Button variant="secondary" isDisabled={!bulkStage} onPress={moveSelected}>
                Move
              </Button>
            </div>
          ) : null}
          <DataTable
            aria-label={`${job.title} candidates`}
            columns={tableColumns}
            items={tableRows}
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={setSelected}
            sortDescriptor={sort}
            onSortChange={setSort}
            emptyState="No candidates match these filters."
            renderCell={(candidate, key) => {
              switch (key) {
                case "name":
                  return (
                    <Link className={styles.nameLink} to={`/recruit/candidates/${candidate.id}`}>
                      {candidate.name}
                    </Link>
                  );
                case "stage":
                  return (
                    <span className={styles.stageCell}>
                      <Blaze
                        variant={needsDanaWhy(candidate) ? "double" : "single"}
                        className={styles.stageBlaze}
                      />
                      {stageTitles[candidate.stage]}
                    </span>
                  );
                case "evidence":
                  return `${covered(candidate, job)} of ${job.requirements.length}`;
                case "source":
                  return <SourceMark source={candidate.source} />;
                case "applied":
                  return <span className={styles.dateCell}>{candidate.appliedOn}</span>;
                case "waiting":
                  return `${candidate.waitingDays} ${candidate.waitingDays === 1 ? "day" : "days"}`;
                default:
                  return null;
              }
            }}
          />
        </TabPanel>

        <TabPanel id="rank">
          <p className={styles.coverageNote}>
            AI&apos;s reading order, from resume evidence against the posting. Advice only:
            everyone who applied is here, nobody is hidden or rejected by it, and Dana reads every
            application either way.
          </p>
          <ol className={styles.rankList}>
            {rankedFor(jobId).map((entry, index) => (
              <li key={entry.candidate.id} className={styles.rankRow}>
                <span className={styles.rankNum} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.rankMain}>
                  <span className={styles.rankHead}>
                    <Link
                      className={styles.nameLink}
                      to={`/recruit/candidates/${entry.candidate.id}`}
                    >
                      {entry.candidate.name}
                    </Link>
                    <span className={styles.rankStage}>
                      {stageTitles[entry.candidate.stage]}
                    </span>
                  </span>
                  <span className={styles.rankWhy}>
                    Matched {entry.covered} of {entry.total} requirements
                    {entry.top ? (
                      <span className={styles.rankQuote}> {"·"} "{entry.top}"</span>
                    ) : null}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </TabPanel>

        <TabPanel id="ai">
          <div className={styles.aiHead}>
            <p className={styles.coverageNote}>
              Every place AI touched this job, and the person who checked it.
            </p>
            <Button variant="secondary" onPress={exportCsv}>
              Export CSV
            </Button>
          </div>
          <ActivityTable rows={aiLogForJob(jobId)} showJob={false} />
        </TabPanel>
      </Tabs>

      <ToastRegion>
        {toast ? <Toast variant="success" title={toast} onDismiss={() => setToast(null)} /> : null}
      </ToastRegion>
    </article>
  );
}
