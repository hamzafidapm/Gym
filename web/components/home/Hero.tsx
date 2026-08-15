import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        className={styles.bgMedia}
        src="/img/strength.png"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <div aria-hidden="true" className={styles.glow} />
      <div aria-hidden="true" className={styles.scrim} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>EAST AUSTIN · EST. 2016 · OPEN 05:30</p>
        <h1 className={styles.h1}>
          <span className={styles.h1Line}>TRAIN</span>
          <span className={styles.h1Line}>HEAVIER.</span>
          <span className={styles.h1Line}>RECOVER SMARTER.</span>
        </h1>
        <p className={styles.sub}>
          A coach-led strength studio for people who want a number to chase. 40+ classes
          a week, capped at 14 athletes, programmed in 8-week blocks.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/classes" className={styles.ctaPrimary}>
            Book a Class
          </Link>
          <Link href="/join" className={styles.ctaSecondary}>
            Start Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
}
