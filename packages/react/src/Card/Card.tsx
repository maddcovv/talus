import { Button as AriaButton } from "react-aria-components";
import { cx } from "../cx";
import styles from "./Card.module.css";

export interface CardProps {
  /** Lifts the card with elevation.1. */
  elevated?: boolean;
  /**
   * "feature": the strong border and the brand's feature shadow. On consumer
   * that is a printed offset in olive; on enterprise it stays a soft shadow.
   */
  variant?: "default" | "feature";
  /**
   * With variant="feature": "accent" casts the yellow offset instead. The
   * yellow is decoration only; it never carries meaning on its own.
   */
  tone?: "default" | "accent";
  /** Set false for cards with full-bleed sections that pad themselves. */
  padding?: boolean;
  /** Makes the whole card one press target, with a focus ring. */
  onPress?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Card({
  elevated = false,
  variant = "default",
  tone = "default",
  padding = true,
  onPress,
  children,
  className,
}: CardProps) {
  const classes = cx(
    styles.card,
    variant === "feature" && styles.feature,
    variant === "feature" && tone === "accent" && styles.accent,
    !padding && styles.noPadding,
    onPress && styles.clickable,
    className,
  );
  if (onPress) {
    return (
      <AriaButton onPress={onPress} data-elevated={elevated || undefined} className={classes}>
        {children}
      </AriaButton>
    );
  }
  return (
    <div data-elevated={elevated || undefined} className={classes}>
      {children}
    </div>
  );
}
