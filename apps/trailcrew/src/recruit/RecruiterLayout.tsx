import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Avatar, Header, Switch } from "@talus/react";
import { useBrand } from "../lib/useBrand";
import { DemoFooter } from "../components/DemoFooter";
import { recruiters } from "../fixtures/jobs";
import styles from "./RecruiterLayout.module.css";

export function RecruiterLayout() {
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  useBrand("enterprise", scheme);
  return (
    <div className={styles.shell}>
      <Header
        brand="Trailcrew"
        brandHref="/recruit"
        nav={
          <>
            <NavLink to="/recruit" end>
              Today
            </NavLink>
            <NavLink to="/recruit/jobs/warehouse-lead">Pipeline</NavLink>
            <NavLink to="/recruit/jobs/new">New job</NavLink>
          </>
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
      />
      <main className={styles.main}>
        <Outlet />
      </main>
      <DemoFooter />
    </div>
  );
}
