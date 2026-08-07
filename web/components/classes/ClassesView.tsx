"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CLASSES, DAY_NAMES, DAY_ORDER, TRAINERS } from "@/lib/data";
import { enrichClass } from "@/lib/classHelpers";
import { useAppState } from "@/lib/AppStateContext";
import ClassModal from "./ClassModal";
import styles from "./ClassesView.module.css";

const TYPES = ["ALL", "Strength", "HIIT", "Boxing", "Yoga", "Cycle", "Mobility"];

export default function ClassesView() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "ALL";

  const [typeFilter, setTypeFilter] = useState(initialType);
  const [trainerFilter, setTrainerFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [modalKey, setModalKey] = useState<string | null>(null);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isBooked, book } = useAppState();

  useEffect(() => {
    return () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    };
  }, []);

  const applyFilter = (setter: (v: string) => void, value: string) => {
    setter(value);
    setLoading(true);
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setLoading(false), 340);
  };

  const schedule = useMemo(() => {
    const filtered = CLASSES.filter(
      (c) =>
        (typeFilter === "ALL" || c.type === typeFilter) &&
        (trainerFilter === "ALL" || c.trainerId === trainerFilter),
    );
    return DAY_ORDER.map((day) => {
      const items = filtered
        .filter((c) => c.day === day)
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((c) => enrichClass(c, isBooked));
      return { day, name: DAY_NAMES[day], items };
    }).filter((d) => d.items.length > 0);
  }, [typeFilter, trainerFilter, isBooked]);

  const modalClass = modalKey
    ? enrichClass(CLASSES.find((c) => c.key === modalKey)!, isBooked)
    : null;

  const handleBook = (key: string) => {
    const c = CLASSES.find((x) => x.key === key);
    if (!c) return;
    const success = book(c);
    if (success) setModalKey(null);
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
            onClick={() => applyFilter(setTypeFilter, t)}
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
          onClick={() => applyFilter(setTrainerFilter, "ALL")}
        >
          All coaches
        </button>
        {TRAINERS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.chip} ${styles.chipTrainer}`}
            data-active={trainerFilter === t.id}
            onClick={() => applyFilter(setTrainerFilter, t.id)}
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
                  <div key={c.key} className={styles.item}>
                    <div className={styles.itemTop}>
                      <div>
                        <button
                          type="button"
                          className={styles.itemName}
                          onClick={() => setModalKey(c.key)}
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
                      onClick={() => handleBook(c.key)}
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
          onClose={() => setModalKey(null)}
          onBook={() => handleBook(modalClass.key)}
        />
      )}
    </section>
  );
}
