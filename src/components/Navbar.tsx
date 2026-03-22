import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface NavbarProps {
  scrollProgress: number; // 0-1
  /** Same index as `ERA_MAP` in Index.tsx — 1 is WWW (web1). */
  activeEra: number;
}

/** WWW section uses a light page palette; global --text-dim/--signal go dark and fail on fixed dark chrome. */
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

/** Current UTC from a time API; falls back to client clock on failure. */
async function fetchUtcNow(): Promise<Date> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC", {
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error("time api");
    const data: { utc_datetime?: string } = await res.json();
    const iso = data.utc_datetime;
    if (!iso) throw new Error("no datetime");
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) throw new Error("invalid");
    return parsed;
  } catch {
    return new Date();
  } finally {
    clearTimeout(t);
  }
}

export default function Navbar({ scrollProgress, activeEra }: NavbarProps) {
  const isWwwEra = activeEra === WWW_ERA_INDEX;
  const [packetNum, setPacketNum] = useState(1);
  const [timelineEndUtc, setTimelineEndUtc] = useState(() => new Date());
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketNum((p) => p + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sync = () => {
      void fetchUtcNow().then((d) => {
        if (!cancelled) setTimelineEndUtc(d);
      });
    };
    sync();
    const id = setInterval(sync, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

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

  const t = Math.max(0, Math.min(1, scrollProgress));
  const startMs = TIMELINE_START_UTC;
  const endMs = timelineEndUtc.getTime();
  const packetMs = startMs + (endMs - startMs) * t;
  const dateStr = formatPacketUtc(new Date(packetMs));

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-12 z-[100] flex items-center justify-between px-6"
      style={{
        background: "hsla(220, 18%, 7%, 0.82)",
        backdropFilter: "blur(12px)",
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
        className={cn(
          "font-mono-era hidden sm:block tabular-nums tracking-tight",
          isWwwEra
            ? "text-[12px] font-medium text-[hsl(220_12%_92%)] [text-shadow:0_1px_2px_hsla(0,0%,0%,0.85)]"
            : "text-[11px] font-normal text-navbar-dim"
        )}
      >
        PKT #{String(packetNum).padStart(9, "0")} · {dateStr}
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
}
