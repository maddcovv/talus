import { Link } from "react-router-dom";
import { employer } from "../fixtures/jobs";
import styles from "./InfoPage.module.css";

export function LifePage() {
  return (
    <article className={styles.container}>
      <div className={styles.prose}>
        <h1 className={styles.title}>Life at Two Track</h1>
        <p className={styles.lede}>
          One building in Salida, Colorado holds the shop floor, the warehouse and the desks.
          Everything we sell gets made, packed and argued about under the same roof.
        </p>
        {employer.about.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className={styles.body}>
            {paragraph}
          </p>
        ))}
        <h2 className={styles.h2}>How we work</h2>
        <ul className={styles.list}>
          <li>Pay ranges are posted on every job, and the range is the real range.</li>
          <li>Every applicant gets an answer. Not a form letter the day after, an answer.</li>
          <li>A person makes every hiring decision. AI helps with paperwork, never with judgment.</li>
          <li>Fridays end with the whole company on the dock when the last truck leaves.</li>
          <li>Gear testing is a job perk and an actual job. Field reports count as work.</li>
        </ul>
        <h2 className={styles.h2}>Salida, if you are moving</h2>
        <p className={styles.body}>
          Small mountain town, big backyard. The Arkansas River runs through the middle, the trail
          network starts at the edge of the parking lot, and winter is long enough to matter. Remote
          roles are remote for real; on site roles get the town as part of the deal.
        </p>
        <p className={styles.body}>
          <Link to="/">See the open roles.</Link>
        </p>
      </div>
    </article>
  );
}
