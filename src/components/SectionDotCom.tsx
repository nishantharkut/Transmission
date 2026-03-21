import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEAD_COMPANIES = "PETS.COM · WEBVAN · BOING · ETOYS · KOZMO · FLOOZ · DEJA.COM · CDNOW · LIVING.COM · ";
const WEB2_FACTS = [
  { year: "2004", text: "Facebook launched to Harvard students" },
  { year: "2005", text: "YouTube founded in a garage" },
  { year: "2006", text: "Twitter launched with 140 characters" },
];

// SVG line chart data points: NASDAQ-like rise and crash
const CHART_POINTS = [
  [0, 80], [10, 75], [20, 65], [30, 50], [40, 40], [50, 30], [55, 22],
  [60, 15], [65, 10], [70, 5], [72, 3], [75, 2],
  // crash
  [78, 8], [80, 25], [82, 45], [85, 55], [90, 60], [95, 65], [100, 70],
];

export default function SectionDotCom() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sliderVal, setSliderVal] = useState(0);

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

  // Map slider (0-100) to chart clip and value
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

  // Build SVG path from points up to slider position
  const visiblePoints = CHART_POINTS.filter((p) => p[0] <= sliderVal);
  const pathD = visiblePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0] * 3} ${p[1] * 1.5}`).join(" ");

  return (
    <section
      ref={sectionRef}
      data-era="web2"
      className="relative py-[120px] px-6 overflow-hidden"
      style={{ backgroundColor: "hsl(215 40% 10%)" }}
    >
      {/* Marquee */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ opacity: 0.15 }}>
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="font-display-era font-medium text-[18px] text-era-dim" style={{ color: "hsl(200 10% 55%)" }}>
            {(DEAD_COMPANIES + DEAD_COMPANIES + DEAD_COMPANIES).split("").join("")}
          </span>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto relative z-10">
        {/* Pull quote */}
        <h2
          className="dotcom-quote font-serif-era font-bold italic text-[28px] md:text-[48px] leading-[1.15] text-center mb-16"
          style={{ color: "hsl(200 20% 90%)" }}
        >
          $1.7 trillion in market value disappeared in 18 months. Then social media arrived, and everyone forgot.
        </h2>

        {/* Bubble Meter */}
        <div className="mb-16">
          <div className="flex justify-between font-mono-era text-[11px] mb-2" style={{ color: "hsl(200 10% 55%)" }}>
            <span>NASDAQ 1999</span>
            <span>MARCH 2000 CRASH</span>
          </div>

          {/* SVG Chart */}
          <svg viewBox="0 0 300 120" className="w-full h-[120px] mb-4" aria-label="NASDAQ bubble chart">
            <path d={pathD} fill="none" stroke="hsl(200 90% 55%)" strokeWidth="2" />
            {visiblePoints.length > 0 && (
              <circle
                cx={visiblePoints[visiblePoints.length - 1][0] * 3}
                cy={visiblePoints[visiblePoints.length - 1][1] * 1.5}
                r="4"
                fill="hsl(200 90% 55%)"
              />
            )}
          </svg>

          {/* Slider */}
          <input
            type="range"
            min={0}
            max={100}
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full h-1 appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(200 90% 55%) ${sliderVal}%, hsl(200 10% 25%) ${sliderVal}%)`,
              borderRadius: 0,
              accentColor: "hsl(200 90% 55%)",
            }}
            aria-label="Navigate through the dot-com bubble timeline"
          />

          {/* NASDAQ Counter */}
          <div className="text-center mt-4">
            <span className="font-mono-era font-bold text-[36px]" style={{ color: "hsl(200 90% 55%)" }}>
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
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 0;
          background: hsl(200 90% 55%);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
