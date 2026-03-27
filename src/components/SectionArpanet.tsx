import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealHeading from "@/components/RevealHeading";

gsap.registerPlugin(ScrollTrigger);

const EVENTS = [
  { date: "1969.10.29", text: 'FIRST PACKET TRANSMITTED' },
  { date: "1971.07.04", text: "EMAIL INVENTED (RAY TOMLINSON)" },
  { date: "1973.01.01", text: "TRANS-ATLANTIC CONNECTION" },
  { date: "1977.00.00", text: "FIRST PC MODEM" },
  { date: "1983.01.01", text: "TCP/IP ADOPTED — THE INTERNET IS BORN" },
];

const STATS = [
  { num: "4", label: "nodes in the original network", stretch: "50%" },
  { num: "2", label: "letters in the first message sent", stretch: "50%" },
  { num: "1983", label: "year the internet was officially born", stretch: "75%" },
];

export default function SectionArpanet() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const packet1 = useRef<SVGCircleElement>(null);
  const packet2 = useRef<SVGCircleElement>(null);
  const packet3 = useRef<SVGCircleElement>(null);
  const [visibleEvents, setVisibleEvents] = useState(0);
  const feedTriggered = useRef(false);
  const feedInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".arpanet-left", {
        x: -30, opacity: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(".arpanet-right", {
        x: 30, opacity: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      // Typewriter feed — events appear one by one after feed box slides in
      ScrollTrigger.create({
        trigger: ".arpanet-feed",
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (feedTriggered.current) return;
          feedTriggered.current = true;

          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (reduced) {
            setVisibleEvents(EVENTS.length);
            return;
          }

          // Wait for feed box slide-in animation (0.7s) before typing
          setTimeout(() => {
            let count = 0;
            feedInterval.current = setInterval(() => {
              count++;
              setVisibleEvents(count);
              if (count >= EVENTS.length) {
                if (feedInterval.current) clearInterval(feedInterval.current);
                feedInterval.current = null;
              }
            }, 350);
          }, 700);
        },
      });

      gsap.fromTo(
        svgRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: svgRef.current, start: "top 85%" },
        }
      );

      if (packet1.current) {
        gsap.fromTo(packet1.current,
          { attr: { cx: 80, cy: 55 } },
          { attr: { cx: 400, cy: 55 }, duration: 2.4, repeat: -1, ease: "none", delay: 0.2 }
        );
      }
      if (packet2.current) {
        gsap.fromTo(packet2.current,
          { attr: { cx: 400, cy: 55 } },
          { attr: { cx: 400, cy: 195 }, duration: 1.8, repeat: -1, ease: "none", delay: 0.8 }
        );
      }
      if (packet3.current) {
        gsap.fromTo(packet3.current,
          { attr: { cx: 80, cy: 195 } },
          { attr: { cx: 80, cy: 55 }, duration: 2.0, repeat: -1, ease: "none", delay: 1.4 }
        );
      }
    }, sectionRef);
    return () => {
      ctx.revert();
      if (feedInterval.current) clearInterval(feedInterval.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-era="arpanet"
      className="mx-auto max-w-[1080px] px-4 py-16 sm:px-6 md:py-[120px]"
      style={{ backgroundColor: "hsl(120 100% 3%)" }}
    >
      {/* Narrative hook + topology — side by side on md+ */}
      <div className="mb-10 grid grid-cols-1 items-center gap-8 sm:gap-10 md:mb-14 md:grid-cols-2 md:gap-8 lg:gap-12">
        <RevealHeading
          text="The first engineers built a network that could survive a nuclear strike. They had no idea it would survive everything else instead."
          className="font-serif-era max-w-[640px] justify-self-start text-[24px] font-bold sm:text-[28px] md:max-w-none md:text-[32px] lg:text-[40px] xl:text-[48px]"
          style={{ color: "hsl(142 80% 72%)", lineHeight: 1.1 }}
          triggerStart="top 78%"
        />

        <div className="flex min-w-0 justify-center md:justify-end">
          <svg
            ref={svgRef}
            viewBox="0 0 480 250"
            className="w-full max-w-[420px] md:max-w-[460px] lg:max-w-[520px]"
            aria-label="Animated diagram of the original 4-node ARPANET network"
            style={{ opacity: 0 }}
          >
          <defs>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="packetGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line x1="80" y1="55" x2="400" y2="55" stroke="hsla(142,55%,45%,0.18)" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="80" y1="55" x2="80" y2="195" stroke="hsla(142,55%,45%,0.18)" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="400" y1="55" x2="400" y2="195" stroke="hsla(142,55%,45%,0.18)" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="80" y1="195" x2="400" y2="195" stroke="hsla(142,55%,45%,0.18)" strokeWidth="1" strokeDasharray="6 4" />

          <circle cx="80" cy="55" r="8" fill="hsl(142 85% 50%)" opacity="0.9" filter="url(#nodeGlow)" />
          <circle cx="400" cy="55" r="8" fill="hsl(142 85% 50%)" opacity="0.9" filter="url(#nodeGlow)" />
          <circle cx="80" cy="195" r="8" fill="hsl(142 85% 50%)" opacity="0.9" filter="url(#nodeGlow)" />
          <circle cx="400" cy="195" r="8" fill="hsl(142 85% 50%)" opacity="0.9" filter="url(#nodeGlow)" />

          <text x="80" y="80" textAnchor="middle" fill="hsl(142 40% 42%)" fontSize="10" fontFamily="var(--mono-font)">UCLA</text>
          <text x="400" y="80" textAnchor="middle" fill="hsl(142 40% 42%)" fontSize="10" fontFamily="var(--mono-font)">SRI</text>
          <text x="80" y="220" textAnchor="middle" fill="hsl(142 40% 42%)" fontSize="10" fontFamily="var(--mono-font)">UCSB</text>
          <text x="400" y="220" textAnchor="middle" fill="hsl(142 40% 42%)" fontSize="10" fontFamily="var(--mono-font)">UTAH</text>

          <circle ref={packet1} cx="80" cy="55" r="3" fill="hsl(142 90% 70%)" filter="url(#packetGlow)" />
          <circle ref={packet2} cx="400" cy="55" r="3" fill="hsl(142 90% 70%)" filter="url(#packetGlow)" />
          <circle ref={packet3} cx="80" cy="195" r="3" fill="hsl(142 90% 70%)" filter="url(#packetGlow)" />

          <text x="240" y="130" textAnchor="middle" fill="hsl(142 30% 28%)" fontSize="9" fontFamily="var(--mono-font)" letterSpacing="3">
            ARPANET 1969
          </text>
          </svg>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        {/* Left: Transmission feed */}
        <div
          className="arpanet-left arpanet-feed border p-4 sm:p-6"
          style={{ borderColor: "hsla(142, 90%, 60%, 0.12)", minHeight: 120 }}
        >
          {EVENTS.slice(0, visibleEvents).map((evt, i) => (
            <div key={i} className="font-mono-era text-[11px] leading-[1.85] sm:text-[12px] sm:leading-[2]">
              <span style={{ color: "hsl(142 40% 40%)" }}>{evt.date}  </span>
              <span style={{ color: "hsl(142 80% 72%)" }}>{evt.text}</span>
            </div>
          ))}
          <span className="preloader-cursor font-mono-era text-signal text-xs mt-1 inline-block">_</span>
        </div>

        {/* Right: Stats */}
        <div className="arpanet-right">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="pt-4 mb-7"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="font-display-era text-[48px] font-extrabold leading-none sm:text-[56px] md:text-[64px]"
                style={{ color: "hsl(142 90% 60%)", fontStretch: stat.stretch }}
              >
                {stat.num}
              </div>
              <div className="font-ui-era text-[13px] mt-2" style={{ color: "hsl(142 40% 40%)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
