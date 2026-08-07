"use client";

import type { EnrichedClass } from "@/lib/classHelpers";
import styles from "./ClassModal.module.css";

export default function ClassModal({
  cls,
  onClose,
  onBook,
}: {
  cls: EnrichedClass;
  onClose: () => void;
  onBook: () => void;
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <div>
            <p className={styles.meta}>
              {cls.day} · {cls.time} · {cls.durMin} min
            </p>
            <h2 className={styles.title}>{cls.name}</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            className={styles.closeBtn}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className={styles.badges}>
          <span className={styles.badge} style={{ borderColor: cls.levelColor, color: cls.levelColor }}>
            {cls.level}
          </span>
          <span className={styles.badge} style={{ borderColor: "rgba(255,255,255,.16)", color: "#9A9E93" }}>
            {cls.spotsLabel}
          </span>
          <span className={styles.badge} style={{ borderColor: "rgba(255,255,255,.16)", color: "#9A9E93" }}>
            STUDIO {cls.room}
          </span>
        </div>
        <p className={styles.desc}>{cls.desc}</p>
        <div className={styles.infoGrid}>
          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>WHAT TO BRING</div>
            <div className={styles.infoValue}>{cls.bring}</div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>YOUR COACH</div>
            <div className={styles.infoValue}>
              <strong style={{ color: "#F2F3EF" }}>{cls.trainerName}</strong>
              <br />
              {cls.trainerBio}
            </div>
          </div>
        </div>
        <button
          type="button"
          className={styles.bookBtn}
          style={{ background: cls.btnBg, color: cls.btnFg }}
          onClick={onBook}
        >
          {cls.btnLabel}
        </button>
      </div>
    </div>
  );
}
