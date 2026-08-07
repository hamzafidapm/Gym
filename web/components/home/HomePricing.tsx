import Reveal from "@/components/Reveal";
import PricingToggle from "@/components/PricingToggle";
import PricingCards from "@/components/PricingCards";
import styles from "./HomePricing.module.css";

export default function HomePricing() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.head}>
        <p className={styles.eyebrow}>03 / MEMBERSHIP</p>
        <h2 className={styles.h2}>NO CONTRACTS. NO EXCUSES.</h2>
        <PricingToggle />
      </Reveal>
      <PricingCards reveal />
    </section>
  );
}
