import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LINES = [
  "MS-DOS ARPANET Link [v4.10.92]",
  "Copyright (C) 1969 UCLA / SRI. All rights reserved.",
  "",
  "C:\\TRANSMISSION> ARPANET.EXE /INIT",
  "",
  "ARPANET TERMINAL v1.0",
  "INITIALIZING PACKET SWITCH NETWORK...",
  "NODE: UCLA → SRI",
  "TRANSMITTING: \"LO\"",
  "",
  "[CONNECTION LOST]",
  "",
  "RETRANSMITTING...",
  "SIGNAL RESTORED.",
  "",
  "LOADING 57 YEARS OF HISTORY",
];

const PROGRESS_CHARS = 16;

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [phase, setPhase] = useState<"typing" | "progress" | "waiting">("typing");

  useEffect(() => {
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < LINES.length) {
        const next = LINES[lineIdx];
        if (next !== undefined) {
          setLines((prev) => [...prev, next]);
        }
        lineIdx++;
      } else {
        clearInterval(interval);
        setPhase("progress");
      }
    }, 260);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "progress") return;
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx <= PROGRESS_CHARS) {
        const filled = "█".repeat(charIdx);
        const empty = "░".repeat(PROGRESS_CHARS - charIdx);
        const pct = Math.round((charIdx / PROGRESS_CHARS) * 100);
        setProgress(`[${filled}${empty}] ${pct}%`);
        charIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowPrompt(true);
          setPhase("waiting");
        }, 400);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "waiting") return;
    const handler = () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
          requestAnimationFrame(() => {
            const main = document.getElementById("main-content");
            if (main) {
              main.setAttribute("tabindex", "-1");
              (main as HTMLElement).focus({ preventScroll: true });
            }
          });
        },
      });

      if (screenRef.current) {
        // Phosphor flare — CRTs briefly brighten on power-off
        tl.to(screenRef.current, { filter: "brightness(1.8)", duration: 0.07 });
        // Collapse to horizontal line
        tl.to(screenRef.current, { scaleY: 0.004, duration: 0.22, ease: "power3.in", filter: "brightness(1.4)" });
        // Line shrinks to dot
        tl.to(screenRef.current, { scaleX: 0, opacity: 0, duration: 0.18, ease: "power2.in" });
      }
      // Container fades
      tl.to(containerRef.current, { opacity: 0, duration: 0.2 });
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
    };
  }, [phase, onComplete]);

  return (
    <div
      ref={containerRef}
      className="preloader-crt-root fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-label="Loading - ARPANET terminal boot sequence"
      aria-live="polite"
    >
      <div className="preloader-crt-monitor flex min-w-0 flex-col">
        {/* Plastic CRT bezel + window chrome */}
        <div className="preloader-crt-bezel">
          <div className="preloader-crt-titlebar" role="presentation">
            <div className="preloader-crt-titlebar-dots" aria-hidden>
              <span style={{ background: "#c0c0c0" }} />
              <span style={{ background: "#808080" }} />
            </div>
            <span className="preloader-crt-titlebar-title">ARPANET.EXE — MS-DOS</span>
            <div className="preloader-crt-titlebar-dots" aria-hidden>
              <span className="h-[9px] w-[11px]" style={{ background: "#c0c0c0" }} />
            </div>
          </div>

          <div className="preloader-crt-screen" ref={screenRef} style={{ transformOrigin: "center center" }}>
            <div className="preloader-crt-scanlines" aria-hidden />
            <div className="preloader-crt-flicker" aria-hidden />
            <div className="preloader-crt-vignette" aria-hidden />

            <div className="preloader-crt-body">
              <div className="preloader-crt-log" role="log" aria-live="polite" aria-label="Boot sequence">
                {lines.map((line, i) => {
                  const text = line ?? "";
                  const isWarn = text.includes("[CONNECTION LOST]");
                  const isDim =
                    text.startsWith("Copyright") ||
                    text.startsWith("C:\\") ||
                    text === "MS-DOS ARPANET Link [v4.10.92]";
                  return (
                    <p
                      key={i}
                      className={`preloader-crt-line ${isWarn ? "preloader-crt-warn" : isDim ? "preloader-crt-dim" : ""}`}
                    >
                      {text || " "}
                    </p>
                  );
                })}
                {phase !== "typing" && (
                  <p className="preloader-crt-line preloader-crt-progress-row">{progress}</p>
                )}
                {showPrompt && (
                  <div className="preloader-crt-prompt">
                    <span className="preloader-crt-prompt-k">
                      PRESS ANY KEY OR TAP TO BEGIN TRANSMISSION
                      <span className="preloader-crt-block-cursor" aria-hidden />
                    </span>
                  </div>
                )}
              </div>

              <div className="preloader-crt-status">
                <span>SCR: 80×25 · F1 HELP</span>
                <span>INSERT: ON · CAPS: OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
