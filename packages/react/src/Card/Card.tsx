import { Button as AriaButton } from "react-aria-components";
import { cx } from "../cx";
import styles from "./Card.module.css";

export interface CardProps {
  /** Lifts the card with elevation.1. */
  elevated?: boolean;
  /** Makes the whole card one press target, with a focus ring. */
  onPress?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Card({ elevated = false, onPress, children, className }: CardProps) {
  if (onPress) {
    return (
      <AriaButton
        onPress={onPress}
        data-elevated={elevated || undefined}
        className={cx(styles.card, styles.clickable, className)}
      >
        {children}
      </AriaButton>
    );
  }
  return (
    <div data-elevated={elevated || undefined} className={cx(styles.card, className)}>
      {children}
    </div>
  );
}
