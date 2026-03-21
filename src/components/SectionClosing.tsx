import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionClosing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".closing-content > *", {
        opacity: 0,
        y: 15,
        stagger: 0.2,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6"
      style={{ backgroundColor: "hsl(220 18% 7%)" }}
    >
      <div className="closing-content max-w-[600px] mx-auto text-center">
        <div
          className="font-display-era font-extrabold text-[11px] uppercase"
          style={{ fontStretch: "150%", letterSpacing: "4px", color: "hsl(220 5% 28%)" }}
        >
          TRANSMISSION COMPLETE
        </div>

        <h2
          className="font-serif-era font-bold text-[28px] md:text-[44px] mt-4 leading-[1.1]"
          style={{ color: "hsl(220 8% 92%)" }}
        >
          The internet was built to survive anything.
        </h2>

        <p
          className="font-serif-era italic font-light text-[28px] md:text-[44px] leading-[1.1] mt-2"
          style={{ color: "hsl(220 5% 52%)" }}
        >
          What it became was never in the plan.
        </p>

        <div
          className="mx-auto my-10"
          style={{ width: 64, height: 1, backgroundColor: "hsl(142 70% 65%)" }}
        />

        <div className="font-ui-era text-[13px]" style={{ color: "hsl(220 5% 28%)" }}>
          A history by Frontend Odyssey
        </div>
      </div>

      {/* Footer */}
      <footer
        className="max-w-[1080px] mx-auto mt-24 pt-10 px-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          className="font-display-era font-bold text-[12px]"
          style={{ fontStretch: "125%", letterSpacing: "0.1em", color: "hsl(220 5% 28%)" }}
        >
          TRANSMISSION
        </span>
        <span className="font-mono-era text-[11px]" style={{ color: "hsl(220 5% 28%)" }}>
          1969 – 2026
        </span>
        <span className="font-ui-era text-[11px]" style={{ color: "hsl(220 5% 28%)" }}>
          Frontend Odyssey 2026
        </span>
      </footer>
    </section>
  );
}
