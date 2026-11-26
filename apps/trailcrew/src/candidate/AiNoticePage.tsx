import { Link } from "react-router-dom";
import styles from "./InfoPage.module.css";

/** The short notice the apply flow's data checkbox links to. */
export function AiNoticePage() {
  return (
    <article className={styles.container}>
      <div className={styles.prose}>
        <h1 className={styles.title}>How Trailcrew uses AI and your data</h1>
        <p className={styles.lede}>
          Two Track Supply hires on Trailcrew. Here is everything AI does with your application,
          and everything it does not.
        </p>
        <h2 className={styles.h2}>What AI does</h2>
        <ul className={styles.list}>
          <li>Reads the resume you upload and fills the form from it, with a source for every field.</li>
          <li>Suggests where your resume matches the job requirements, quote by quote.</li>
          <li>Runs the person check that keeps automated applications out of the pile.</li>
        </ul>
        <h2 className={styles.h2}>What AI never does</h2>
        <ul className={styles.list}>
          <li>It never sends anything. You review every field and nothing goes out without your sign off.</li>
          <li>
            It can suggest the recruiter a reading order from that evidence. The suggestion hides
            no one; the full list is always there, and a person reads every application.
          </li>
          <li>It never rejects anyone. A person makes every decision, and the decision is logged with that person's name.</li>
        </ul>
        <h2 className={styles.h2}>Your data</h2>
        <ul className={styles.list}>
          <li>Your application goes to Two Track Supply and nowhere else.</li>
          <li>Every AI action on your application sits in a log the employer and you can see.</li>
          <li>Voluntary self identification answers are never shown to the hiring team. They become counts in aggregate reports only.</li>
          <li>Ask for deletion from your status page and the application is gone within 30 days.</li>
        </ul>
        <p className={styles.body}>
          <Link to="/">Back to the open roles.</Link>
        </p>
      </div>
    </article>
  );
}
