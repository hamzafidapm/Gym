"use client";

import { COMPARE_ROWS } from "@/lib/data";
import PricingToggle from "@/components/PricingToggle";
import PricingCards from "@/components/PricingCards";
import styles from "./PricingView.module.css";

export default function PricingView() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>MEMBERSHIP</p>
        <h1 className={styles.h1}>PAY FOR THE WORK. NOTHING ELSE.</h1>
        <p className={styles.lede}>
          Cancel any time from your dashboard. Annual saves you two months.
        </p>
        <div className={styles.toggleWrap}>
          <PricingToggle />
        </div>
      </div>
      <div className={styles.cardsWrap}>
        <PricingCards />
      </div>
      <h2 className={styles.compareH2}>SIDE BY SIDE</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLabel}>Included</th>
              <th className={styles.thPlan}>BASIC</th>
              <th className={`${styles.thPlan} ${styles.thPremium}`}>PREMIUM</th>
              <th className={styles.thPlan}>ELITE</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((r) => (
              <tr key={r.label}>
                <td className={styles.tdLabel}>{r.label}</td>
                <td className={styles.tdBasic}>{r.basic}</td>
                <td className={styles.tdPremium}>{r.premium}</td>
                <td className={styles.tdElite}>{r.elite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
