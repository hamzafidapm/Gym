"use client";

import { useState } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { submitContactMessage } from "@/app/actions/contact";
import styles from "./ContactView.module.css";

const CONTACT_INFO = [
  { label: "ADDRESS", value: "1408 E 6th St\nAustin, TX 78702" },
  { label: "PHONE", value: "(512) 555-0148" },
  { label: "HOURS", value: "Mon–Fri 05:30–22:00\nSat–Sun 07:00–19:00" },
  { label: "SOCIAL", value: "@ironhaus.atx\nfront@ironhaus.fit" },
];

export default function ContactView() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { flash } = useAppState();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await submitContactMessage({ name, email, message });
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
      flash("Message sent — we reply within a day.");
    }
    setSubmitting(false);
  };

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>VISIT</p>
      <h1 className={styles.h1}>1408 E 6TH ST, AUSTIN TX</h1>
      <p className={styles.lede}>
        Two blocks east of Comal. Street parking on 6th, free lot behind the building
        after 5pm.
      </p>
      <div className={styles.grid}>
        <div>
          <div
            role="img"
            aria-label="Map showing IRONHAUS at 1408 East 6th Street, East Austin"
            className={styles.map}
          >
            <span className={styles.mapRoadH} />
            <span className={styles.mapRoadV} />
            <span className={styles.mapPin}>
              <span className={styles.mapDot} />
              <span className={styles.mapLabel}>IRONHAUS</span>
            </span>
            <span className={styles.mapCorner}>E 6TH ST × COMAL</span>
          </div>
          <div className={styles.infoGrid}>
            {CONTACT_INFO.map((c) => (
              <div key={c.label} className={styles.infoCard}>
                <div className={styles.infoLabel}>{c.label}</div>
                <div className={styles.infoValue}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>SEND US A NOTE</h2>
          {sent ? (
            <div className={styles.sentBox}>
              <div className={styles.sentTitle}>MESSAGE SENT</div>
              <p className={styles.sentBody}>
                We answer within one business day. Usually faster.
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={submit}>
              <input
                className={styles.input}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                className={styles.textarea}
                placeholder="What do you want to work on?"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              {error && <p style={{ margin: 0, fontSize: 13.5, color: "#FF6B3D" }}>{error}</p>}
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
