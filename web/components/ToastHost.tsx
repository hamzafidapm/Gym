"use client";

import { useAppState } from "@/lib/AppStateContext";

export default function ToastHost() {
  const { toast } = useAppState();
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 24,
        zIndex: 140,
        background: "#C8FF2E",
        color: "#0A0B09",
        padding: "15px 24px",
        borderRadius: 2,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: ".04em",
        boxShadow: "0 14px 40px rgba(0,0,0,.5)",
        animation: "ih-rise .3s cubic-bezier(.2,.8,.2,1) both",
        maxWidth: "calc(100vw - 32px)",
        textAlign: "center",
      }}
    >
      {toast}
    </div>
  );
}
