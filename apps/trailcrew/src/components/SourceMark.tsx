import { Handshake } from "@phosphor-icons/react";
import type { Source } from "../fixtures/types";
import styles from "./SourceMark.module.css";

/**
 * Where the application came from. Referrals get weight, an icon and the
 * word, because a vouched-for candidate should be easy to spot.
 */
export function SourceMark({ source }: { source: Source }) {
  if (source !== "Referral") return <>{source}</>;
  return (
    <span className={styles.referral}>
      <Handshake aria-hidden weight="fill" className={styles.icon} />
      Referral
    </span>
  );
}
