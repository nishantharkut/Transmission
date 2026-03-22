import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface NavbarProps {
  scrollProgress: number; // 0-1
}

export default function Navbar({ scrollProgress }: NavbarProps) {
  const [packetNum, setPacketNum] = useState(1);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Packet counter
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketNum((p) => p + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Blinking cursor
  useEffect(() => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.6,
      ease: "steps(1)",
    });
  }, []);

  // Map scroll to date
  const startYear = 1969;
  const endYear = 2026;
  const currentYear = startYear + (endYear - startYear) * scrollProgress;
  const year = Math.floor(currentYear);
  const month = Math.floor((currentYear % 1) * 12) + 1;
  const day = Math.floor(((currentYear * 365) % 30) + 1);
  const dateStr = `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex min-h-12 items-center justify-between gap-2 px-4 pt-[env(safe-area-inset-top,0px)] sm:px-6"
      style={{
        background: "hsla(220, 18%, 7%, 0.82)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="font-display-era shrink-0 font-bold text-[11px] text-signal sm:text-[13px]"
        style={{ fontStretch: "125%", letterSpacing: "0.08em" }}
      >
        TRANSMISSION
      </span>
      <span className="font-mono-era font-normal text-[11px] text-era-dim hidden sm:block">
        PKT #{String(packetNum).padStart(9, "0")} · {dateStr} · 22:30 UTC
      </span>
      <span className="font-mono-era font-medium text-[11px] text-signal">
        [RECEIVING]<span ref={cursorRef}>_</span>
      </span>
    </nav>
  );
}
