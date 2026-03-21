import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SectionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger in the transmission log lines
      gsap.from(".hero-log-line", {
        opacity: 0,
        duration: 0.3,
        stagger: 0.12,
        delay: 0.3,
      });

      // Typewriter effect for the quote
      if (quoteRef.current) {
        const text = quoteRef.current.textContent || "";
        quoteRef.current.textContent = "";
        quoteRef.current.style.opacity = "1";
        const chars = text.split("");
        chars.forEach((char, i) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.opacity = "0";
          quoteRef.current!.appendChild(span);
          gsap.to(span, { opacity: 1, duration: 0.02, delay: 1.5 + i * 0.03 });
        });
      }

      // Fade in sub-quote
      if (subRef.current) {
        gsap.from(subRef.current, { opacity: 0, delay: 3.2, duration: 0.8 });
      }

      // Scroll indicator
      gsap.from(".hero-scroll-indicator", { opacity: 0, delay: 3.8, duration: 0.6 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-era="arpanet"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "hsl(120 100% 3%)" }}
    >
      {/* ASCII network background */}
      <pre
        className="absolute inset-0 font-mono-era text-[10px] leading-[1.8] pointer-events-none select-none overflow-hidden"
        style={{ color: "hsl(142 80% 72%)", opacity: 0.06 }}
        aria-hidden="true"
      >
{`
          UCLA ———————————+ ——————————— SRI
           |               |               |
           |               +               |
           |                               |
          UCSB ——————————— + ——————————— UTAH
           |               |               |
           +———————————————+———————————————+
`}
      </pre>

      {/* Transmission log */}
      <div className="font-mono-era text-[13px] leading-[2] text-center max-w-[480px] relative z-10" style={{ color: "hsl(142 80% 72%)" }}>
        <div className="hero-log-line">TRANSMISSION LOG</div>
        <div className="hero-log-line" style={{ color: "hsl(142 40% 40%)" }}>──────────────────────────────────</div>
        <div className="hero-log-line"><span style={{ color: "hsl(142 40% 40%)" }}>DATE:    </span>OCTOBER 29, 1969</div>
        <div className="hero-log-line"><span style={{ color: "hsl(142 40% 40%)" }}>NODE:    </span>UCLA SIGMA-7</div>
        <div className="hero-log-line"><span style={{ color: "hsl(142 40% 40%)" }}>DEST:    </span>SRI SDS-940</div>
        <div className="hero-log-line"><span className="text-signal">STATUS:  ████ SIGNAL ACTIVE</span></div>
        <div className="hero-log-line" style={{ color: "hsl(142 40% 40%)" }}>──────────────────────────────────</div>
      </div>

      {/* Pull quote */}
      <p
        ref={quoteRef}
        className="font-serif-era italic font-light text-[28px] md:text-[28px] max-w-[480px] text-center mt-12 leading-[1.4]"
        style={{ color: "hsl(142 80% 72%)", opacity: 0 }}
      >
        The first message was two letters long.
      </p>

      <p
        ref={subRef}
        className="font-serif-era text-[18px] max-w-[480px] text-center mt-4"
        style={{ color: "hsl(142 40% 40%)" }}
      >
        Everything you're reading right now started there.
      </p>

      {/* CTA */}
      <button
        className="mt-10 font-display-era font-bold text-[13px] h-11 px-7 border transition-colors duration-200 active:scale-[0.97]"
        style={{
          fontStretch: "100%",
          letterSpacing: "0.12em",
          borderColor: "hsl(142 70% 65%)",
          color: "hsl(142 70% 65%)",
          backgroundColor: "transparent",
          borderRadius: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "hsl(142 70% 65%)";
          e.currentTarget.style.color = "hsl(120 100% 3%)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "hsl(142 70% 65%)";
        }}
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }}
      >
        BEGIN TRANSMISSION
      </button>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator absolute bottom-8 flex flex-col items-center gap-2">
        <span
          className="font-mono-era text-[9px]"
          style={{ letterSpacing: "3px", color: "hsl(142 30% 20%)" }}
        >
          SCROLL TO ADVANCE TRANSMISSION
        </span>
        <span className="preloader-cursor text-signal text-xs">▼</span>
      </div>
    </section>
  );
}
