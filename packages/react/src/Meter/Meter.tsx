import { Meter as AriaMeter, Label } from "react-aria-components";
import { Warning } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./Meter.module.css";

export interface MeterProps {
  /** Visible label, e.g. "Attachment storage". */
  label: string;
  value: number;
  minValue?: number;
  maxValue: number;
  /** The numbers in words, e.g. "4 of 5 attachments used". */
  valueText: string;
  className?: string;
}

/**
 * A value against a limit. Over the limit the fill and the words turn to the
 * danger status color and a warning icon appears; the valueText should say
 * it in words too, e.g. "6 of 5 attachments. Remove one to continue."
 */
export function Meter({ label, value, minValue = 0, maxValue, valueText, className }: MeterProps) {
  const over = value > maxValue;
  return (
    <AriaMeter
      value={Math.min(Math.max(value, minValue), maxValue)}
      minValue={minValue}
      maxValue={maxValue}
      data-over={over || undefined}
      className={cx(styles.meter, className)}
    >
      {({ percentage }) => (
        <>
          <div className={styles.header}>
            <Label className={styles.label}>{label}</Label>
            <span className={styles.value}>
              {over && <Warning aria-hidden weight="fill" className={styles.overIcon} />}
              {valueText}
            </span>
          </div>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${percentage ?? 0}%` }} />
          </div>
        </>
      )}
    </AriaMeter>
  );
}
