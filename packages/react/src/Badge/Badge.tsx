import { cx } from "../cx";
import styles from "./Badge.module.css";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span {...props} data-variant={variant} className={cx(styles.badge, className)}>
      {children}
    </span>
  );
}
