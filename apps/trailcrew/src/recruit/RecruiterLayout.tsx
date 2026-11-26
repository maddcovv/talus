import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
import { DemoFooter } from "../components/DemoFooter";
import { recruiters } from "../fixtures/jobs";
import styles from "./RecruiterLayout.module.css";

export function RecruiterLayout() {
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  useBrand("enterprise", scheme);
  return (
    <AppShell
      brand="Trailcrew"
      brandHref="/recruit"
      navLabel="Trailcrew"
      nav={
        <>
          <NavLink to="/recruit" end>
            <Sun aria-hidden />
            Today
          </NavLink>
          <NavLink to="/recruit/jobs/warehouse-lead">
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
        <>
          <Switch
            isSelected={scheme === "dark"}
            onChange={(selected) => setScheme(selected ? "dark" : "light")}
          >
            Dark
          </Switch>
          <span className={styles.user}>
            <Avatar name={recruiters.recruiter.name} />
            <span>{recruiters.recruiter.name}</span>
          </span>
        </>
      }
    >
      <div className={styles.content}>
        <Outlet />
      </div>
      <DemoFooter />
    </AppShell>
  );
}
