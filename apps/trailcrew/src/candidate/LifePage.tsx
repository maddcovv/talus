import { useNavigate } from "react-router-dom";
import { Button } from "@talus/react";
import { employer } from "../fixtures/jobs";
import styles from "./BrandPage.module.css";

export function LifePage() {
  const navigate = useNavigate();
  return (
    <article>
      <section data-kraft="" className={styles.hero}>
        <img
          src="/img/tts-hero.jpg"
          alt=""
          aria-hidden="true"
          className={`${styles.heroPrint} ${styles.printLife}`}
        />
        <div className={styles.heroInner}>
          <h1 className={styles.title}>Life at Two Track</h1>
          <p className={styles.heroSub}>
            One building in Salida, Colorado holds the shop floor, the warehouse and the desks.
            Everything we sell gets made, packed and argued about under the same roof.
          </p>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.prose}>
          <h2 className={styles.sec}>The building</h2>
          {employer.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.para}>
              {paragraph}
            </p>
          ))}

          <h2 className={styles.sec}>How we work</h2>
          <ul className={styles.list}>
            <li>Pay ranges are posted on every job, and the range is the real range.</li>
            <li>Every applicant gets an answer. Not a form letter the day after, an answer.</li>
            <li>
              A person makes every hiring decision. AI can fill in forms and suggest a reading
              order, and it never rejects or hides anyone.
            </li>
            <li>Fridays end with the whole company on the dock when the last truck leaves.</li>
            <li>Gear testing is a job perk and an actual job. Field reports count as work.</li>
          </ul>

          <h2 className={styles.sec}>Salida, if you are moving</h2>
          <p className={styles.para}>
            Small mountain town, big backyard. The Arkansas River runs through the middle, the
            trail network starts at the edge of the parking lot, and winter is long enough to
            matter. Remote roles are remote for real; on site roles get the town as part of the
            deal.
          </p>

          <div className={styles.ctaRow}>
            <Button size="lg" onPress={() => navigate("/")}>
              See the open roles
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
