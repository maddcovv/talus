import styles from "./Blaze.module.css";

/**
 * A trail blaze: the painted rectangle that marks the route. A single blaze
 * in the action color means on track. A double blaze, two short bars in the
 * accent yellow, means turn here: something waits on a person's decision.
 * Decorative; the words beside it carry the meaning.
 */
export function Blaze({
  variant = "single",
  tone = "action",
  className,
}: {
  variant?: "single" | "double";
  tone?: "action" | "accent";
  className?: string;
}) {
  const fill =
    variant === "double" || tone === "accent"
      ? "var(--talus-color-bg-accent)"
      : "var(--talus-color-action-primary-bg)";
  return (
    <svg
      viewBox="0 0 10 18"
      aria-hidden="true"
      className={[styles.blaze, className].filter(Boolean).join(" ")}
    >
      {variant === "double" ? (
        <>
          <rect x="0" y="0" width="10" height="8" rx="1" fill={fill} />
          <rect x="0" y="10" width="10" height="8" rx="1" fill={fill} />
        </>
      ) : (
        <rect x="0" y="0" width="10" height="18" rx="1" fill={fill} />
      )}
    </svg>
  );
}
