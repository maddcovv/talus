import { cx } from "../cx";
import styles from "./Avatar.module.css";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name the initials come from. */
  name: string;
  size?: AvatarSize;
  /**
   * By default the avatar is decorative (hidden from assistive tech) because
   * the name is expected to appear next to it. Set withLabel when the avatar
   * stands alone, so it reads the name instead.
   */
  withLabel?: boolean;
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** Initials only, no photos. */
export function Avatar({ name, size = "md", withLabel = false, className, ...props }: AvatarProps) {
  return (
    <span
      {...props}
      data-size={size}
      role={withLabel ? "img" : undefined}
      aria-label={withLabel ? name : undefined}
      aria-hidden={withLabel ? undefined : true}
      className={cx(styles.avatar, className)}
    >
      {initials(name)}
    </span>
  );
}
