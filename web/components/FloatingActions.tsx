import Link from "next/link";

export default function FloatingActions() {
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 95,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "flex-end",
      }}
    >
      <a
        href="tel:+15125550148"
        aria-label="Call IRONHAUS"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#121410",
          border: "1px solid rgba(255,255,255,.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          textDecoration: "none",
        }}
        className="ih-fab"
      >
        ☏
      </a>
      <a
        href="https://wa.me/15125550148"
        aria-label="Message IRONHAUS on WhatsApp"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#121410",
          border: "1px solid rgba(255,255,255,.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          textDecoration: "none",
        }}
        className="ih-fab"
      >
        ✆
      </a>
      <Link
        href="/classes"
        style={{
          minHeight: 52,
          padding: "0 22px",
          borderRadius: 26,
          background: "#C8FF2E",
          color: "#0A0B09",
          border: 0,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          boxShadow: "0 10px 30px rgba(200,255,46,.28)",
          display: "flex",
          alignItems: "center",
        }}
        className="ih-fab-book"
      >
        Book Now
      </Link>
    </div>
  );
}
