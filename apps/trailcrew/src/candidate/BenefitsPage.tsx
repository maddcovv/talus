import { Link } from "react-router-dom";
import styles from "./InfoPage.module.css";

export function BenefitsPage() {
  return (
    <article className={styles.container}>
      <div className={styles.prose}>
        <h1 className={styles.title}>Benefits</h1>
        <p className={styles.lede}>
          The short version: health coverage that is mostly paid for, a real retirement match, time
          off you are expected to take, and a deep discount on the gear you help make.
        </p>
        <h2 className={styles.h2}>Health</h2>
        <ul className={styles.list}>
          <li>Medical, dental and vision for every full time role.</li>
          <li>We pay at least 75 percent of your premium, 90 percent on some roles.</li>
          <li>Dependents are covered at half or better.</li>
        </ul>
        <h2 className={styles.h2}>Money</h2>
        <ul className={styles.list}>
          <li>401(k) with a 4 percent match, vested from day one.</li>
          <li>Posted pay ranges on every job, and the final offer explained before you accept.</li>
          <li>Overtime eligible roles get time and a half, no exceptions quietly written in.</li>
        </ul>
        <h2 className={styles.h2}>Time</h2>
        <ul className={styles.list}>
          <li>Three to four weeks paid time off depending on the role, plus seven paid holidays.</li>
          <li>Colorado paid sick leave accrues from your first shift, seasonal roles included.</li>
        </ul>
        <h2 className={styles.h2}>Gear</h2>
        <ul className={styles.list}>
          <li>40 percent employee discount on everything we make.</li>
          <li>An annual gear or boot allowance on most roles.</li>
        </ul>
        <p className={styles.note}>
          Seasonal roles are paid weekly and accrue sick leave, but are not eligible for medical
          coverage or the 401(k). Every posting lists the exact benefits for that role.
        </p>
        <p className={styles.body}>
          <Link to="/">See the open roles.</Link>
        </p>
      </div>
    </article>
  );
}
