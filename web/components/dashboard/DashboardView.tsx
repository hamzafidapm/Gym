"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { fmtPrice, planByName } from "@/lib/data";
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

function memberSinceLabel(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

function SignInGate() {
  const { signInWithPassword } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await signInWithPassword(email, password);
    setSubmitting(false);
    if (result.error) setError(result.error);
  };

  return (
    <section className={styles.section}>
      <div className={styles.signInWrap}>
        <p className={styles.eyebrow}>MY ACCOUNT</p>
        <h1 className={styles.h1}>SIGN IN.</h1>
        <div className={styles.signInCard}>
          <form className={styles.signInForm} onSubmit={submit}>
            <label className={styles.field}>
              Email
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </label>
            <label className={styles.field}>
              Password
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </label>
            {error && <p className={styles.signInError}>{error}</p>}
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className={styles.switchAuth}>
            Not a member yet?{" "}
            <Link href="/join" style={{ color: ACCENT }}>
              Start your free trial
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

export default function DashboardView() {
  const { user, member, authLoading, bookings, cancel, flash, signOut, annual } = useAppState();

  if (authLoading) {
    return <section className={styles.section} />;
  }

  if (!user) {
    return <SignInGate />;
  }

  const firstName = (member?.first_name || "Athlete").toUpperCase();
  const plan = member?.plan_id ? planByName(member.plan_id) : null;
  const cycle = member?.cycle ?? (annual ? "annual" : "monthly");

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
          <p className={styles.eyebrow}>
            {member ? `MEMBER SINCE ${memberSinceLabel(member.member_since)}` : "MEMBER"}
          </p>
          <h1 className={styles.h1}>HELLO, {firstName}.</h1>
        </div>
        <div className={styles.headActions}>
          <Link href="/classes" className={styles.bookBtn}>
            Book a class
          </Link>
          <button type="button" className={styles.signOutBtn} onClick={() => signOut()}>
            Sign out
          </button>
        </div>
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
                <div key={b.id} className={styles.bookingCard}>
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
                      onClick={() => cancel(b.id)}
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
            <div className={styles.membershipPlan}>{plan ? plan.name : "NO PLAN"}</div>
            <div className={styles.membershipRenew}>
              {plan
                ? `${fmtPrice(plan.monthly, cycle === "annual")}${cycle === "annual" ? "/yr" : "/mo"}`
                : "Pick a plan to get started"}
            </div>
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
