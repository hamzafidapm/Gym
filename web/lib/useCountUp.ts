"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(targets: number[], duration = 1500) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [counts, setCounts] = useState<number[]>(targets.map(() => 0));
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min(1, (performance.now() - t0) / duration);
        const e = 1 - Math.pow(1 - p, 3);
        setCounts(targets.map((v) => Math.round(v * e)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, counts };
}
