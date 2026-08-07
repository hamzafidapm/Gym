import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data";
import Reveal from "@/components/Reveal";
import styles from "./DisciplinesGrid.module.css";

export default function DisciplinesGrid() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.head}>
        <div>
          <p className={styles.eyebrow}>01 / DISCIPLINES</p>
          <h2 className={styles.h2}>
            PICK YOUR
            <br />
            FIGHT.
          </h2>
        </div>
        <Link href="/classes" className={styles.viewAll}>
          View full schedule →
        </Link>
      </Reveal>
      <div className={styles.grid}>
        {CATEGORIES.map((c) => (
          <Reveal key={c.name} as="div">
            <Link
              href={`/classes?type=${encodeURIComponent(c.type)}`}
              className={styles.card}
            >
              <Image
                src={c.img}
                alt={c.alt}
                fill
                loading="lazy"
                sizes="(max-width: 700px) 100vw, 33vw"
                className={styles.cardImg}
              />
              <div aria-hidden="true" className={styles.cardScrim} />
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>{c.num}</span>
                <span className={styles.cardCount}>{c.count} / WK</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{c.name}</h3>
                <p className={styles.cardBlurb}>{c.blurb}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
