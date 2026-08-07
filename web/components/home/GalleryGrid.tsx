import Image from "next/image";
import { GALLERY } from "@/lib/data";
import Reveal from "@/components/Reveal";
import styles from "./GalleryGrid.module.css";

export default function GalleryGrid() {
  return (
    <section id="gallery" className={styles.section}>
      <Reveal className={styles.head}>
        <h2 className={styles.h2}>@IRONHAUS.ATX</h2>
        <a href="#gallery" className={styles.follow}>
          FOLLOW THE FLOOR →
        </a>
      </Reveal>
      <div className={styles.grid}>
        {GALLERY.map((g, i) => (
          <Reveal key={g.label + i} as="div" className={styles.tile}>
            <Image
              src={g.img}
              alt={g.alt}
              fill
              loading="lazy"
              sizes="(max-width: 700px) 50vw, 200px"
              className={styles.tileImg}
              style={{ objectPosition: g.pos }}
            />
            <div aria-hidden="true" className={styles.tileScrim} />
            <span className={styles.tileLabel}>{g.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
