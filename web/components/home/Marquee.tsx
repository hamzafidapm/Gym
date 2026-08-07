import styles from "./Marquee.module.css";

const TEXT =
  "STRENGTH · HIIT · BOXING · YOGA · CYCLE · MOBILITY · PERSONAL TRAINING · STRENGTH · HIIT · BOXING · YOGA · CYCLE · MOBILITY · PERSONAL TRAINING ·  ";

export default function Marquee() {
  return (
    <div aria-hidden="true" className={styles.wrap}>
      <div className={styles.track}>
        <span className={styles.item}>{TEXT}</span>
        <span className={styles.item}>{TEXT}</span>
      </div>
    </div>
  );
}
