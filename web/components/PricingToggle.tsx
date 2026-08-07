"use client";

import { useAppState } from "@/lib/AppStateContext";
import styles from "./PricingCards.module.css";

export default function PricingToggle() {
  const { annual, setAnnual } = useAppState();
  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={styles.toggleBtn}
        data-active={!annual}
        onClick={() => setAnnual(false)}
      >
        Monthly
      </button>
      <button
        type="button"
        className={styles.toggleBtn}
        data-active={annual}
        onClick={() => setAnnual(true)}
      >
        Annual · save 17%
      </button>
    </div>
  );
}
