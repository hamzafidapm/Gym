"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PLAN_BASE, fmtPrice, planByName } from "@/lib/data";
import { useAppState } from "@/lib/AppStateContext";
import { useClasses } from "@/lib/useClasses";
import { ACCENT } from "@/lib/theme";
import styles from "./JoinView.module.css";

const STEP_NAMES = ["", "WHO ARE YOU", "PICK A PLAN", "FIRST SESSION", "PAYMENT"];
const STEP_TITLES = [
  "",
  "START WITH THE BASICS.",
  "CHOOSE YOUR LANE.",
  "LOCK IN SESSION ONE.",
  "LAST STEP. PROMISE.",
];

interface FormState {
  first: string;
  last: string;
  email: string;
  password: string;
  phone: string;
  plan: string;
  firstClass: string | null;
  card: string;
}

interface DoneState {
  firstName: string;
  email: string;
  message: string;
}

export default function JoinView() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "PREMIUM";
  const { annual, signUp, book } = useAppState();
  const { classes: liveClasses } = useClasses();

  const [step, setStep] = useState(1);
  const [done, setDone] = useState<DoneState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    first: "",
    last: "",
    email: "",
    password: "",
    phone: "",
    plan: PLAN_BASE.some((p) => p.name === initialPlan) ? initialPlan : "PREMIUM",
    firstClass: null,
    card: "",
  });

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError(null);
  };

  const firstOpts = useMemo(
    () => liveClasses.filter((c) => c.spots > 3).slice(0, 4),
    [liveClasses],
  );
  const chosen = form.firstClass ? liveClasses.find((c) => c.id === form.firstClass) : null;
  const planObj = planByName(form.plan);

  const next = async () => {
    if (step === 1) {
      if (!form.first.trim() || !form.last.trim()) {
        setError("We need your first and last name to make a member card.");
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        setError("That email doesn’t look right.");
        return;
      }
      if (form.password.length < 8) {
        setError("Password needs to be at least 8 characters.");
        return;
      }
    }
    if (step === 4) {
      setSubmitting(true);
      setError(null);
      const result = await signUp({
        email: form.email,
        password: form.password,
        firstName: form.first,
        lastName: form.last,
        phone: form.phone,
        planId: form.plan,
        cycle: annual ? "annual" : "monthly",
      });
      setSubmitting(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      let message = "Your 7-day trial starts now.";
      if (chosen) {
        const booked = await book(chosen);
        message = booked
          ? `See you at ${chosen.name}, ${chosen.day} ${chosen.time}.`
          : "Your 7-day trial starts now — that first pick filled up, grab another from the schedule.";
      }

      setDone({ firstName: (form.first || "Athlete").toUpperCase(), email: form.email, message });
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {}
      return;
    }
    setStep(step + 1);
    setError(null);
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    setError(null);
  };

  if (done) {
    return (
      <section className={styles.section}>
        <div className={styles.doneWrap}>
          <div className={styles.ringWrap}>
            <span className={styles.ring} />
            <span className={styles.check}>✓</span>
          </div>
          <h1 className={styles.doneTitle}>YOU&apos;RE IN, {done.firstName}.</h1>
          <p className={styles.doneLede}>{done.message}</p>
          <div className={styles.doneActions}>
            <Link href="/dashboard" className={styles.doneBtnPrimary}>
              Go to dashboard
            </Link>
            <Link href="/classes" className={styles.doneBtnSecondary}>
              Book another class
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const emailBorder =
    error && error.toLowerCase().includes("email") ? "#FF6B3D" : "rgba(255,255,255,.14)";
  const passwordBorder =
    error && error.toLowerCase().includes("password") ? "#FF6B3D" : "rgba(255,255,255,.14)";

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>SIGN UP · 4 STEPS · 2 MINUTES</p>
      <h1 className={styles.h1}>{STEP_TITLES[step]}</h1>
      <div className={styles.progressRow}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.progressTrack}>
            <span
              className={styles.progressFill}
              style={{ width: step >= i ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>
      <p className={styles.stepLabel}>
        STEP {step} OF 4 — {STEP_NAMES[step]}
      </p>

      {step === 1 && (
        <div className={styles.stepBody}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              First name
              <input
                className={styles.input}
                value={form.first}
                onChange={update("first")}
                placeholder="Ada"
              />
            </label>
            <label className={styles.field}>
              Last name
              <input
                className={styles.input}
                value={form.last}
                onChange={update("last")}
                placeholder="Okonkwo"
              />
            </label>
            <label className={styles.field}>
              Email
              <input
                className={styles.input}
                style={{ borderColor: emailBorder }}
                value={form.email}
                onChange={update("email")}
                placeholder="you@email.com"
                type="email"
              />
            </label>
            <label className={styles.field}>
              Mobile
              <input
                className={styles.input}
                value={form.phone}
                onChange={update("phone")}
                placeholder="(512) 555-0148"
              />
            </label>
            <label className={styles.field}>
              Password
              <input
                className={styles.input}
                style={{ borderColor: passwordBorder }}
                value={form.password}
                onChange={update("password")}
                placeholder="At least 8 characters"
                type="password"
              />
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepBody}>
          <div className={styles.planList}>
            {PLAN_BASE.map((p) => {
              const sel = form.plan === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  className={styles.planOption}
                  style={{
                    background: sel ? "rgba(200,255,46,.09)" : "#121410",
                    borderColor: sel ? ACCENT : "rgba(255,255,255,.1)",
                  }}
                  onClick={() => setForm((f) => ({ ...f, plan: p.name }))}
                >
                  <div>
                    <div
                      className={styles.planOptionName}
                      style={{ color: sel ? ACCENT : "#F2F3EF" }}
                    >
                      {p.name}
                    </div>
                    <div className={styles.planOptionSub}>{p.sub}</div>
                  </div>
                  <div
                    className={styles.planOptionPrice}
                    style={{ color: sel ? ACCENT : "#F2F3EF" }}
                  >
                    {fmtPrice(p.monthly, annual)}
                    <span className={styles.planOptionPer}>{annual ? "/yr" : "/mo"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.stepBody}>
          <p className={styles.optionalLede}>
            Optional — lock in your first session now. You can skip and book later.
          </p>
          <div className={styles.classGrid}>
            {firstOpts.map((c) => {
              const sel = form.firstClass === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={styles.classOption}
                  style={{
                    background: sel ? "rgba(200,255,46,.1)" : "#121410",
                    borderColor: sel ? ACCENT : "rgba(255,255,255,.1)",
                  }}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      firstClass: f.firstClass === c.id ? null : c.id,
                    }))
                  }
                >
                  <div
                    className={styles.classOptionName}
                    style={{ color: sel ? ACCENT : "#F2F3EF" }}
                  >
                    {c.name}
                  </div>
                  <div className={styles.classOptionMeta}>
                    {c.day} · {c.time}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className={styles.stepBody}>
          <div className={styles.summaryBox}>
            <div className={styles.summaryTitle}>ORDER SUMMARY</div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Plan</span>
              <span className={styles.summaryVal}>
                {planObj.name} · {fmtPrice(planObj.monthly, annual)}
                {annual ? "/yr" : "/mo"}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>First session</span>
              <span className={styles.summaryVal}>
                {chosen ? `${chosen.name} · ${chosen.day} ${chosen.time}` : "Book later"}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Trial</span>
              <span className={styles.summaryVal}>7 days free</span>
            </div>
            <div className={styles.summaryRow} style={{ borderBottom: "none" }}>
              <span className={styles.summaryKey}>Joining fee</span>
              <span className={styles.summaryVal}>Waived</span>
            </div>
            <div className={styles.dueRow}>
              <span>DUE TODAY</span>
              <span className={styles.dueVal}>$0.00</span>
            </div>
            <p className={styles.trialNote}>First charge after your free 7-day trial ends.</p>
          </div>
          <div className={styles.cardGrid}>
            <label className={`${styles.field} ${styles.cardNumberField}`}>
              Card number
              <input
                className={`${styles.input} ${styles.inputMono}`}
                value={form.card}
                onChange={update("card")}
                placeholder="4242 4242 4242 4242"
              />
            </label>
            <label className={styles.field}>
              Expiry
              <input
                className={`${styles.input} ${styles.inputMono}`}
                placeholder="09 / 29"
              />
            </label>
            <label className={styles.field}>
              CVC
              <input className={`${styles.input} ${styles.inputMono}`} placeholder="123" />
            </label>
          </div>
          <p className={styles.demoNote}>DEMO ONLY — NO PAYMENT IS PROCESSED.</p>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.navRow}>
        {step > 1 && (
          <button type="button" className={styles.backBtn} onClick={back} disabled={submitting}>
            ← Back
          </button>
        )}
        <button
          type="button"
          className={styles.nextBtn}
          onClick={next}
          disabled={submitting}
          style={submitting ? { opacity: 0.7, cursor: "default" } : undefined}
        >
          {submitting ? "Creating your account…" : step === 4 ? "Start my free trial" : "Continue →"}
        </button>
      </div>
    </section>
  );
}
