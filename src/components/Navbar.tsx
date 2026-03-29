import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef, memo } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface NavbarHandle {
  updateScroll: (progress: number) => void;
}

interface NavbarProps {
  activeEra: number;
}

/** WWW section uses a light page palette; text must adapt on fixed dark chrome. */
const WWW_ERA_INDEX = 1;

/** First ARPANET packet — scroll start anchor */
const TIMELINE_START_UTC = Date.UTC(1969, 9, 29, 22, 30, 0);

function formatPacketUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${y}.${mo}.${day} · ${h}:${min} UTC`;
}

const Navbar = memo(
  forwardRef<NavbarHandle, NavbarProps>(function Navbar({ activeEra }, ref) {
    const isWwwEra = activeEra === WWW_ERA_INDEX;
    const cursorRef = useRef<HTMLSpanElement>(null);
    const packetRef = useRef<HTMLSpanElement>(null);
    const packetNumRef = useRef(1);
    const scrollProgressRef = useRef(0);
    const endMsRef = useRef(Date.now());

    const updateDisplay = useCallback((progress: number) => {
      const el = packetRef.current;
      if (!el) return;
      const t = Math.max(0, Math.min(1, progress));
      const packetMs = TIMELINE_START_UTC + (endMsRef.current - TIMELINE_START_UTC) * t;
      const dateStr = formatPacketUtc(new Date(packetMs));
      el.textContent = `PKT #${String(packetNumRef.current).padStart(9, "0")} · ${dateStr}`;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        updateScroll: (progress: number) => {
          scrollProgressRef.current = progress;
          updateDisplay(progress);
        },
      }),
      [updateDisplay]
    );

    useEffect(() => {
      const interval = setInterval(() => {
        packetNumRef.current += 1;
        updateDisplay(scrollProgressRef.current);
      }, 50);
      return () => clearInterval(interval);
    }, [updateDisplay]);

    useEffect(() => {
      endMsRef.current = Date.now();
      const id = setInterval(() => {
        endMsRef.current = Date.now();
      }, 60_000);
      return () => clearInterval(id);
    }, []);

    useEffect(() => {
      if (!cursorRef.current) return;
      const tween = gsap.to(cursorRef.current, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.6,
        ease: "steps(1)",
      });
      return () => {
        tween.kill();
      };
    }, []);

    return (
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingLeft: "max(1.5rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(1.5rem, env(safe-area-inset-right, 0px))",
          paddingBottom: 0,
          height: "calc(3rem + env(safe-area-inset-top, 0px))",
          background: "hsla(220, 18%, 7%, 0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          className={cn(
            "font-display-era text-[13px] font-bold",
            isWwwEra
              ? "text-[hsl(210_95%_82%)] [text-shadow:0_0_20px_hsla(210,100%,70%,0.35)]"
              : "text-navbar-signal"
          )}
          style={{ fontStretch: "125%", letterSpacing: "0.08em" }}
        >
          TRANSMISSION
        </span>
        <span
          ref={packetRef}
          className="font-mono-era hidden sm:block text-[11px] font-normal tabular-nums tracking-tight"
          style={{ color: "hsl(220 10% 68%)" }}
        >
          PKT #000000001 · 1969.10.29 · 22:30 UTC
        </span>
        <span
          className={cn(
            "font-mono-era text-[11px]",
            isWwwEra
              ? "font-semibold text-[hsl(210_95%_82%)] [text-shadow:0_0_18px_hsla(210,100%,70%,0.3)]"
              : "font-medium text-navbar-signal"
          )}
        >
          [RECEIVING]<span ref={cursorRef}>_</span>
        </span>
      </nav>
    );
  })
);

Navbar.displayName = "Navbar";
export default Navbar;
