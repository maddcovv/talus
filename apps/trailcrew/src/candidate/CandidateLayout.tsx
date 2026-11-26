import { Link, NavLink, Outlet } from "react-router-dom";
import { useBrand } from "../lib/useBrand";
import { TwoTrackMark } from "../components/TwoTrackMark";
import styles from "./CandidateLayout.module.css";

export function CandidateLayout() {
  useBrand("consumer", "light");
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <TwoTrackMark className={styles.mark} />
            Two Track Supply
          </Link>
          <nav aria-label="Main" className={styles.nav}>
            <NavLink to="/" end>
              Jobs
            </NavLink>
            <NavLink to="/life">Life at Two Track</NavLink>
            <NavLink to="/benefits">Benefits</NavLink>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Two Track Supply, Salida, Colorado</span>
          <span>
            Hiring runs on <Link to="/recruit">Trailcrew</Link>. Demo product: all names and data
            are made up.
          </span>
        </div>
      </footer>
    </div>
  );
}
