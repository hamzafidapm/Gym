import Image from "next/image";
import Link from "next/link";
import { TRAINERS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import styles from "./TrainersGrid.module.css";

export default function TrainersGrid() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>THE STAFF</p>
      <h1 className={styles.h1}>COACHES WHO COUNT REPS, NOT MINUTES.</h1>
      <p className={styles.lede}>
        Nine full-time coaches. Average tenure six years. All of them program their own
        blocks.
      </p>
      <div className={styles.grid}>
        {TRAINERS.map((t) => (
          <Reveal key={t.id} as="div">
            <Link href={`/trainers/${t.id}`} className={styles.card}>
              <div className={styles.cardImgWrap}>
                <Image
                  src={t.img}
                  alt={`Portrait of ${t.name}, ${t.specialty.toLowerCase()} coach at IRONHAUS`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 700px) 100vw, 33vw"
                  className={styles.cardImg}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.specialty}>{t.specialty}</div>
                <h2 className={styles.name}>{t.name}</h2>
                <p className={styles.short}>{t.short}</p>
                <span className={styles.viewLink}>View schedule →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
