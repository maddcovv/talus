import { useNavigate } from "react-router-dom";
import { Button } from "@talus/react";
import styles from "./BrandPage.module.css";

export function BenefitsPage() {
  const navigate = useNavigate();
  return (
    <article>
      <section data-kraft="" className={styles.hero}>
        <img
          src="/img/tts-hero.jpg"
          alt=""
          aria-hidden="true"
          className={`${styles.heroPrint} ${styles.printBenefits}`}
        />
        <div className={styles.heroInner}>
          <h1 className={styles.title}>Benefits</h1>
          <p className={styles.heroSub}>
            The short version: health coverage that is mostly paid for, a real retirement match,
            time off you are expected to take, and a deep discount on the gear you help make.
          </p>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.prose}>
          <h2 className={styles.sec}>Health</h2>
          <ul className={styles.list}>
            <li>Medical, dental and vision for every full time role.</li>
            <li>We pay at least 75 percent of your premium, 90 percent on some roles.</li>
            <li>Dependents are covered at half or better.</li>
          </ul>

          <h2 className={styles.sec}>Money</h2>
          <ul className={styles.list}>
            <li>401(k) with a 4 percent match, vested from day one.</li>
            <li>Posted pay ranges on every job, and the final offer explained before you accept.</li>
            <li>Overtime eligible roles get time and a half, no exceptions quietly written in.</li>
          </ul>

          <h2 className={styles.sec}>Time</h2>
          <ul className={styles.list}>
            <li>Three to four weeks paid time off depending on the role, plus seven paid holidays.</li>
            <li>Colorado paid sick leave accrues from your first shift, seasonal roles included.</li>
          </ul>

          <h2 className={styles.sec}>Gear</h2>
          <ul className={styles.list}>
            <li>40 percent employee discount on everything we make.</li>
            <li>An annual gear or boot allowance on most roles.</li>
          </ul>

          <div className={styles.ctaRow}>
            <Button size="lg" onPress={() => navigate("/")}>
              See the open roles
            </Button>
          </div>

          <div className={styles.finePrint}>
            <p>
              Seasonal roles are paid weekly and accrue sick leave, but are not eligible for
              medical coverage or the 401(k). Every posting lists the exact benefits for that
              role.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
