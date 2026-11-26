import styles from "./Tally.module.css";

/**
 * Days waiting, the number recruiters actually watch. Tabular figures,
 * right-aligned; warm at 5 days, hot at 10, always with the words so color
 * never carries the meaning alone.
 */
export function Tally({ days, className }: { days: number; className?: string }) {
  const heat = days >= 10 ? styles.hot : days >= 5 ? styles.warm : "";
  return (
    <span className={[styles.tally, heat, className].filter(Boolean).join(" ")}>
      {days} {days === 1 ? "day" : "days"}
    </span>
  );
}
