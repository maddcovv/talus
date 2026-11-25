import { DisclosureGroup, type DisclosureGroupProps } from "react-aria-components";
import { cx } from "../cx";
import styles from "./Accordion.module.css";

export interface AccordionProps extends Omit<DisclosureGroupProps, "className"> {
  className?: string;
}

/**
 * A list of Disclosure rows drawn as one block. Several rows can be open at
 * once; pass allowsMultipleExpanded={false} for one at a time. Give each
 * child Disclosure an id so the group can track it.
 */
export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <DisclosureGroup allowsMultipleExpanded {...props} className={cx(styles.group, className)} />
  );
}
