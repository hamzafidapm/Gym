"use client";

import { useCountUp } from "@/lib/useCountUp";
import styles from "./StatsSection.module.css";

const STATS = [
  { target: 2840, suffix: "+", label: "Active members", note: "Capped at 3,000 by design" },
  { target: 9, suffix: "", label: "Full-time coaches", note: "Average tenure six years" },
  { target: 41, suffix: "", label: "Classes each week", note: "14 athletes max, every time" },
  { target: 62, suffix: "%", label: "Hit their 8-week goal", note: "Measured, not self-reported" },
];

export default function StatsSection() {
  const { ref, counts } = useCountUp(STATS.map((s) => s.target));

  return (
    <section className={styles.section}>
      <div ref={ref} className={styles.grid}>
        {STATS.map((s, i) => (
          <div key={s.label}>
            <div className={styles.value}>
              {(i === 0 ? counts[i].toLocaleString() : counts[i]) + s.suffix}
            </div>
            <div className={styles.label}>{s.label}</div>
            <div className={styles.note}>{s.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
