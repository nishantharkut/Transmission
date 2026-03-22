import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/** Live “frequency” per era — node, bar, [RECV], track gradient, active labels */
const ERA_LIVE_HSL: { h: number; s: number; l: number }[] = [
  { h: 142, s: 70, l: 55 }, // ARPANET
  { h: 240, s: 80, l: 60 }, // WWW
  { h: 200, s: 75, l: 55 }, // DOT-COM
  { h: 211, s: 100, l: 55 }, // MOBILE
  { h: 252, s: 60, l: 65 }, // WEB3 periwinkle
  { h: 142, s: 70, l: 55 }, // NOW
];

function hslStr(e: { h: number; s: number; l: number }) {
  return `hsl(${e.h} ${e.s}% ${e.l}%)`;
}

function eraFillGradient(active: { h: number; s: number; l: number }) {
  const lo = Math.max(active.l - 18, 22);
  return `linear-gradient(to bottom, hsl(${active.h} ${active.s}% ${lo}%), hsl(${active.h} ${active.s}% ${active.l}%))`;
}

const ERAS = [
  { year: "1969", label: "ARPANET" },
  { year: "1991", label: "WWW" },
  { year: "2000", label: "DOT-COM" },
  { year: "2012", label: "MOBILE" },
  { year: "2014", label: "WEB3" },
  { year: "", label: "NOW" },
] as const;

/** Logged past — always dim phosphor */
const PAST_NODE_BG = "hsl(142 55% 22%)";
const PAST_NODE_BORDER = "hsl(142 55% 32%)";
const PAST_YEAR = "hsl(142 35% 35%)";
const PAST_ERA = "hsl(142 30% 28%)";

const FUTURE_NODE_BORDER = "hsl(220 6% 22%)";
const FUTURE_YEAR = "hsl(220 6% 24%)";
const FUTURE_ERA = "hsl(220 6% 20%)";

const TRACK_BASE = "hsl(220 6% 16%)";
const MOBILE_FILL = "hsl(142 70% 55%)";

interface TimelineRailProps {
  activeIndex: number;
  scrollProgress: number;
}

export default function TimelineRail({ activeIndex, scrollProgress }: TimelineRailProps) {
  const presentYear = String(new Date().getFullYear());
  const recvCursorRef = useRef<HTMLSpanElement>(null);
  const mobileLabelRef = useRef<HTMLParagraphElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const live = ERA_LIVE_HSL[activeIndex] ?? ERA_LIVE_HSL[0];
  const liveCss = hslStr(live);
  const liveGlow = `0 0 0 3px hsla(${live.h}, ${live.s}%, ${live.l}%, 0.15), 0 0 12px hsla(${live.h}, ${live.s}%, ${live.l}%, 0.25)`;

  const activeEra = ERAS[activeIndex] ?? ERAS[0];
  const activeYear = activeIndex === ERAS.length - 1 ? presentYear : activeEra.year;
  const mobileLabelText = `${activeYear} · ${activeEra.label}`;

  useEffect(() => {
    const el = recvCursorRef.current;
    if (!el) return;
    const tween = gsap.to(el, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
      ease: "power1.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [activeIndex]);

  useEffect(() => {
    const el = mobileLabelRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  }, [activeIndex]);

  return (
    <>
      {/* Desktop — frequency scanner */}
      <nav
        className="pointer-events-auto fixed left-6 top-1/2 z-50 hidden w-[160px] -translate-y-1/2 flex-col gap-0 md:flex"
        aria-label="Transmission frequency bands"
      >
        <div className="relative flex w-full flex-col">
          {/* Track + scroll fill */}
          <div
            className="pointer-events-none absolute bottom-0 left-[5px] top-0 z-0 w-px"
            style={{ background: TRACK_BASE }}
          />
          <div
            className="pointer-events-none absolute left-[5px] top-0 z-0 w-px overflow-hidden"
            style={{
              height: `${scrollProgress * 100}%`,
              background: eraFillGradient(live),
              transition: "height 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.8s ease",
            }}
          />

          <ul className="relative z-[1] m-0 list-none p-0">
            {ERAS.map((era, i) => {
              const isActive = i === activeIndex;
              const isPassed = i < activeIndex;
              const isFuture = i > activeIndex;
              const year = i === ERAS.length - 1 ? presentYear : era.year;
              const key = `${year}-${era.label}-${i}`;

              let nodeBg: string;
              let nodeBorder: string;
              let nodeShadow: string | undefined;
              if (isFuture) {
                nodeBg = "transparent";
                nodeBorder = FUTURE_NODE_BORDER;
                nodeShadow = undefined;
              } else if (isPassed) {
                nodeBg = PAST_NODE_BG;
                nodeBorder = PAST_NODE_BORDER;
                nodeShadow = undefined;
              } else {
                nodeBg = liveCss;
                nodeBorder = `hsl(${live.h} ${live.s}% ${Math.min(live.l + 8, 72)}%)`;
                nodeShadow = liveGlow;
              }

              let yearColor: string;
              let eraColor: string;
              let yearWeight: number;
              let eraWeight: number;
              if (isActive) {
                yearColor = `hsl(${live.h} ${live.s}% ${Math.min(live.l + 10, 72)}%)`;
                eraColor = `hsl(${live.h} ${Math.max(live.s - 15, 35)}% ${Math.max(live.l - 12, 38)}%)`;
                yearWeight = 600;
                eraWeight = 400;
              } else if (isPassed) {
                yearColor = PAST_YEAR;
                eraColor = PAST_ERA;
                yearWeight = 400;
                eraWeight = 400;
              } else {
                yearColor = FUTURE_YEAR;
                eraColor = FUTURE_ERA;
                yearWeight = 400;
                eraWeight = 400;
              }

              const hovered = hoverIndex === i && !isActive;
              if (hovered) {
                yearColor = "hsl(220 8% 55%)";
                eraColor = "hsl(220 8% 48%)";
              }

              return (
                <li
                  key={key}
                  className="relative flex items-center gap-3 py-[10px] pl-5"
                  style={{ paddingLeft: 20 }}
                  aria-current={isActive ? "true" : undefined}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {isActive && (
                    <span
                      className="pointer-events-none absolute top-1/2 z-[2] w-[3px] rounded-r-[2px]"
                      style={{
                        left: -24,
                        height: 28,
                        transform: "translateY(-50%)",
                        background: liveCss,
                        transition: "height 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.8s ease",
                      }}
                    />
                  )}

                  <span
                    className="absolute left-[5px] top-1/2 z-[1] size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: nodeBg,
                      border: `1px solid ${hovered && !isActive ? "hsl(220 8% 40%)" : nodeBorder}`,
                      boxShadow: nodeShadow,
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-px pl-[7px]">
                    <span
                      className="font-mono-era text-[9px] uppercase leading-tight"
                      style={{
                        letterSpacing: "2px",
                        color: yearColor,
                        fontWeight: yearWeight,
                        transition: "color 0.4s ease",
                      }}
                    >
                      {year}
                    </span>
                    <span
                      className="font-mono-era text-[9px] uppercase leading-tight"
                      style={{
                        letterSpacing: "1.5px",
                        color: eraColor,
                        fontWeight: eraWeight,
                        transition: "color 0.4s ease",
                      }}
                    >
                      {era.label}
                    </span>
                    {isActive && (
                      <div
                        className="font-mono-era mt-0.5 text-[8px] leading-tight"
                        style={{
                          letterSpacing: "1px",
                          color: liveCss,
                        }}
                      >
                        [RECV]
                        <span ref={recvCursorRef}>_</span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile — thin scrub bar + era label bottom-right */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-[100] h-0.5 md:hidden"
        style={{
          background: TRACK_BASE,
        }}
      >
        <div
          className="h-full origin-left"
          style={{
            width: `${scrollProgress * 100}%`,
            background: MOBILE_FILL,
            transition: "width 0.1s linear",
          }}
        />
      </div>
      <p
        ref={mobileLabelRef}
        className="font-mono-era fixed right-4 z-[100] text-[9px] md:hidden"
        style={{
          color: "hsl(var(--text-ghost))",
          bottom: "max(8px, env(safe-area-inset-bottom, 0px))",
        }}
      >
        {mobileLabelText}
      </p>
    </>
  );
}
