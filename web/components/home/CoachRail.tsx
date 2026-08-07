"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { TRAINERS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import styles from "./CoachRail.module.css";

export default function CoachRail() {
  const railRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dx: number) => railRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <section className={styles.section}>
      <Reveal className={styles.head}>
        <div>
          <p className={styles.eyebrow}>02 / THE COACHES</p>
          <h2 className={styles.h2}>
            WHO&apos;S IN
            <br />
            YOUR CORNER.
          </h2>
        </div>
        <div className={styles.arrows}>
          <button
            type="button"
            aria-label="Previous trainers"
            className={styles.arrowBtn}
            onClick={() => scrollBy(-340)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next trainers"
            className={styles.arrowBtn}
            onClick={() => scrollBy(340)}
          >
            →
          </button>
        </div>
      </Reveal>
      <div ref={railRef} className={styles.rail}>
        {TRAINERS.map((t) => (
          <Link key={t.id} href={`/trainers/${t.id}`} className={styles.card}>
            <div className={styles.cardImgWrap}>
              <Image
                src={t.img}
                alt={`Portrait of ${t.name}, ${t.specialty.toLowerCase()} coach at IRONHAUS`}
                fill
                loading="lazy"
                sizes="320px"
                className={styles.cardImg}
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.specialty}>{t.specialty}</div>
              <h3 className={styles.name}>{t.name}</h3>
              <p className={styles.certs}>{t.certs}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
