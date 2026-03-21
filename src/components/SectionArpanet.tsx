import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
      gsap.from(".arpanet-event", {
        opacity: 0, duration: 0.3, stagger: 0.08,
        scrollTrigger: { trigger: ".arpanet-feed", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-era="arpanet"
      className="py-[120px] px-6 max-w-[1080px] mx-auto"
      style={{ backgroundColor: "hsl(120 100% 3%)" }}
    >
      {/* Narrative hook */}
      <h2
        className="font-serif-era font-bold text-[32px] md:text-[52px] leading-[1.1] max-w-[640px] mb-16"
        style={{ color: "hsl(142 80% 72%)", lineHeight: 1.1 }}
      >
        The first engineers built a network that could survive a nuclear strike. They had no idea it would survive everything else instead.
      </h2>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Transmission feed */}
        <div className="arpanet-left arpanet-feed border p-6" style={{ borderColor: "hsla(142, 90%, 60%, 0.12)" }}>
          {EVENTS.map((evt, i) => (
            <div key={i} className="arpanet-event font-mono-era text-[12px] leading-[2]">
              <span style={{ color: "hsl(142 40% 40%)" }}>{evt.date}  </span>
              <span style={{ color: "hsl(142 80% 72%)" }}>{evt.text}</span>
            </div>
          ))}
          <span className="preloader-cursor font-mono-era text-signal text-xs mt-2 inline-block">_</span>
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
                className="font-display-era font-extrabold text-[64px] leading-none"
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
