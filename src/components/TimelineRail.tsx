import { useEffect, useRef, useState, useImperativeHandle, forwardRef, memo } from "react";
import gsap from "gsap";

export interface TimelineRailHandle {
  updateScroll: (progress: number) => void;
}

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

function hsla(e: { h: number; s: number; l: number }, alpha: number) {
  return `hsla(${e.h}, ${e.s}%, ${e.l}%, ${alpha})`;
}

const ERAS = [
  { year: "1969", label: "ARPANET", era: "arpanet" },
  { year: "1991", label: "WWW", era: "web1" },
  { year: "2000", label: "DOT-COM", era: "web2" },
  { year: "2012", label: "MOBILE", era: "mobile" },
  { year: "2014", label: "WEB3", era: "web3" },
  { year: "", label: "NOW", era: "present" },
] as const;

/** Logged past — always dim phosphor */
const PAST_NODE_BG = "hsl(142 55% 22%)";
const PAST_NODE_BORDER = "hsl(142 55% 32%)";
const PAST_YEAR = "hsl(142 34% 40%)";
const PAST_ERA = "hsl(142 24% 30%)";

const FUTURE_NODE_BORDER = "hsl(220 6% 22%)";
const FUTURE_YEAR = "hsl(220 7% 34%)";
const FUTURE_ERA = "hsl(220 7% 26%)";

const TRACK_BASE = "hsl(220 6% 16%)";
const MOBILE_FILL = "hsl(142 70% 55%)";

interface TimelineRailProps {
  activeIndex: number;
  visible?: boolean;
}

const TimelineRail = memo(
  forwardRef<TimelineRailHandle, TimelineRailProps>(function TimelineRail(
    { activeIndex, visible = true },
    ref
  ) {
    const presentYear = String(new Date().getFullYear());
    const recvCursorRef = useRef<HTMLSpanElement>(null);
    const mobileLabelRef = useRef<HTMLParagraphElement>(null);
    const desktopFillRef = useRef<HTMLDivElement>(null);
    const mobileFillRef = useRef<HTMLDivElement>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const live = ERA_LIVE_HSL[activeIndex] ?? ERA_LIVE_HSL[0];
    const liveCss = hslStr(live);
    const liveGlow = `0 0 0 3px ${hsla(live, 0.12)}, 0 0 12px ${hsla(live, 0.24)}`;
    const livePanel = hsla(live, 0.06);

    const activeEra = ERAS[activeIndex] ?? ERAS[0];
    const activeYear = activeIndex === ERAS.length - 1 ? presentYear : activeEra.year;
    const mobileLabelText = `${activeYear} · ${activeEra.label}`;

    useImperativeHandle(
      ref,
      () => ({
        updateScroll: (progress: number) => {
          if (desktopFillRef.current) {
            desktopFillRef.current.style.height = `calc((100% - 1rem) * ${progress})`;
          }
          if (mobileFillRef.current) {
            mobileFillRef.current.style.width = `${progress * 100}%`;
          }
        },
      }),
      []
    );

    const scrollToEra = (eraKey: string) => {
      const sections = document.querySelectorAll(`[data-era='${eraKey}']`);
      const target = eraKey === "arpanet" && sections.length > 1 ? sections[1] : sections[0];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

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
      if (!el || !visible) return;
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }, [activeIndex, visible]);

    return (
      <>
      {/* Desktop — frequency scanner */}
      <nav
        className="pointer-events-auto fixed left-5 top-1/2 z-50 hidden w-[124px] -translate-y-1/2 flex-col md:flex"
        aria-label="Transmission frequency bands"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: visible ? "auto" : "none" }}
      >
        <div className="relative flex w-full flex-col py-2">
          {/* Track + scroll fill */}
          <div
            className="pointer-events-none absolute bottom-2 left-[10px] top-2 z-0 w-px"
            style={{ background: TRACK_BASE }}
          />
            <div
              ref={desktopFillRef}
            className="pointer-events-none absolute left-[10px] top-2 z-0 w-px overflow-hidden"
            style={{
                height: "0%",
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
                yearColor = "hsl(220 8% 62%)";
                eraColor = "hsl(220 8% 54%)";
              }

              return (
                <li
                  key={key}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      scrollToEra(era.era);
                    }
                  }}
                  className="relative flex cursor-pointer items-center rounded-[10px] py-[8px] outline-none focus-visible:ring-1 focus-visible:ring-[hsl(142_70%_55%)]"
                  style={{
                    paddingLeft: 20,
                    background: isActive ? livePanel : hovered ? "hsla(220, 10%, 100%, 0.02)" : "transparent",
                    boxShadow: isActive ? `inset 0 0 0 1px ${hsla(live, 0.08)}` : "none",
                    transition: "background 0.35s ease, box-shadow 0.35s ease",
                  }}
                  aria-current={isActive ? "true" : undefined}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => scrollToEra(era.era)}
                >
                  {isActive && (
                    <span
                      className="pointer-events-none absolute top-1/2 z-[2] w-[3px] rounded-r-[3px]"
                      style={{
                        left: -2,
                        height: 24,
                        transform: "translateY(-50%)",
                        background: liveCss,
                        transition: "height 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.8s ease",
                      }}
                    />
                  )}

                  <span
                    className="absolute left-[10px] top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: isActive ? 14 : 10,
                      height: isActive ? 14 : 10,
                      background: nodeBg,
                      border: `1px solid ${hovered && !isActive ? "hsl(220 8% 40%)" : nodeBorder}`,
                      boxShadow: nodeShadow,
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ background: "hsl(220 18% 7%)" }}
                      />
                    )}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-[2px] pl-[8px]">
                    <span
                      className="font-mono-era text-[9px] uppercase leading-none"
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
                      className="font-mono-era text-[10px] uppercase leading-none"
                      style={{
                        letterSpacing: "1.8px",
                        color: eraColor,
                        fontWeight: isActive ? 600 : eraWeight,
                        transition: "color 0.4s ease",
                      }}
                    >
                      {era.label}
                    </span>
                    {isActive && (
                      <span
                        className="font-mono-era mt-0.5 inline-flex w-fit items-center text-[8px] uppercase leading-none"
                        style={{
                          letterSpacing: "1px",
                          color: liveCss,
                        }}
                      >
                        [RECV]
                        <span ref={recvCursorRef}>_</span>
                      </span>
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
          className="pointer-events-none fixed left-0 right-0 z-[100] h-0.5 md:hidden"
        style={{
            bottom: "env(safe-area-inset-bottom, 0px)",
          background: TRACK_BASE,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <div
            ref={mobileFillRef}
          className="h-full origin-left"
          style={{
              width: "0%",
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
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {mobileLabelText}
      </p>
      </>
    );
  })
);

TimelineRail.displayName = "TimelineRail";
export default TimelineRail;
