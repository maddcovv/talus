import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Briefcase,
  GearSix,
  MagnifyingGlass,
  Robot,
  Sun,
  UsersThree,
} from "@phosphor-icons/react";
import { AppShell, Avatar, Switch } from "@talus/react";
import { useBrand } from "../lib/useBrand";
import { Blaze } from "../components/Blaze";
import { recruiters } from "../fixtures/jobs";
import styles from "./RecruiterLayout.module.css";

export function RecruiterLayout() {
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  useBrand("enterprise", scheme);
  return (
    <AppShell
      brand={
        <>
          <Blaze tone="accent" />
          Trailcrew
        </>
      }
      brandHref="/recruit"
      sidebarClassName={styles.ink}
      navLabel="Trailcrew"
      nav={
        <>
          <NavLink to="/recruit" end>
            <Sun aria-hidden />
            Today
          </NavLink>
          <NavLink to="/recruit/jobs/senior-frontend">
            <Briefcase aria-hidden />
            Jobs
          </NavLink>
          <NavLink to="/recruit/candidates" end>
            <UsersThree aria-hidden />
            Candidates
          </NavLink>
          <NavLink to="/recruit/ai-activity">
            <Robot aria-hidden />
            AI activity
          </NavLink>
          <NavLink to="/recruit/settings">
            <GearSix aria-hidden />
            Settings
          </NavLink>
        </>
      }
      sidebarFooter={
        <span className={styles.user}>
          <Avatar name={recruiters.recruiter.name} />
          <span className={styles.userText}>
            <span className={styles.userName}>{recruiters.recruiter.name}</span>
            <span className={styles.userRole}>Recruiter</span>
          </span>
        </span>
      }
      topBar={
        <form
          role="search"
          className={styles.search}
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/recruit/candidates?q=${encodeURIComponent(query.trim())}`);
          }}
        >
          <MagnifyingGlass aria-hidden className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            aria-label="Search candidates"
            placeholder="Search candidates"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
      }
      end={
        <Switch
          isSelected={scheme === "dark"}
          onChange={(selected) => setScheme(selected ? "dark" : "light")}
        >
          Dark
        </Switch>
      }
      note={
        <>
          <span>You&apos;re looking at the recruiter side as Dana Ruiz. Demo data, all made up.</span>
          <Link to="/">Back to the careers site</Link>
        </>
      }
    >
      <div className={styles.content}>
        <Outlet />
      </div>
    </AppShell>
  );
}
