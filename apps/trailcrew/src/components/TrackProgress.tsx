import styles from "./TrackProgress.module.css";

/** The two-track road in the apply header: two dashed lanes filling with olive. */
export function TrackProgress({ progress }: { progress: number }) {
  const fill = { transform: `scaleX(${progress})` };
  return (
    <div className={styles.road} aria-hidden="true">
      <div className={`${styles.dash} ${styles.laneTop}`} />
      <div className={`${styles.dash} ${styles.laneBottom}`} />
      <div className={`${styles.fill} ${styles.laneTop}`} style={fill} />
      <div className={`${styles.fill} ${styles.laneBottom}`} style={fill} />
    </div>
  );
}
