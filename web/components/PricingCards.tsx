"use client";

import Link from "next/link";
import { PLAN_BASE, fmtPrice } from "@/lib/data";
import { useAppState } from "@/lib/AppStateContext";
import { ACCENT } from "@/lib/theme";
import Reveal from "./Reveal";
import styles from "./PricingCards.module.css";

export default function PricingCards({ reveal = false }: { reveal?: boolean }) {
  const { annual } = useAppState();

  return (
    <div className={styles.grid}>
      {PLAN_BASE.map((p) => {
        const hero = p.name === "PREMIUM";
        const bg = hero ? "linear-gradient(165deg,#C8FF2E,#A9E514)" : "#121410";
        const border = hero ? ACCENT : "rgba(255,255,255,.1)";
        const fg = hero ? "#0A0B09" : "#F2F3EF";
        const muted = hero ? "rgba(10,11,9,.62)" : "#9A9E93";
        const tagColor = hero ? "rgba(10,11,9,.6)" : ACCENT;
        const dot = hero ? "#0A0B09" : ACCENT;
        const btnBg = hero ? "#0A0B09" : ACCENT;
        const btnFg = hero ? ACCENT : "#0A0B09";

        const card = (
          <div className={styles.card} style={{ background: bg, borderColor: border }}>
            <div className={styles.tag} style={{ color: tagColor }}>
              {p.tag}
            </div>
            <h3 className={styles.name} style={{ color: fg }}>
              {p.name}
            </h3>
            <div className={styles.priceRow}>
              <span className={styles.price} style={{ color: fg }}>
                {fmtPrice(p.monthly, annual)}
              </span>
              <span className={styles.per} style={{ color: muted }}>
                {annual ? "/year" : "/month"}
              </span>
            </div>
            <p className={styles.sub} style={{ color: muted }}>
              {p.sub}
            </p>
            <div className={styles.features}>
              {p.features.map((f) => (
                <div className={styles.feature} key={f} style={{ color: fg }}>
                  <span className={styles.dot} style={{ background: dot }} />
                  {f}
                </div>
              ))}
            </div>
            <Link
              href={`/join?plan=${p.name}`}
              className={styles.joinBtn}
              style={{ background: btnBg, color: btnFg }}
            >
              Join {p.name}
            </Link>
          </div>
        );

        return reveal ? (
          <Reveal key={p.name}>{card}</Reveal>
        ) : (
          <div key={p.name}>{card}</div>
        );
      })}
    </div>
  );
}
