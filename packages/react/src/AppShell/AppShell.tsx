import type { ReactNode } from "react";
import { cx } from "../cx";
import styles from "./AppShell.module.css";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Product name or wordmark at the top of the sidebar. */
  brand: ReactNode;
  /** Where the brand links to. Without it the brand is plain text. */
  brandHref?: string;
  /**
   * Sidebar links (anchors or router links), icon first inside each link.
   * Mark the current page's link with aria-current="page".
   */
  nav: ReactNode;
  navLabel?: string;
  /** Middle of the top bar, e.g. global search. */
  topBar?: ReactNode;
  /** End of the top bar: a scheme switch, the signed-in person. */
  end?: ReactNode;
  children: ReactNode;
}

/**
 * The frame for a full application: a sidebar with the brand and the main
 * navigation, a top bar for search and session controls, and the content
 * as the main landmark. On narrow screens the sidebar becomes a top strip.
 */
export function AppShell({
  brand,
  brandHref,
  nav,
  navLabel = "Main",
  topBar,
  end,
  children,
  className,
  ...props
}: AppShellProps) {
  return (
    <div {...props} className={cx(styles.shell, className)}>
      <div className={styles.sidebar}>
        {brandHref ? (
          <a href={brandHref} className={styles.brand}>
            {brand}
          </a>
        ) : (
          <span className={styles.brand}>{brand}</span>
        )}
        <nav aria-label={navLabel} className={styles.nav}>
          {nav}
        </nav>
      </div>
      <div className={styles.body}>
        <header className={styles.topBar}>
          {topBar ? <div className={styles.topBarMain}>{topBar}</div> : null}
          {end ? <div className={styles.end}>{end}</div> : null}
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
