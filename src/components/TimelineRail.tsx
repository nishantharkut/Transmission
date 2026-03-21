import { useEffect, useRef } from "react";

const ERAS = [
  { year: "1969", label: "ARPANET" },
  { year: "1991", label: "WWW" },
  { year: "2000", label: "DOT-COM" },
  { year: "2012", label: "MOBILE" },
  { year: "2026", label: "NOW" },
];

interface TimelineRailProps {
  activeIndex: number;
  scrollProgress: number;
}

export default function TimelineRail({ activeIndex, scrollProgress }: TimelineRailProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.style.height = `${scrollProgress * 100}%`;
    }
  }, [scrollProgress]);

  return (
    <>
      {/* Desktop rail */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-start gap-0">
        <div className="relative flex flex-col items-center">
          {/* Track line */}
          <div
            className="absolute left-[3.5px] top-[4px] w-[1px] bottom-[4px]"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              ref={lineRef}
              className="w-full bg-signal"
              style={{ backgroundColor: "hsl(142 70% 65%)", height: "0%" }}
            />
          </div>

          {ERAS.map((era, i) => (
            <div key={era.year} className="flex items-center gap-3 relative" style={{ marginBottom: i < ERAS.length - 1 ? 16 : 0 }}>
              <div
                className="rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  width: i <= activeIndex ? 8 : 4,
                  height: i <= activeIndex ? 8 : 4,
                  backgroundColor: i <= activeIndex ? "hsl(142 70% 65%)" : "hsl(220 5% 28%)",
                  marginLeft: i <= activeIndex ? 0 : 2,
                }}
              />
              <span
                className="font-mono-era text-[9px] whitespace-nowrap transition-colors duration-300"
                style={{
                  letterSpacing: "1px",
                  color: i <= activeIndex ? "hsl(142 70% 65%)" : "hsl(220 5% 28%)",
                }}
              >
                {era.year} · {era.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] z-50 md:hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full"
          style={{
            backgroundColor: "hsl(142 70% 65%)",
            width: `${scrollProgress * 100}%`,
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </>
  );
}
