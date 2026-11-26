import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check } from "@phosphor-icons/react";
import { Button } from "@talus/react";
import { useBrand } from "../lib/useBrand";
import { TwoTrackMark } from "../components/TwoTrackMark";
import { statusMessages } from "../fixtures/demo";
import styles from "./StatusPage.module.css";

const order = ["applied", "read", "talk", "session", "decision"] as const;

const stops = [
  {
    title: "You applied",
    when: "November 25",
    body: "Your resume, your answers and a confirmation email to june.halloran@example.com.",
    now: "",
  },
  {
    title: "Dana Ruiz reads it",
    when: "By Wednesday, December 2",
    body: "A person reads every application. You hear back by email either way.",
    now: "Your application is with Dana. She reads every one herself and will email you by Wednesday, December 2.",
  },
  {
    title: "A 30 minute conversation",
    when: "Phone or video, your pick",
    body: "If it is a match, Dana texts first to find a time, then calls.",
    now: "Your call with Dana is Monday, December 7 at 10:00 AM Mountain. She will call (970) 555-0173.",
  },
  {
    title: "A working session with the team",
    when: "Video, 90 minutes",
    body: "We send the topics three days ahead. No trick questions.",
    now: "Thursday, December 10, 1:00 to 2:30 PM Mountain, on video. The topics are in your email.",
  },
  {
    title: "A decision, with a reason",
    when: "Within 3 days",
    body: "From a person, with our pay number if it is a yes.",
    now: "Dana called with an offer of $164,000 a year. The written offer is in your email, and you have a week to decide.",
  },
];

const heads = [
  "Dana reads it by Wednesday, December 2",
  "Dana wants to talk. Watch for her text",
  "Call with Dana: Monday, December 7, 10:00 AM",
  "Working session: Thursday, December 10",
  "You have an offer",
];

// The messages themselves live in fixtures/demo.ts, shared with the
// recruiter's activity tab so both sides of the product agree.

export function StatusPage() {
  useBrand("consumer", "light");
  const [searchParams] = useSearchParams();
  const stageParam = searchParams.get("stage") ?? "applied";
  const cur = Math.max(0, order.indexOf(stageParam as (typeof order)[number]));
  const at = Math.min(cur + 1, 4);
  const [withdraw, setWithdraw] = useState<"closed" | "open" | "done">("closed");
  const [needNote, setNeedNote] = useState("");

  const messages = statusMessages.slice(0, cur + 1).reverse();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <TwoTrackMark className={styles.mark} />
            Two Track Supply
          </Link>
          <span className={styles.signedIn}>Signed in as June Halloran</span>
        </div>
      </header>

      <section data-kraft="" className={styles.hero}>
        <img src="/img/tts-hero.jpg" alt="" aria-hidden="true" className={styles.heroPrint} />
        <div className={styles.heroInner}>
          <h1 className={styles.title}>Where you stand</h1>
          <p className={styles.heroSub}>
            Senior Frontend Engineer at Two Track Supply. You applied on November 25, 2026.
          </p>
          <p className={styles.pill}>
            <span className={styles.dot} aria-hidden="true" />
            {heads[cur]}
          </p>
        </div>
      </section>

      <div className={styles.cols}>
        <main>
          <h2 className={styles.roadH}>The road from here</h2>
          <ol className={styles.road}>
            {stops.map((stop, index) => {
              const isDone = index < at;
              const isCurrent = index === at;
              const isAhead = index > at;
              return (
                <li
                  key={stop.title}
                  aria-current={isCurrent ? "step" : undefined}
                  className={styles.stop}
                >
                  <div className={styles.stopRail}>
                    {index < stops.length - 1 ? (
                      <>
                        <span
                          aria-hidden="true"
                          className={`${styles.railLine} ${styles.railA} ${
                            index < at ? styles.railDone : styles.railAhead
                          }`}
                        />
                        <span
                          aria-hidden="true"
                          className={`${styles.railLine} ${styles.railB} ${
                            index < at ? styles.railDone : styles.railAhead
                          }`}
                        />
                      </>
                    ) : null}
                    {isDone ? (
                      <span className={styles.doneDot}>
                        <Check aria-hidden weight="bold" />
                      </span>
                    ) : null}
                    {isCurrent ? (
                      <span className={`${styles.hereDot} ${styles.here}`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.flag}>
                          <path
                            d="M7 21V3"
                            stroke="var(--talus-color-text-on-feature)"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7 4h11l-3 4 3 4H7"
                            fill="var(--talus-color-action-primary-bg)"
                            stroke="var(--talus-color-text-on-feature)"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    ) : null}
                    {isAhead ? <span className={styles.aheadDot} /> : null}
                  </div>
                  <div className={styles.stopBody}>
                    <div className={styles.stopHead}>
                      <span
                        className={isAhead ? styles.stopTitleAhead : styles.stopTitle}
                      >
                        {stop.title}
                      </span>
                      <span className={isCurrent ? styles.stopWhenNow : styles.stopWhen}>
                        {stop.when}
                      </span>
                    </div>
                    <p className={styles.stopText}>{stop.body}</p>
                    {isCurrent && stop.now ? (
                      <div data-kraft="" className={styles.hereBox}>
                        <div className={styles.hereBoxTitle}>You are here</div>
                        <div className={styles.hereBoxBody}>{stop.now}</div>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </main>

        <aside>
          <section className={styles.messages} aria-label="Messages">
            <h2 className={styles.messagesH}>Messages</h2>
            <p className={styles.messagesSub}>
              Everything Two Track Supply has sent you, newest first.
            </p>
            <ul className={styles.messageList}>
              {messages.map((message) => (
                <li key={message.when} className={styles.message}>
                  <div className={styles.messageMeta}>
                    <span>{message.when}</span>
                    <span>{message.how}</span>
                  </div>
                  <div className={styles.messageTitle}>{message.title}</div>
                  <div className={styles.messageBody}>{message.body}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.need} aria-label="Need something?">
            <h2 className={styles.needH}>Need something?</h2>
            <div className={styles.needBtns}>
              <button
                type="button"
                className={styles.needBtn}
                onClick={() =>
                  setNeedNote("Request sent. A person replies by email, usually the same day.")
                }
              >
                Ask for a person
              </button>
              <button
                type="button"
                className={styles.needBtn}
                onClick={() =>
                  setNeedNote(
                    "Your sent copy is attached to the confirmation email from November 25.",
                  )
                }
              >
                See what you sent
              </button>
            </div>
            {needNote ? (
              <p role="status" className={styles.needNote}>
                {needNote}
              </p>
            ) : null}
            <p className={styles.needSub}>
              Ask for a person for an accommodation, a question, or a change to your interview
              times.
            </p>
          </section>

          <section className={styles.withdraw}>
            {withdraw === "closed" ? (
              <button
                type="button"
                className={styles.withdrawLink}
                onClick={() => setWithdraw("open")}
              >
                Withdraw my application
              </button>
            ) : null}
            {withdraw === "open" ? (
              <div role="group" aria-labelledby="wd-t" className={styles.withdrawBox}>
                <div id="wd-t" className={styles.withdrawTitle}>
                  Withdraw your application?
                </div>
                <p className={styles.withdrawBody}>
                  Dana will be told, and you can apply again later. This can&apos;t be undone for
                  this application.
                </p>
                <div className={styles.withdrawBtns}>
                  <Button variant="danger" onPress={() => setWithdraw("done")}>
                    Withdraw
                  </Button>
                  <Button variant="secondary" onPress={() => setWithdraw("closed")}>
                    Keep my application
                  </Button>
                </div>
              </div>
            ) : null}
            {withdraw === "done" ? (
              <p role="status" className={styles.withdrawn}>
                Withdrawn. Dana has been told. Thanks for your interest in Two Track Supply.
              </p>
            ) : null}
          </section>

          <div className={styles.headsUp}>
            <strong>A heads up.</strong> We will never ask you for money, bank details or to buy
            equipment to get hired. If anyone does, it isn&apos;t us.
          </div>
        </aside>
      </div>

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
