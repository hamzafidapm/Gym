"use client";

import { useState } from "react";
import { TESTIMONIALS } from "@/lib/data";
import styles from "./TestimonialCarousel.module.css";

export default function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>04 / RECEIPTS</p>
        <blockquote style={{ margin: 0, textAlign: "center" }}>
          <p className={styles.quote}>“{t.quote}”</p>
          <footer className={styles.footer}>
            <span className={styles.name}>{t.name}</span>
            <span className={styles.meta}>{t.meta}</span>
          </footer>
        </blockquote>
        <div className={styles.dots}>
          {TESTIMONIALS.map((item, idx) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Show testimonial from ${item.name}`}
              className={styles.dotBtn}
              onClick={() => setI(idx)}
            >
              <span className={styles.dot} data-active={idx === i} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
