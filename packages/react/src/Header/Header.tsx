import { cx } from "../cx";
import styles from "./Header.module.css";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Product name or wordmark at the start of the bar. */
  brand: React.ReactNode;
  /** Where the brand links to. Without it the brand is plain text. */
  brandHref?: string;
  /**
   * Navigation links (anchors or router links). Rendered inside a nav
   * landmark. Mark the current page's link with aria-current="page".
   */
  nav?: React.ReactNode;
  navLabel?: string;
  /** End of the bar: actions, a scheme switch, the signed-in person. */
  end?: React.ReactNode;
}

/** Sticky page header with a nav landmark. */
export function Header({
  brand,
  brandHref,
  nav,
  navLabel = "Main",
  end,
  className,
  ...props
}: HeaderProps) {
  return (
    <header {...props} className={cx(styles.header, className)}>
      {brandHref ? (
        <a href={brandHref} className={styles.brand}>
          {brand}
        </a>
      ) : (
        <span className={styles.brand}>{brand}</span>
      )}
      {nav ? (
        <nav aria-label={navLabel} className={styles.nav}>
          {nav}
        </nav>
      ) : null}
      {end ? <div className={styles.end}>{end}</div> : null}
    </header>
  );
}
