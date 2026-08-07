"use client";

import { useEffect, useRef } from "react";

let sharedObserver: IntersectionObserver | null = null;

function getObserver() {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ih-revealed");
            sharedObserver?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
  }
  return sharedObserver;
}

type RevealTag = "div" | "span" | "section";

export default function Reveal({
  as = "div",
  className = "",
  style,
  children,
}: {
  as?: RevealTag;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = getObserver();
    if (!observer) {
      el.classList.add("ih-revealed");
      return;
    }
    observer.observe(el);
    const safety = setTimeout(() => el.classList.add("ih-revealed"), 2500);
    return () => {
      observer.unobserve(el);
      clearTimeout(safety);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`ih-reveal ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
