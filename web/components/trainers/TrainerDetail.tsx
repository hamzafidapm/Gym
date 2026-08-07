"use client";

import Image from "next/image";
import Link from "next/link";
import { enrichClass } from "@/lib/classHelpers";
import { useAppState } from "@/lib/AppStateContext";
import { useClasses } from "@/lib/useClasses";
import type { Trainer } from "@/lib/types";
import styles from "./TrainerDetail.module.css";

export default function TrainerDetail({ trainer }: { trainer: Trainer }) {
  const { isBooked, book } = useAppState();
  const { classes: allClasses, loading, refetch } = useClasses();
  const classes = allClasses
    .filter((c) => c.trainerId === trainer.id)
    .map((c) => enrichClass(c, isBooked));

  const handleBook = async (id: string) => {
    const c = allClasses.find((x) => x.id === id);
    if (!c) return;
    const success = await book(c);
    if (success) refetch();
  };

  return (
    <section className={styles.section}>
      <Link href="/trainers" className={styles.backBtn}>
        ← All coaches
      </Link>
      <div className={styles.grid}>
        <div className={styles.imgWrap}>
          <Image
            src={trainer.img}
            alt={`Portrait of ${trainer.name}, ${trainer.specialty.toLowerCase()} coach at IRONHAUS`}
            fill
            sizes="(max-width: 700px) 100vw, 500px"
            className={styles.img}
            priority
          />
        </div>
        <div>
          <p className={styles.specialty}>{trainer.specialty}</p>
          <h1 className={styles.name}>{trainer.name}</h1>
          <p className={styles.bio}>{trainer.bio}</p>
          <p className={styles.certs}>Certifications — {trainer.certs}</p>
          <h2 className={styles.h2}>THIS WEEK WITH {trainer.first}</h2>
          <div className={styles.classList}>
            {loading && <p className={styles.empty}>Loading this week&apos;s classes…</p>}
            {!loading && classes.length === 0 && (
              <p className={styles.empty}>No classes on the board this week.</p>
            )}
            {classes.map((c) => (
              <div key={c.id} className={styles.classRow}>
                <div>
                  <div className={styles.classInfo}>{c.name}</div>
                  <div className={styles.classMeta}>
                    {c.day} · {c.time} · {c.durMin} min
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.bookBtn}
                  style={{ background: c.btnBg, color: c.btnFg }}
                  onClick={() => handleBook(c.id)}
                >
                  {c.btnLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
