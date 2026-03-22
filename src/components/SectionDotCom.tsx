import { type ChangeEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Market tape rows — green ▲ / red ▼ like real tickers (mixed dead-cat bounces vs collapse) */
const TICKER_QUOTES: { symbol: string; last: string; pct: string; dir: "up" | "down" }[] = [
  { symbol: "PETS", last: "0.02", pct: "14.20", dir: "up" },
  { symbol: "WEBVAN", last: "0.00", pct: "100.00", dir: "down" },
  { symbol: "BOING", last: "0.01", pct: "3.80", dir: "up" },
  { symbol: "ETOYS", last: "0.03", pct: "98.70", dir: "down" },
  { symbol: "KOZMO", last: "0.00", pct: "100.00", dir: "down" },
  { symbol: "FLOOZ", last: "0.01", pct: "7.15", dir: "up" },
  { symbol: "DEJA", last: "0.04", pct: "97.10", dir: "down" },
  { symbol: "CDNOW", last: "0.02", pct: "1.25", dir: "up" },
  { symbol: "LIVING", last: "0.01", pct: "99.90", dir: "down" },
  { symbol: "NSDQ", last: "$4.89", pct: "2.04", dir: "up" },
  { symbol: "DOW", last: "11.2K", pct: "0.88", dir: "down" },
];
const WEB2_FACTS = [
  { year: "2004", text: "Facebook launched to Harvard students" },
  { year: "2005", text: "YouTube founded in a garage" },
  { year: "2006", text: "Twitter launched with 140 characters" },
];

const CHART_POINTS = [
  [0, 80], [10, 75], [20, 65], [30, 50], [40, 40], [50, 30], [55, 22],
  [60, 15], [65, 10], [70, 5], [72, 3], [75, 2],
  [78, 8], [80, 25], [82, 45], [85, 55], [90, 60], [95, 65], [100, 70],
];

/** Piecewise-linear path up to `sliderVal` (interpolates y between chart knots so the line doesn’t jump). */
function chartPathToSlider(sliderVal: number): {
  pathD: string;
  endSvg: { cx: number; cy: number };
} {
  const pts: [number, number][] = [];
  const v = Number.isFinite(sliderVal) ? sliderVal : 0;
  const clamped = Math.max(0, Math.min(100, v));

  for (let i = 0; i < CHART_POINTS.length; i++) {
    const p = CHART_POINTS[i];
    if (p[0] < clamped) {
      pts.push([p[0], p[1]]);
    } else if (p[0] === clamped) {
      pts.push([p[0], p[1]]);
      break;
    } else {
      const prev = CHART_POINTS[i - 1];
      const t = (clamped - prev[0]) / (p[0] - prev[0]);
      const y = prev[1] + t * (p[1] - prev[1]);
      pts.push([clamped, y]);
      break;
    }
  }

  if (pts.length === 0) {
    const p0 = CHART_POINTS[0];
    pts.push([clamped, p0[1]]);
  }

  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0] * 3} ${p[1] * 1.5}`)
    .join(" ");
  const end = pts[pts.length - 1];
  return {
    pathD,
    endSvg: { cx: end[0] * 3, cy: end[1] * 1.5 },
  };
}

export default function SectionDotCom() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sliderVal, setSliderVal] = useState(0);
  const [showSliderHint, setShowSliderHint] = useState(true);

  const dismissSliderHint = () => setShowSliderHint(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dotcom-quote", {
        opacity: 0, y: 20, duration: 0.7,
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
      });
      gsap.from(".dotcom-facts > div", {
        opacity: 0, y: 15, stagger: 0.15, duration: 0.5,
        scrollTrigger: { trigger: ".dotcom-facts", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const nasdaqMin = 1000;
  const nasdaqPeak = 5048;
  const nasdaqCrash = 1114;
  const progress = sliderVal / 100;
  let nasdaqValue: number;
  if (progress < 0.75) {
    nasdaqValue = nasdaqMin + (nasdaqPeak - nasdaqMin) * (progress / 0.75);
  } else {
    const crashProgress = (progress - 0.75) / 0.25;
    nasdaqValue = nasdaqPeak - (nasdaqPeak - nasdaqCrash) * crashProgress;
  }

  const { pathD, endSvg } = chartPathToSlider(sliderVal);

  const handleSliderInput = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (Number.isNaN(v)) return;
    setSliderVal(v);
    if (showSliderHint) dismissSliderHint();
  };

  return (
    <section
      ref={sectionRef}
      data-era="web2"
      className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-[120px]"
      style={{ backgroundColor: "hsl(215 40% 10%)" }}
    >
      {/* Ticker tape — same palette + typography as web2 section (no broadcast red / harsh black) */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] border-b overflow-hidden dotcom-ticker-bar"
        style={{
          borderColor: "hsla(200, 90%, 55%, 0.1)",
          background:
            "linear-gradient(180deg, hsl(215 38% 9%) 0%, hsl(215 42% 7.5%) 100%)",
          boxShadow: "inset 0 1px 0 hsla(200, 25%, 100%, 0.04)",
        }}
        aria-hidden="true"
      >
        <div className="flex h-9 items-stretch sm:h-10">
          <div
            className="flex shrink-0 flex-col justify-center border-r px-2.5 py-1 sm:px-3"
            style={{ borderColor: "hsla(200, 90%, 55%, 0.15)" }}
          >
            <span
              className="font-mono-era text-[8px] font-medium uppercase tracking-[0.2em] sm:text-[9px]"
              style={{ color: "hsl(200 10% 48%)" }}
            >
              Tape
            </span>
            <span
              className="mt-0.5 block h-px w-6 sm:w-7"
              style={{ background: "hsl(200 90% 55%)", opacity: 0.45 }}
            />
          </div>
          <div className="dotcom-ticker-fade relative min-h-0 min-w-0 flex-1">
            <div className="dotcom-ticker-track dotcom-ticker-anim flex h-full w-max items-center will-change-transform">
              {[0, 1, 2].map((loop) => (
                <div key={loop} className="flex items-center pr-6 sm:pr-10">
                  {TICKER_QUOTES.map((q) => {
                    const up = q.dir === "up";
                    const changeColor = up ? "hsl(145 58% 48%)" : "hsl(350 62% 58%)";
                    return (
                    <span
                      key={`${loop}-${q.symbol}`}
                      className="inline-flex items-baseline gap-1.5 border-r px-2.5 py-1 font-mono-era tabular-nums sm:gap-2 sm:px-3.5"
                      style={{ borderColor: "hsla(200, 15%, 100%, 0.06)" }}
                    >
                      <span
                        className="text-[10px] font-medium tracking-wide sm:text-[11px]"
                        style={{ color: "hsl(200 18% 90%)" }}
                      >
                        {q.symbol}
                      </span>
                      <span className="text-[9px] sm:text-[10px]" style={{ color: "hsl(200 10% 52%)" }}>
                        {q.last.startsWith("$") || /K$/i.test(q.last) ? q.last : `$${q.last}`}
                      </span>
                      <span
                        className="inline-flex items-center gap-0.5 text-[9px] font-medium sm:text-[10px]"
                        style={{ color: changeColor }}
                      >
                        <span aria-hidden="true">{up ? "▲" : "▼"}</span>
                        {up ? "+" : ""}
                        {q.pct}%
                      </span>
                    </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[720px] pt-11 sm:pt-14">
        {/* Pull quote */}
        <h2
          className="dotcom-quote mb-10 text-center font-serif-era text-[22px] font-bold italic leading-[1.15] sm:mb-16 sm:text-[26px] md:text-[48px]"
          style={{ color: "hsl(200 20% 90%)" }}
        >
          $1.7 trillion in market value disappeared in 18 months. Then social media arrived, and everyone forgot.
        </h2>

        {/* Bubble Meter */}
        <div className="relative mb-10 sm:mb-16">
          {showSliderHint && (
            <div
              id="dotcom-slider-hint"
              className="dotcom-slider-hint-banner mb-3 flex flex-col gap-2 rounded-sm border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              style={{
                borderColor: "hsla(200, 90%, 55%, 0.35)",
                backgroundColor: "hsla(215, 35%, 14%, 0.95)",
                boxShadow: "0 0 0 1px hsla(200, 90%, 55%, 0.12)",
              }}
              role="status"
            >
              <p
                className="font-mono-era text-[11px] leading-snug sm:text-[12px]"
                style={{ color: "hsl(200 25% 88%)" }}
              >
                <span className="font-semibold" style={{ color: "hsl(200 90% 62%)" }}>
                  Try it:
                </span>{" "}
                Drag or slide the control below to replay the NASDAQ run-up and crash.
              </p>
              <button
                type="button"
                onClick={dismissSliderHint}
                className="shrink-0 self-end font-mono-era text-[10px] uppercase tracking-wider sm:self-center"
                style={{ color: "hsl(200 12% 55%)" }}
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="mb-2 flex justify-between font-mono-era text-[11px]" style={{ color: "hsl(200 10% 55%)" }}>
            <span>NASDAQ 1999</span>
            <span>MARCH 2000 CRASH</span>
          </div>

          {/* SVG Chart */}
          <svg viewBox="0 0 300 120" className="mb-4 h-[100px] w-full sm:h-[120px]" aria-label="NASDAQ bubble chart">
            <path d={pathD} fill="none" stroke="hsl(200 90% 55%)" strokeWidth="2" />
            <circle cx={endSvg.cx} cy={endSvg.cy} r="4" fill="hsl(200 90% 55%)" />
          </svg>

          {/* Slider — Lenis smooth-scroll steals touchmove unless we opt this subtree out */}
          <div
            data-lenis-prevent
            className="touch-pan-x"
          >
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={sliderVal}
              onChange={handleSliderInput}
              onInput={handleSliderInput}
              className="dotcom-range-input h-1 w-full cursor-pointer appearance-none"
              style={{
                background: `linear-gradient(to right, hsl(200 90% 55%) ${sliderVal}%, hsl(200 10% 25%) ${sliderVal}%)`,
                borderRadius: 0,
                accentColor: "hsl(200 90% 55%)",
              }}
              aria-label="Navigate through the dot-com bubble timeline"
              aria-describedby={showSliderHint ? "dotcom-slider-hint" : undefined}
            />
          </div>

          {/* NASDAQ Counter */}
          <div className="text-center mt-4">
            <span className="font-mono-era text-[28px] font-bold tabular-nums sm:text-[32px] md:text-[36px]" style={{ color: "hsl(200 90% 55%)" }}>
              {Math.round(nasdaqValue).toLocaleString()}
            </span>
            <div className="font-ui-era text-[12px] mt-1" style={{ color: "hsl(200 10% 55%)" }}>
              NASDAQ Composite
            </div>
          </div>
        </div>

        {/* Web 2.0 facts */}
        <div className="dotcom-facts grid grid-cols-1 md:grid-cols-3 gap-6">
          {WEB2_FACTS.map((fact) => (
            <div
              key={fact.year}
              className="pl-4 font-ui-era text-[14px]"
              style={{ borderLeft: "2px solid hsl(200 90% 55%)", color: "hsl(200 10% 55%)" }}
            >
              <span style={{ color: "hsl(200 20% 90%)" }}>{fact.year}:</span> {fact.text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dotcom-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333333333%, 0, 0); }
        }
        .dotcom-ticker-fade {
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            #000 12px,
            #000 calc(100% - 12px),
            transparent
          );
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 12px,
            #000 calc(100% - 12px),
            transparent
          );
        }
        @media (min-width: 640px) {
          .dotcom-ticker-fade {
            -webkit-mask-image: linear-gradient(
              90deg,
              transparent,
              #000 20px,
              #000 calc(100% - 20px),
              transparent
            );
            mask-image: linear-gradient(
              90deg,
              transparent,
              #000 20px,
              #000 calc(100% - 20px),
              transparent
            );
          }
        }
        .dotcom-ticker-track.dotcom-ticker-anim {
          animation: dotcom-marquee 55s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dotcom-ticker-track.dotcom-ticker-anim {
            animation: none;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes dotcom-hint-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 hsla(200, 90%, 55%, 0.25); }
          50% { opacity: 1; box-shadow: 0 0 20px 1px hsla(200, 90%, 55%, 0.12); }
        }
        .dotcom-slider-hint-banner {
          animation: dotcom-hint-pulse 2.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dotcom-slider-hint-banner {
            animation: none;
          }
        }
        .dotcom-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 0;
          background: hsl(200 90% 55%);
          cursor: pointer;
        }
        .dotcom-range-input::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 0;
          border: none;
          background: hsl(200 90% 55%);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
