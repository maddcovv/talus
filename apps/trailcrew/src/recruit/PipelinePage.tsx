import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Board,
  BoardCard,
  BoardColumn,
  Button,
  DataTable,
  Select,
  SelectItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  Toast,
  ToastRegion,
  type BadgeVariant,
  type DataTableColumn,
  type Selection,
  type SortDescriptor,
} from "@talus/react";
import { candidatesForJob } from "../fixtures/candidates";
import { getJob, jobs } from "../fixtures/jobs";
import {
  personCheckWords,
  stageOrder,
  stageTitles,
  type Candidate,
  type StageId,
} from "../fixtures/types";
import { Switch } from "@talus/react";
import styles from "./PipelinePage.module.css";

const stageVariant: Record<StageId, BadgeVariant> = {
  applied: "neutral",
  review: "info",
  interview: "info",
  offer: "warning",
  hired: "success",
  closed: "neutral",
};

const tableColumns: DataTableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "stage", label: "Stage" },
  { key: "source", label: "Source" },
  { key: "applied", label: "Applied", sortable: true },
  { key: "waiting", label: "Waiting", sortable: true, align: "end" },
];

const sources = ["Company site", "Referral", "Job board", "Career fair"];

function appliedDay(candidate: Candidate): number {
  return Number.parseInt(candidate.appliedOn.replace("Nov ", ""), 10);
}

export function PipelinePage() {
  const { jobId = "" } = useParams();
  const job = getJob(jobId);
  const navigate = useNavigate();
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
        That job does not exist. <Link to="/recruit">Back to Today.</Link>
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
    setToast(`Moved ${ids.size} ${ids.size === 1 ? "candidate" : "candidates"} to ${stageTitles[bulkStage as StageId]}.`);
    setSelected(new Set());
  }

  const selectedCount = selected === "all" ? tableRows.length : selected.size;

  return (
    <article>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>{job.title}</h1>
          <p className={styles.meta}>
            {rows.length} candidates. <Link to={`/recruit/jobs/${jobId}/ai-log`}>AI activity log</Link>
          </p>
        </div>
        <div className={styles.headActions}>
          <div className={styles.jobSwitch}>
            <Select
              label="Job"
              selectedKey={jobId}
              onSelectionChange={(key) => navigate(`/recruit/jobs/${String(key)}`)}
            >
              {jobs.map((item) => (
                <SelectItem key={item.id} id={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button variant="secondary" onPress={() => navigate("/recruit/jobs/new")}>
            New job
          </Button>
        </div>
      </div>

      <div className={styles.filters}>
        <Select label="Stage" selectedKey={filterStage} onSelectionChange={(key) => setFilterStage(String(key))}>
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

      <Tabs defaultSelectedKey="board">
        <TabList aria-label="Pipeline views">
          <Tab id="board">Board</Tab>
          <Tab id="table">Table</Tab>
        </TabList>
        <TabPanel id="board">
          <Board
            aria-label={`${job.title} pipeline`}
            columns={stageOrder.map((stage) => ({ id: stage, title: stageTitles[stage] }))}
            onMove={moveOne}
          >
            {stageOrder.map((stage) => {
              const inStage = bySource.filter((candidate) => candidate.stage === stage);
              const totalWait = inStage.reduce((sum, candidate) => sum + candidate.waitingDays, 0);
              return (
                <BoardColumn
                  key={stage}
                  id={stage}
                  title={stageTitles[stage]}
                  count={inStage.length}
                  detail={inStage.length > 0 ? `${totalWait} days waiting in total` : undefined}
                  headingLevel={2}
                >
                  {inStage.map((candidate) => (
                    <BoardCard key={candidate.id} id={candidate.id} title={candidate.name}>
                      <span className={styles.cardRole}>{candidate.currentRole}</span>
                      <span className={styles.cardMeta}>
                        Applied {candidate.appliedOn}, waiting {candidate.waitingDays}{" "}
                        {candidate.waitingDays === 1 ? "day" : "days"}.
                      </span>
                      {candidate.personCheck !== "likely-automated" ? (
                        <span className={styles.cardMeta}>
                          {personCheckWords[candidate.personCheck]}.
                        </span>
                      ) : null}
                      <span className={styles.cardTags}>
                        <Tag>{candidate.source}</Tag>
                        {candidate.personCheck === "likely-automated" ? (
                          <Badge variant="warning">Likely automated</Badge>
                        ) : null}
                        {candidate.reviewRequested ? (
                          <Badge variant="info">Asked for review</Badge>
                        ) : null}
                      </span>
                    </BoardCard>
                  ))}
                </BoardColumn>
              );
            })}
          </Board>
        </TabPanel>
        <TabPanel id="table">
          {selectedCount > 0 ? (
            <div className={styles.bulkBar}>
              <span className={styles.bulkCount}>
                {selectedCount} selected
              </span>
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
                    <Badge variant={stageVariant[candidate.stage]}>
                      {stageTitles[candidate.stage]}
                    </Badge>
                  );
                case "source":
                  return candidate.source;
                case "applied":
                  return candidate.appliedOn;
                case "waiting":
                  return `${candidate.waitingDays} ${candidate.waitingDays === 1 ? "day" : "days"}`;
                default:
                  return null;
              }
            }}
          />
        </TabPanel>
      </Tabs>

      <ToastRegion>
        {toast ? (
          <Toast variant="success" title={toast} onDismiss={() => setToast(null)} />
        ) : null}
      </ToastRegion>
    </article>
  );
}
