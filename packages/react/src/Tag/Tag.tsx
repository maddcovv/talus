import { cx } from "../cx";
import styles from "./Tag.module.css";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

/**
 * A small, quiet label for a fact: a skill, a source, a location.
 * Not a status; use Badge when the color carries meaning.
 */
export function Tag({ className, children, ...props }: TagProps) {
  return (
    <span {...props} className={cx(styles.tag, className)}>
      {children}
    </span>
  );
}
