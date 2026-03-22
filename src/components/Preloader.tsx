import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LINES = [
  "ARPANET TERMINAL v1.0",
  "INITIALIZING PACKET SWITCH NETWORK...",
  "NODE: UCLA → SRI",
  'TRANSMITTING: "LO"',
  "",
  "[CONNECTION LOST]",
  "",
  "RETRANSMITTING...",
  "SIGNAL RESTORED.",
  "",
  "LOADING 57 YEARS OF HISTORY",
];

const PROGRESS_CHARS = 18;

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [phase, setPhase] = useState<"typing" | "progress" | "waiting">("typing");

  useEffect(() => {
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < LINES.length) {
        setLines((prev) => [...prev, LINES[lineIdx]]);
        lineIdx++;
      } else {
        clearInterval(interval);
        setPhase("progress");
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "progress") return;
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx <= PROGRESS_CHARS) {
        setProgress("█".repeat(charIdx) + "░".repeat(PROGRESS_CHARS - charIdx) + ` ${Math.round((charIdx / PROGRESS_CHARS) * 100)}%`);
        charIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowPrompt(true);
          setPhase("waiting");
        }, 400);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "waiting") return;
    const handler = () => {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete,
      });
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
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: "hsl(220 18% 7%)" }}
    >
      <div className="font-mono-era max-w-[min(100vw-2rem,480px)] px-4 text-[11px] leading-[1.85] text-signal sm:px-6 sm:text-[13px] sm:leading-[2]">
        {lines.map((line, i) => (
          <div key={i}>{line || "\u00A0"}</div>
        ))}
        {phase !== "typing" && <div>{progress}</div>}
        {showPrompt && (
          <div className="mt-4">
            PRESS ANY KEY TO BEGIN TRANSMISSION
            <span className="preloader-cursor">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
