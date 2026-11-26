import styles from "./PrintHero.module.css";

/**
 * The full-bleed two-color print: the sky fades into the paper above it, dust
 * puffs behind the truck, the sun glows, and the whole picture drifts very
 * slowly. All of it stops under prefers-reduced-motion, leaving the still print.
 */
export function PrintHero() {
  return (
    <figure className={styles.print}>
      <div className={styles.pan}>
        <img
          src="/img/tts-hero.jpg"
          alt="Two-color print: a pickup loaded with packs drives a dirt two-track through sagebrush toward snowy peaks at sunrise"
          className={styles.img}
        />
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.dust} aria-hidden="true" />
        <span className={`${styles.dust} ${styles.d2}`} aria-hidden="true" />
        <span className={`${styles.dust} ${styles.d3}`} aria-hidden="true" />
      </div>
    </figure>
  );
}
