"use client";

import Link from "next/link";
import { useAppState } from "@/lib/AppStateContext";
import { ACCENT } from "@/lib/theme";
import styles from "./DashboardView.module.css";

const HISTORY = [
  { name: "Press Day", date: "05 AUG" },
  { name: "Slow Flow", date: "03 AUG" },
  { name: "Metcon 34", date: "01 AUG" },
  { name: "Squat Club", date: "30 JUL" },
  { name: "Bag Work 101", date: "28 JUL" },
];

const PROGRESS = [
  { label: "Sessions completed", val: "23 / 32", pct: "72%" },
  { label: "Squat block target", val: "315 lb / 340 lb", pct: "86%" },
  { label: "Mobility re-test", val: "Week 6 of 8", pct: "75%" },
];

export default function DashboardView() {
  const { bookings, cancel, flash } = useAppState();

  const dashStats = [
    { label: "WORKOUTS THIS BLOCK", value: "23", color: ACCENT, note: "of 32 programmed" },
    { label: "CURRENT STREAK", value: "11", color: ACCENT, note: "weeks without a miss" },
    {
      label: "UPCOMING",
      value: String(bookings.length),
      color: "#F2F3EF",
      note: "classes booked",
    },
    { label: "PR THIS BLOCK", value: "+35", color: "#F2F3EF", note: "lb on back squat" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>MEMBER SINCE MAR 2024</p>
          <h1 className={styles.h1}>HELLO, PRIYA.</h1>
        </div>
        <Link href="/classes" className={styles.bookBtn}>
          Book a class
        </Link>
      </div>

      <div className={styles.statsGrid}>
        {dashStats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue} style={{ color: s.color }}>
              {s.value}
            </div>
            <div className={styles.statNote}>{s.note}</div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div>
          <h2 className={styles.h2}>UPCOMING</h2>
          {bookings.length > 0 ? (
            <div className={styles.bookingList}>
              {bookings.map((b) => (
                <div key={b.key} className={styles.bookingCard}>
                  <div className={styles.bookingTop}>
                    <span className={styles.bookingName}>{b.name}</span>
                    <span className={styles.bookingTime}>
                      {b.day} · {b.time}
                    </span>
                  </div>
                  <div className={styles.bookingMeta}>
                    {b.trainer} · {b.dur} · Studio {b.room}
                  </div>
                  <div className={styles.bookingActions}>
                    <Link
                      href="/classes"
                      className={styles.rescheduleBtn}
                      onClick={() => flash("Pick a new slot on the schedule.")}
                    >
                      Reschedule
                    </Link>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => cancel(b.key)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <p className={styles.emptyText}>
                Nothing on the board. Your streak doesn&apos;t care about excuses.
              </p>
              <Link href="/classes" className={styles.findBtn}>
                Find a class
              </Link>
            </div>
          )}

          <h2 className={`${styles.h2} ${styles.h2Spaced}`}>HISTORY</h2>
          <div className={styles.historyList}>
            {HISTORY.map((h) => (
              <div key={h.name + h.date} className={styles.historyRow}>
                <span>{h.name}</span>
                <span className={styles.historyDate}>{h.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className={styles.h2}>MEMBERSHIP</h2>
          <div className={styles.membershipCard}>
            <div className={styles.membershipLabel}>CURRENT PLAN</div>
            <div className={styles.membershipPlan}>PREMIUM</div>
            <div className={styles.membershipRenew}>Renews 14 Sep 2026 · $79/mo</div>
            <div className={styles.membershipActions}>
              <Link href="/pricing" className={styles.changePlanBtn}>
                Change plan
              </Link>
              <button
                type="button"
                className={styles.pauseBtn}
                onClick={() =>
                  flash("Membership pause request sent to the front desk.")
                }
              >
                Pause
              </button>
            </div>
          </div>
          <div className={styles.progressCard}>
            <div className={styles.progressTitle}>8-WEEK BLOCK PROGRESS</div>
            {PROGRESS.map((p) => (
              <div key={p.label} className={styles.progressItem}>
                <div className={styles.progressRow}>
                  <span>{p.label}</span>
                  <span className={styles.progressVal}>{p.val}</span>
                </div>
                <div className={styles.progressTrack}>
                  <span className={styles.progressFill} style={{ width: p.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
