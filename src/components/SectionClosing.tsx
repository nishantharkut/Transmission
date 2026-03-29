import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrambleText } from "@/lib/scrambleText";

gsap.registerPlugin(ScrollTrigger);

const RECEIPT_LINES = [
  { label: "ERAS TRAVERSED", value: "6" },
  { label: "YEARS COVERED", value: "57" },
  { label: "FIRST MESSAGE", value: "LO" },
  { label: "FINAL NODE", value: "5,400,000,001" },
  { label: "SIGNAL STATUS", value: "\u2588\u2588\u2588\u2588 ACTIVE" },
];

function ReceiptValue({ value, visible }: { value: string; visible: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const scrambled = useRef(false);

  useEffect(() => {
    if (!visible || scrambled.current || !ref.current) return;
    scrambled.current = true;
    const s = scrambleText(ref.current, value, { duration: 400 });
    return () => s.cancel();
  }, [visible, value]);

  return (
    <span ref={ref} className="text-right" style={{ color: "hsl(26 38% 14%)" }}>
      {value}
    </span>
  );
}

function EndTransmission() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const s = scrambleText(ref.current, "END TRANSMISSION", { duration: 600 });
    return () => s.cancel();
  }, []);

  return (
    <div className="font-mono-era text-[11px] sm:text-[12px] mt-4" style={{ color: "hsl(26 38% 14%)" }}>
      <span ref={ref}></span><span className="preloader-crt-block-cursor" aria-hidden />
    </div>
  );
}

export default function SectionClosing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const triggered = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.from(".closing-heading > *", {
        opacity: 0,
        y: reduced ? 0 : 15,
        stagger: reduced ? 0 : 0.2,
        duration: reduced ? 0.01 : 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });

      ScrollTrigger.create({
        trigger: ".closing-receipt",
        start: "top 78%",
        once: true,
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;

          if (reduced) {
            setVisibleLines(RECEIPT_LINES.length);
            setShowQuote(true);
            setShowEnd(true);
            return;
          }

          let i = 0;
          intervalRef.current = setInterval(() => {
            i += 1;
            setVisibleLines(i);
            if (i >= RECEIPT_LINES.length) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
              setTimeout(() => setShowQuote(true), 300);
              setTimeout(() => setShowEnd(true), 1800);
            }
          }, 180);
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 py-16 sm:px-6 sm:py-24"
      style={{ backgroundColor: "hsl(220 14% 11%)" }}
    >
      <div className="closing-heading max-w-[600px] mx-auto text-center">
        <div
          className="font-display-era font-extrabold text-[11px] uppercase"
          style={{ fontStretch: "150%", letterSpacing: "4px", color: "hsl(220 5% 28%)" }}
        >
          TRANSMISSION COMPLETE
        </div>

        <h2
          className="font-serif-era font-bold text-[26px] sm:text-[28px] md:text-[44px] mt-4 leading-[1.1]"
          style={{ color: "hsl(220 8% 92%)" }}
        >
          The internet was built to survive anything.
        </h2>

        <p
          className="font-serif-era italic font-light text-[26px] sm:text-[28px] md:text-[44px] leading-[1.1] mt-2"
          style={{ color: "hsl(220 5% 52%)" }}
        >
          What it became was never in the plan.
        </p>
      </div>

      <div
        className="closing-receipt relative mx-auto mt-10 sm:mt-14 max-w-[430px] sm:max-w-[460px] p-5 sm:p-7"
        style={{
          backgroundColor: "hsl(44 34% 95%)",
          border: "2px solid hsl(34 20% 72%)",
          borderRadius: 10,
          boxShadow: "0 10px 24px hsla(220, 35%, 4%, 0.28)",
          backgroundImage:
            "radial-gradient(hsla(30,20%,30%,0.06) 0.8px, transparent 0.8px), linear-gradient(180deg, hsla(46,35%,98%,0.7), hsla(42,22%,92%,0.65))",
          backgroundSize: "5px 5px, auto",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[11px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: "hsl(220 14% 11%)", border: "2px solid hsl(34 20% 72%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[11px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: "hsl(220 14% 11%)", border: "2px solid hsl(34 20% 72%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-2 left-3 right-3 flex items-center justify-between"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={`top-cut-${i}`}
              className="h-[4px] w-[4px] rounded-full"
              style={{ backgroundColor: "hsl(220 14% 11%)" }}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-2 left-3 right-3 flex items-center justify-between"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={`bottom-cut-${i}`}
              className="h-[4px] w-[4px] rounded-full"
              style={{ backgroundColor: "hsl(220 14% 11%)" }}
            />
          ))}
        </div>

        <div
          className="font-mono-era text-[11px] sm:text-[12px] font-semibold tracking-[2px] mb-1"
          style={{ color: "hsl(26 30% 18%)" }}
        >
          TRANSMISSION RECEIPT
        </div>
        <div
          className="font-mono-era text-[10px] sm:text-[12px] mb-4 overflow-hidden"
          style={{ color: "hsl(28 24% 36%)" }}
        >
          {"═".repeat(30)}
        </div>

        {RECEIPT_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="flex justify-between font-mono-era text-[10px] sm:text-[12px] py-0.5"
          >
            <span style={{ color: "hsl(28 22% 30%)" }}>{line.label}</span>
            <ReceiptValue value={line.value} visible={i < visibleLines} />
          </div>
        ))}

        {showQuote && (
          <>
            <div
              className="font-mono-era text-[10px] sm:text-[12px] mt-4 mb-3 overflow-hidden"
              style={{ color: "hsl(28 24% 36%)" }}
            >
              {"-".repeat(32)}
            </div>
            <p
              className="font-serif-era text-[13px] sm:text-[15px] italic leading-[1.45]"
              style={{ color: "hsl(28 28% 22%)" }}
            >
              &ldquo;The internet was built to survive anything. What it became was never in the plan.&rdquo;
            </p>
          </>
        )}

        {showEnd && <EndTransmission />}
      </div>

      <div className="text-center mt-8 sm:mt-10">
        <div className="font-ui-era text-[13px] font-normal text-era-ghost">
          A history by Nishant Harkut
        </div>
      </div>

      <footer
        className="max-w-[1080px] mx-auto mt-16 sm:mt-24 pt-10 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          className="font-display-era font-bold text-[12px]"
          style={{ fontStretch: "125%", letterSpacing: "0.1em", color: "hsl(220 5% 28%)" }}
        >
          TRANSMISSION
        </span>
        <span className="font-mono-era text-[11px]" style={{ color: "hsl(220 5% 28%)" }}>
          1969 - 2026
        </span>
        <span className="font-ui-era text-[11px]" style={{ color: "hsl(220 5% 28%)" }}>
          Frontend Odyssey 2026
        </span>
      </footer>
    </section>
  );
}
