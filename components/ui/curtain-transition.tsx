"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function CurtainTransition() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [phase, setPhase] = useState<"idle" | "enter" | "exit">("idle");

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    setPhase("enter");
    const t1 = setTimeout(() => setPhase("exit"), 450);
    const t2 = setTimeout(() => setPhase("idle"), 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: i % 2 === 0 ? "#0a0a0a" : "#111111",
            transformOrigin: phase === "enter" ? "left center" : "right center",
            transform: phase === "enter" ? "scaleX(1)" : "scaleX(0)",
            transition: `transform 0.42s cubic-bezier(0.77, 0, 0.175, 1)`,
            transitionDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}
