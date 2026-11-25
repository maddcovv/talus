import { Button as AriaButton } from "react-aria-components";
import { Check } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./Stepper.module.css";
import utilStyles from "../shared/util.module.css";

export interface StepperStep {
  label: string;
}

export interface StepperProps {
  steps: StepperStep[];
  /** 0-based index of the current step. */
  current: number;
  /** When given, completed steps become buttons that go back to that step. */
  onStepClick?: (index: number) => void;
  /** Accessible name for the whole stepper, e.g. "Application steps". */
  label: string;
  className?: string;
}

export function Stepper({ steps, current, onStepClick, label, className }: StepperProps) {
  return (
    <nav aria-label={label} className={cx(styles.root, className)}>
      <ol className={styles.list}>
        {steps.map((step, i) => {
          const state = i < current ? "done" : i === current ? "current" : "upcoming";
          const clickable = state === "done" && onStepClick;
          return (
            <li
              key={step.label}
              className={styles.step}
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
            >
              {clickable ? (
                <AriaButton className={styles.stepButton} onPress={() => onStepClick(i)}>
                  <span aria-hidden className={styles.indicator}>
                    <Check weight="bold" className={styles.checkIcon} />
                  </span>
                  <span className={utilStyles.srOnly}>Completed: </span>
                  <span className={styles.stepLabel}>{step.label}</span>
                </AriaButton>
              ) : (
                <span className={styles.stepStatic}>
                  <span aria-hidden className={styles.indicator}>
                    {state === "done" ? <Check weight="bold" className={styles.checkIcon} /> : i + 1}
                  </span>
                  {state === "done" && <span className={utilStyles.srOnly}>Completed: </span>}
                  <span className={styles.stepLabel}>{step.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
