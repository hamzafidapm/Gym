"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight || 1;
      const y = window.scrollY || 0;
      setPct(Math.min(100, Math.max(0, (y / max) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        background: "#C8FF2E",
        zIndex: 120,
        width: pct + "%",
        boxShadow: "0 0 14px rgba(200,255,46,.7)",
      }}
    />
  );
}
