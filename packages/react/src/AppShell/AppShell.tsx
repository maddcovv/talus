import { useState, type ReactNode } from "react";
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
  /** One line under the top bar, e.g. a demo notice. */
  note?: ReactNode;
  /** Pinned to the bottom of the sidebar, e.g. the signed-in person. */
  sidebarFooter?: ReactNode;
  /** Extra class on the sidebar, for app-level theming like an ink sidebar. */
  sidebarClassName?: string;
  children: ReactNode;
}

/**
 * The frame for a full application: a sidebar with the brand and the main
 * navigation, a top bar for search and session controls, and the content as
 * the main landmark. On narrow screens the sidebar sits behind a Menu button
 * and opens as a full-screen panel.
 */
export function AppShell({
  brand,
  brandHref,
  nav,
  navLabel = "Main",
  topBar,
  end,
  note,
  sidebarFooter,
  sidebarClassName,
  children,
  className,
  ...props
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const brandNode = brandHref ? (
    <a href={brandHref} className={styles.brand}>
      {brand}
    </a>
  ) : (
    <span className={styles.brand}>{brand}</span>
  );
  return (
    <div {...props} className={cx(styles.shell, className)}>
      <div
        className={cx(styles.sidebar, sidebarClassName)}
        data-open={menuOpen || undefined}
      >
        <div className={styles.sidebarTop}>
          {brandNode}
          <button
            type="button"
            className={styles.menuClose}
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
        </div>
        {/* Clicking any link closes the phone menu; harmless on desktop. */}
        <nav
          aria-label={navLabel}
          className={styles.nav}
          onClick={() => setMenuOpen(false)}
        >
          {nav}
        </nav>
        {sidebarFooter ? <div className={styles.sidebarFooter}>{sidebarFooter}</div> : null}
      </div>
      <div className={styles.body}>
        <div className={cx(styles.mobileBar, sidebarClassName)}>
          {brandNode}
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
        <header className={styles.topBar}>
          {topBar ? <div className={styles.topBarMain}>{topBar}</div> : null}
          {end ? <div className={styles.end}>{end}</div> : null}
        </header>
        {note ? <div className={styles.note}>{note}</div> : null}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
