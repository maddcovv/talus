import { Link, Outlet } from "react-router-dom";
import { useBrand } from "../lib/useBrand";
import { DemoFooter } from "../components/DemoFooter";
import styles from "./CandidateLayout.module.css";

export function CandidateLayout() {
  useBrand("consumer", "light");
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Two Track Supply
        </Link>
        <span className={styles.sub}>Jobs</span>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <DemoFooter />
    </div>
  );
}
