import { resumeLines, sampleResumeName, sampleResumePages } from "../fixtures/resume";
import styles from "./ResumePaper.module.css";

/**
 * June's one-page resume drawn as paper, the same artifact on both sides of
 * the product. `lit` says which lines glow, keyed by the resume line's key.
 */
export function ResumePaper({
  lit,
  showHead = true,
}: {
  lit?: (key: string, index: number) => boolean;
  showHead?: boolean;
}) {
  return (
    <div>
      {showHead ? (
        <div className={styles.paperHead}>
          <span>{sampleResumeName}</span>
          <span>{sampleResumePages}</span>
        </div>
      ) : null}
      <div className={styles.paperDoc}>
        {resumeLines.map((line, index) => (
          <div
            key={`${line.key}-${line.text.slice(0, 12)}`}
            className={[
              styles.paperLine,
              line.variant === "name" ? styles.paperName : "",
              line.variant === "head" ? styles.paperHeadLine : "",
              line.gap === "loose" ? styles.paperGapLoose : "",
              line.gap === "none" ? styles.paperGapNone : "",
              lit?.(line.key, index) ? styles.paperLit : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}
