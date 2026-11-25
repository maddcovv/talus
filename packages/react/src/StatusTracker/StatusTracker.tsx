import { CheckCircle, ArrowCircleRight, Circle, XCircle } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./StatusTracker.module.css";
import utilStyles from "../shared/util.module.css";

export type StatusTrackerState = "done" | "current" | "upcoming" | "closed";

export interface StatusTrackerStage {
  label: string;
  /** Already formatted, e.g. "Nov 12". */
  date?: string;
  state: StatusTrackerState;
  /** Required when state is "closed": why it closed, in plain words. */
  reason?: string;
}

export interface StatusTrackerProps {
  stages: StatusTrackerStage[];
  /** Accessible name for the tracker, e.g. "Application progress". */
  label: string;
  className?: string;
}

const stateWords: Record<StatusTrackerState, string> = {
  done: "Done",
  current: "Current stage",
  upcoming: "Upcoming",
  closed: "Closed",
};

const stateIcons: Record<StatusTrackerState, React.ReactNode> = {
  done: <CheckCircle weight="fill" />,
  current: <ArrowCircleRight weight="fill" />,
  upcoming: <Circle />,
  closed: <XCircle weight="fill" />,
};

export function StatusTracker({ stages, label, className }: StatusTrackerProps) {
  return (
    <ol aria-label={label} className={cx(styles.list, className)}>
      {stages.map((stage) => (
        <li
          key={stage.label}
          className={styles.stage}
          data-state={stage.state}
          aria-current={stage.state === "current" ? "step" : undefined}
        >
          <span aria-hidden className={styles.icon}>
            {stateIcons[stage.state]}
          </span>
          <div className={styles.text}>
            <span className={styles.label}>
              <span className={utilStyles.srOnly}>{stateWords[stage.state]}: </span>
              {stage.label}
            </span>
            {stage.date && <span className={styles.date}>{stage.date}</span>}
            {stage.state === "closed" && stage.reason && (
              <span className={styles.reason}>{stage.reason}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
