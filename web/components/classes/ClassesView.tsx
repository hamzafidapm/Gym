"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DAY_NAMES, DAY_ORDER, TRAINERS } from "@/lib/data";
import { enrichClass } from "@/lib/classHelpers";
import { useAppState } from "@/lib/AppStateContext";
import { useClasses } from "@/lib/useClasses";
import ClassModal from "./ClassModal";
import styles from "./ClassesView.module.css";

const TYPES = ["ALL", "Strength", "HIIT", "Boxing", "Yoga", "Cycle", "Mobility"];

export default function ClassesView() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "ALL";

  const [typeFilter, setTypeFilter] = useState(initialType);
  const [trainerFilter, setTrainerFilter] = useState("ALL");
  const [modalClassId, setModalClassId] = useState<string | null>(null);

  const { isBooked, book } = useAppState();
  const { classes, loading, error, refetch } = useClasses();

  const filtered = classes.filter(
    (c) =>
      (typeFilter === "ALL" || c.type === typeFilter) &&
      (trainerFilter === "ALL" || c.trainerId === trainerFilter),
  );
  const schedule = DAY_ORDER.map((day) => {
    const items = filtered
      .filter((c) => c.day === day)
      .sort((a, b) => a.time.localeCompare(b.time))
      .map((c) => enrichClass(c, isBooked));
    return { day, name: DAY_NAMES[day], items };
  }).filter((d) => d.items.length > 0);

  const modalClassRaw = modalClassId ? classes.find((c) => c.id === modalClassId) : null;
  const modalClass = modalClassRaw ? enrichClass(modalClassRaw, isBooked) : null;

  const handleBook = async (id: string) => {
    const c = classes.find((x) => x.id === id);
    if (!c) return;
    const success = await book(c);
    if (success) {
      setModalClassId(null);
      refetch();
    }
  };

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>SCHEDULE</p>
      <h1 className={styles.h1}>THIS WEEK ON THE FLOOR</h1>
      <p className={styles.lede}>
        Every session capped at 14. Free cancellation up to 4 hours before start.
      </p>

      <div className={styles.filterRow}>
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            className={styles.chip}
            data-active={typeFilter === t}
            onClick={() => setTypeFilter(t)}
          >
            {t === "ALL" ? "All classes" : t}
          </button>
        ))}
      </div>
      <div className={styles.filterRow}>
        <button
          type="button"
          className={`${styles.chip} ${styles.chipTrainer}`}
          data-active={trainerFilter === "ALL"}
          onClick={() => setTrainerFilter("ALL")}
        >
          All coaches
        </button>
        {TRAINERS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.chip} ${styles.chipTrainer}`}
            data-active={trainerFilter === t.id}
            onClick={() => setTrainerFilter(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : error ? (
        <div className={styles.empty}>Couldn&apos;t load the schedule — {error}</div>
      ) : schedule.length === 0 ? (
        <div className={styles.empty}>No classes match those filters this week.</div>
      ) : (
        <div className={styles.scheduleGrid}>
          {schedule.map((day) => (
            <div key={day.day} className={styles.dayCard}>
              <div className={styles.dayHead}>
                <span className={styles.dayName}>{day.name}</span>
                <span className={styles.dayCount}>{day.items.length} CLASSES</span>
              </div>
              <div className={styles.items}>
                {day.items.map((c) => (
                  <div key={c.id} className={styles.item}>
                    <div className={styles.itemTop}>
                      <div>
                        <button
                          type="button"
                          className={styles.itemName}
                          onClick={() => setModalClassId(c.id)}
                        >
                          {c.name}
                        </button>
                        <div className={styles.itemMeta}>
                          {c.trainerName} · {c.durMin} min
                        </div>
                      </div>
                      <span className={styles.itemTime}>{c.time}</span>
                    </div>
                    <div className={styles.badges}>
                      <span
                        className={styles.badge}
                        style={{ borderColor: c.levelColor, color: c.levelColor }}
                      >
                        {c.level}
                      </span>
                      <span
                        className={styles.badge}
                        style={{ borderColor: "rgba(255,255,255,.14)", color: c.spotColor }}
                      >
                        {c.spotsLabel}
                      </span>
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
          ))}
        </div>
      )}

      {modalClass && (
        <ClassModal
          cls={modalClass}
          onClose={() => setModalClassId(null)}
          onBook={() => handleBook(modalClass.id)}
        />
      )}
    </section>
  );
}
