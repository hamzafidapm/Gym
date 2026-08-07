"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/data";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark} />
            <span className={styles.logoText}>IRONHAUS</span>
          </Link>

          <div className={styles.desktopNav}>
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={styles.navLink}
                data-active={isActive(n.href)}
              >
                {n.label}
              </Link>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/dashboard" className={styles.accountBtn}>
              My Account
            </Link>
            <Link href="/join" className={styles.joinBtn}>
              Start Free Trial
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              className={styles.hamburger}
              onClick={() => setNavOpen(true)}
            >
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
            </button>
          </div>
        </nav>
      </header>

      {navOpen && (
        <div className={styles.drawerOverlay} onClick={() => setNavOpen(false)}>
          <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHead}>
              <span className={styles.drawerTitle}>MENU</span>
              <button
                type="button"
                aria-label="Close menu"
                className={styles.drawerClose}
                onClick={() => setNavOpen(false)}
              >
                ×
              </button>
            </div>
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={styles.drawerLink}
                data-active={isActive(n.href)}
                onClick={() => setNavOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className={styles.drawerLink}
              onClick={() => setNavOpen(false)}
            >
              MY ACCOUNT
            </Link>
            <Link
              href="/join"
              className={styles.drawerJoin}
              onClick={() => setNavOpen(false)}
            >
              Start Free Trial
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}
