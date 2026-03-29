import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrambleText } from "@/lib/scrambleText";

gsap.registerPlugin(ScrollTrigger);

export default function SectionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const asciiRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-log-line", {
        opacity: 0,
        y: 6,
        duration: 0.35,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      });

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

      if (subRef.current) {
        gsap.from(subRef.current, { opacity: 0, delay: 3.2, duration: 0.8 });
      }

      gsap.from(".hero-scroll-indicator", { opacity: 0, delay: 3.8, duration: 0.6 });

      if (asciiRef.current) {
        gsap.to(asciiRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    const logTitle = sectionRef.current?.querySelector(".hero-log-line") as HTMLElement | null;
    let scrambleCleanup: { cancel: () => void } | null = null;
    if (logTitle) {
      const original = logTitle.textContent || "";
      scrambleCleanup = scrambleText(logTitle, original, { duration: 1000, delay: 650 });
    }

    return () => {
      scrambleCleanup?.cancel();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-era="arpanet"
      className="relative flex min-h-screen w-full max-w-[100%] flex-col items-center justify-center overflow-hidden px-4 sm:px-6"
      style={{ backgroundColor: "hsl(120 100% 3%)" }}
    >
      {/* ASCII network background — clip + min-w-0 prevents horizontal page scroll on narrow viewports */}
      <pre
        ref={asciiRef}
        className="pointer-events-none absolute inset-0 min-w-0 overflow-hidden font-mono-era text-[8px] leading-[1.65] selection-none sm:text-[9px] md:text-[10px] md:leading-[1.8]"
        style={{
          color: "hsl(142 45% 62%)",
          opacity: 0.28,
        }}
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
      <h1 className="sr-only">TRANSMISSION - 60 Years of Internet History</h1>
      <div
        className="relative z-10 mx-auto w-full min-w-0 max-w-[min(100%,480px)] overflow-hidden text-center font-mono-era text-[11px] leading-[1.85] sm:text-[12px] sm:leading-[2] md:text-[13px]"
        style={{ color: "hsl(142 80% 72%)" }}
      >
        <div className="hero-log-line">TRANSMISSION LOG</div>
        <div className="hero-log-line hidden sm:block" style={{ color: "hsl(142 40% 40%)" }}>
          ──────────────────────────────────
        </div>
        <div className="hero-log-line sm:hidden" style={{ color: "hsl(142 40% 40%)" }}>
          ────────────────────
        </div>
        <div className="hero-log-line"><span style={{ color: "hsl(142 40% 40%)" }}>DATE:    </span>OCTOBER 29, 1969</div>
        <div className="hero-log-line"><span style={{ color: "hsl(142 40% 40%)" }}>NODE:    </span>UCLA SIGMA-7</div>
        <div className="hero-log-line"><span style={{ color: "hsl(142 40% 40%)" }}>DEST:    </span>SRI SDS-940</div>
        <div className="hero-log-line"><span className="text-signal">STATUS:  ████ SIGNAL ACTIVE</span></div>
        <div className="hero-log-line hidden sm:block" style={{ color: "hsl(142 40% 40%)" }}>
          ──────────────────────────────────
        </div>
        <div className="hero-log-line sm:hidden" style={{ color: "hsl(142 40% 40%)" }}>
          ────────────────────
        </div>
      </div>

      {/* Pull quote */}
      <p
        ref={quoteRef}
        className="mx-auto mt-8 max-w-[min(100%,480px)] min-w-0 text-center font-serif-era text-[22px] font-light italic leading-[1.35] sm:mt-12 sm:text-[26px] md:text-[28px] md:leading-[1.4]"
        style={{ color: "hsl(142 80% 72%)", opacity: 0 }}
      >
        The first message was two letters long.
      </p>

      <p
        ref={subRef}
        className="mx-auto mt-3 max-w-[min(100%,480px)] min-w-0 text-center font-serif-era text-[15px] sm:mt-4 sm:text-[17px] md:text-[18px]"
        style={{ color: "hsl(142 40% 40%)" }}
      >
        Everything you're reading right now started there.
      </p>

      {/* CTA — width must live on a block wrapper: flex + items-center prevents w-full on the button from stretching */}
      <div className="relative z-10 mt-8 w-full max-w-[min(100%,480px)] sm:mt-10">
        <button
          type="button"
          className="h-11 w-full border px-7 font-display-era text-[12px] font-bold transition-colors duration-200 active:scale-[0.99] sm:px-8 sm:text-[13px]"
          style={{
            fontStretch: "125%",
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
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-2 px-2 sm:bottom-8">
        <span
          className="font-mono-era max-w-[16rem] text-center text-[9px] sm:max-w-none sm:text-[10px]"
          style={{ letterSpacing: "clamp(1px, 0.6vw, 3px)", color: "hsl(142 30% 20%)" }}
        >
          SCROLL TO ADVANCE TRANSMISSION
        </span>
        <span className="preloader-cursor text-signal text-xs">▼</span>
      </div>
    </section>
  );
}
