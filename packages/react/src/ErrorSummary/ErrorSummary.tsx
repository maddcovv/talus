import { useEffect, useId, useRef } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./ErrorSummary.module.css";

export interface ErrorSummaryItem {
  /** id of the input, or of a container that holds exactly one input. */
  targetId: string;
  label: string;
}

export interface ErrorSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plain words, e.g. "There are 2 things to fix". */
  title: string;
  items: ErrorSummaryItem[];
  /** Heading level of the title, for the page outline. */
  headingLevel?: 2 | 3;
  /** Move focus to the summary when it appears, so it is read aloud. */
  autoFocus?: boolean;
}

const FOCUSABLE = "input, textarea, select, button, a[href], [tabindex]";

function scrollBehavior(): ScrollBehavior {
  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduced ? "auto" : "smooth";
}

function jumpTo(targetId: string) {
  const container = document.getElementById(targetId);
  if (!container) return;
  const target = container.matches(FOCUSABLE)
    ? container
    : container.querySelector<HTMLElement>(FOCUSABLE);
  const el = target ?? container;
  if (el === container && !container.matches(FOCUSABLE)) {
    container.setAttribute("tabindex", "-1");
  }
  el.scrollIntoView?.({ block: "center", behavior: scrollBehavior() });
  el.focus({ preventScroll: true });
}

/**
 * A list of everything blocking the next step, each item a link that moves
 * focus to the field it names. Render it when the person tries to continue,
 * at the top of the form, and let it take focus so the reasons are read out.
 */
export function ErrorSummary({
  title,
  items,
  headingLevel = 2,
  autoFocus = true,
  className,
  ...props
}: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const Heading = `h${headingLevel}` as const;

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.scrollIntoView?.({ block: "center", behavior: scrollBehavior() });
      ref.current.focus({ preventScroll: true });
    }
  }, [autoFocus]);

  return (
    <div
      {...props}
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby={headingId}
      className={cx(styles.root, className)}
    >
      <Heading id={headingId} className={styles.title}>
        <WarningCircle aria-hidden weight="fill" className={styles.icon} />
        {title}
      </Heading>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={`${item.targetId}-${item.label}`}>
            <a
              href={`#${item.targetId}`}
              className={styles.link}
              onClick={(event) => {
                event.preventDefault();
                jumpTo(item.targetId);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
