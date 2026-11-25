import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Popover,
} from "react-aria-components";
import { FileText } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./SourceChip.module.css";

export interface SourceChipProps {
  /** Where the value came from, without a leading "From", e.g. "your resume, page 1". */
  source: string;
  /** The source line the value was taken from, shown in the popover. */
  children: React.ReactNode;
  className?: string;
}

/**
 * A small chip beside a value that was filled in automatically. It names the
 * source and opens a popover with the line the value came from.
 */
export function SourceChip({ source, children, className }: SourceChipProps) {
  return (
    <DialogTrigger>
      <AriaButton
        className={cx(styles.chip, className)}
        aria-label={`Filled from ${source}. Show source`}
      >
        <FileText aria-hidden className={styles.icon} />
        <span>From {source}</span>
      </AriaButton>
      <Popover placement="bottom start" className={styles.popover}>
        <AriaDialog className={styles.dialog}>
          <Heading slot="title" className={styles.heading}>
            Source
          </Heading>
          <blockquote className={styles.quote}>{children}</blockquote>
          <p className={styles.cite}>From {source}</p>
        </AriaDialog>
      </Popover>
    </DialogTrigger>
  );
}
