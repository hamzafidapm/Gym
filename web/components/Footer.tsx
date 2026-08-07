import Link from "next/link";
import { NAV_ITEMS } from "@/lib/data";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brandRow}>
              <span className={styles.brandMark} />
              <span className={styles.brandName}>IRONHAUS</span>
            </div>
            <p className={styles.brandDesc}>
              Strength &amp; conditioning studio. East Austin since 2016.
            </p>
          </div>
          <div>
            <div className={styles.heading}>EXPLORE</div>
            <div className={styles.links}>
              {NAV_ITEMS.map((n) => (
                <Link key={n.href} href={n.href} className={styles.link}>
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.heading}>HOURS</div>
            <p className={styles.copy}>
              Mon–Fri 05:30 – 22:00
              <br />
              Sat–Sun 07:00 – 19:00
            </p>
          </div>
          <div>
            <div className={styles.heading}>CONTACT</div>
            <p className={styles.copy}>
              1408 E 6th St, Austin TX
              <br />
              (512) 555-0148
              <br />
              <a href="mailto:front@ironhaus.fit">front@ironhaus.fit</a>
            </p>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 IRONHAUS ATX · ALL RIGHTS RESERVED</span>
          <span>PRIVACY · TERMS · ACCESSIBILITY</span>
        </div>
      </div>
    </footer>
  );
}
