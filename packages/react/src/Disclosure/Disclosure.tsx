import type { ReactNode } from "react";
import {
  Disclosure as AriaDisclosure,
  type DisclosureProps as AriaDisclosureProps,
  Button as AriaButton,
  DisclosurePanel,
  Heading,
} from "react-aria-components";
import { CaretRight } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./Disclosure.module.css";

export interface DisclosureProps extends Omit<AriaDisclosureProps, "className" | "children"> {
  /** The always-visible summary row. */
  title: ReactNode;
  /** Secondary text on the summary row, e.g. dates. */
  detail?: ReactNode;
  /** Heading level of the summary row, for the page outline. */
  headingLevel?: 2 | 3 | 4;
  /** The content revealed when the row is opened. */
  children: ReactNode;
  className?: string;
}

/**
 * A collapsible row: a heading with a trigger button and a panel below it.
 * The trigger carries aria-expanded and aria-controls; Enter and Space toggle.
 */
export function Disclosure({
  title,
  detail,
  headingLevel = 3,
  children,
  className,
  ...props
}: DisclosureProps) {
  return (
    <AriaDisclosure {...props} className={cx(styles.root, className)}>
      <Heading level={headingLevel} className={styles.heading}>
        <AriaButton slot="trigger" className={styles.trigger}>
          <CaretRight aria-hidden weight="bold" className={styles.caret} />
          <span className={styles.title}>{title}</span>
          {detail != null ? <span className={styles.detail}>{detail}</span> : null}
        </AriaButton>
      </Heading>
      <DisclosurePanel className={styles.panel}>{children}</DisclosurePanel>
    </AriaDisclosure>
  );
}
