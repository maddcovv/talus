import type { ReactNode } from "react";
import { cx } from "../cx";
import styles from "./DescriptionList.module.css";

export interface DescriptionListItem {
  /** Decorative icon for the row, hidden from assistive tech. */
  icon?: ReactNode;
  label: string;
  value: ReactNode;
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DescriptionListItem[];
}

/**
 * Key facts as a definition list: label over value, with an optional icon per
 * row. For facts like pay, location and dates. Statuses belong in a Badge,
 * and short labels in a Tag, not here.
 */
export function DescriptionList({ items, className, ...props }: DescriptionListProps) {
  const hasIcons = items.some((item) => item.icon);
  return (
    <dl {...props} className={cx(styles.list, className)}>
      {items.map((item) => (
        <div key={item.label} className={styles.row}>
          {hasIcons ? (
            <span aria-hidden className={styles.icon}>
              {item.icon}
            </span>
          ) : null}
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
