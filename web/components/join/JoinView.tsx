"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CLASSES, PLAN_BASE, fmtPrice, planByName, trainerById } from "@/lib/data";
import { useAppState } from "@/lib/AppStateContext";
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
  phone: string;
  plan: string;
  firstClass: string | null;
  card: string;
}

export default function JoinView() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "PREMIUM";
  const { annual } = useAppState();

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    first: "",
    last: "",
    email: "",
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
    () => CLASSES.filter((c) => c.spots > 3).slice(0, 4),
    [],
  );
  const chosen = form.firstClass ? CLASSES.find((c) => c.key === form.firstClass) : null;
  const planObj = planByName(form.plan);

  const next = () => {
    if (step === 1) {
      if (!form.first.trim() || !form.last.trim()) {
        setError("We need your first and last name to make a member card.");
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        setError("That email doesn’t look right.");
        return;
      }
    }
    if (step === 4) {
      setDone(true);
      setError(null);
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
    const firstName = (form.first || "Athlete").toUpperCase();
    const confirmLine = chosen
      ? `See you at ${chosen.name}, ${chosen.day} ${chosen.time}.`
      : "Your 7-day trial starts now.";
    return (
      <section className={styles.section}>
        <div className={styles.doneWrap}>
          <div className={styles.ringWrap}>
            <span className={styles.ring} />
            <span className={styles.check}>✓</span>
          </div>
          <h1 className={styles.doneTitle}>YOU&apos;RE IN, {firstName}.</h1>
          <p className={styles.doneLede}>
            {confirmLine} Confirmation sent to {form.email}. Bring shoes you can lift
            in.
          </p>
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
              const sel = form.firstClass === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  className={styles.classOption}
                  style={{
                    background: sel ? "rgba(200,255,46,.1)" : "#121410",
                    borderColor: sel ? ACCENT : "rgba(255,255,255,.1)",
                  }}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      firstClass: f.firstClass === c.key ? null : c.key,
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
                    {c.day} · {c.time} · {trainerById(c.trainerId)?.name}
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
          <button type="button" className={styles.backBtn} onClick={back}>
            ← Back
          </button>
        )}
        <button type="button" className={styles.nextBtn} onClick={next}>
          {step === 4 ? "Start my free trial" : "Continue →"}
        </button>
      </div>
    </section>
  );
}
