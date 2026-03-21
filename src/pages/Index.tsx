import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import TimelineRail from "@/components/TimelineRail";
import SectionHero from "@/components/SectionHero";
import SectionArpanet from "@/components/SectionArpanet";
import SectionWeb1 from "@/components/SectionWeb1";
import SectionDotCom from "@/components/SectionDotCom";
import SectionMobile from "@/components/SectionMobile";
import SectionNow from "@/components/SectionNow";
import SectionClosing from "@/components/SectionClosing";

gsap.registerPlugin(ScrollTrigger);

// Era color configurations as HSL component strings
const ERA_COLORS = {
  arpanet: {
    bg: "120 100% 3%",
    text: "142 80% 72%",
    textDim: "142 40% 40%",
    textGhost: "142 30% 20%",
    accent: "142 90% 60%",
    signal: "142 90% 60%",
  },
  web1: {
    bg: "40 15% 94%",
    text: "0 0% 10%",
    textDim: "0 0% 35%",
    textGhost: "0 0% 60%",
    accent: "240 100% 50%",
    signal: "240 100% 50%",
  },
  web2: {
    bg: "215 40% 10%",
    text: "200 20% 90%",
    textDim: "200 10% 55%",
    textGhost: "200 5% 30%",
    accent: "200 90% 55%",
    signal: "200 90% 55%",
  },
  mobile: {
    bg: "0 0% 97%",
    text: "0 0% 13%",
    textDim: "0 0% 45%",
    textGhost: "0 0% 65%",
    accent: "211 100% 50%",
    signal: "211 100% 50%",
  },
  present: {
    bg: "220 18% 7%",
    text: "220 8% 92%",
    textDim: "220 5% 52%",
    textGhost: "220 5% 28%",
    accent: "142 60% 50%",
    signal: "142 70% 65%",
  },
};

type EraKey = keyof typeof ERA_COLORS;

const ERA_MAP: { selector: string; index: number; key: EraKey }[] = [
  { selector: "[data-era='arpanet']", index: 0, key: "arpanet" },
  { selector: "[data-era='web1']", index: 1, key: "web1" },
  { selector: "[data-era='web2']", index: 2, key: "web2" },
  { selector: "[data-era='mobile']", index: 3, key: "mobile" },
  { selector: "[data-era='present']", index: 4, key: "present" },
];

// Parse "H S% L%" to { h, s, l }
function parseHSL(str: string) {
  const parts = str.replace(/%/g, "").split(/\s+/).map(Number);
  return { h: parts[0], s: parts[1], l: parts[2] };
}

function animateEraTransition(eraKey: EraKey) {
  const colors = ERA_COLORS[eraKey];
  const root = document.documentElement;

  const targets = {
    bg: parseHSL(colors.bg),
    text: parseHSL(colors.text),
    textDim: parseHSL(colors.textDim),
    textGhost: parseHSL(colors.textGhost),
    accent: parseHSL(colors.accent),
    signal: parseHSL(colors.signal),
  };

  // Get current values
  const current = {
    bgH: parseFloat(getComputedStyle(root).getPropertyValue("--bg-h") || String(targets.bg.h)),
    bgS: parseFloat(getComputedStyle(root).getPropertyValue("--bg-s") || String(targets.bg.s)),
    bgL: parseFloat(getComputedStyle(root).getPropertyValue("--bg-l") || String(targets.bg.l)),
    textH: parseFloat(getComputedStyle(root).getPropertyValue("--text-h") || String(targets.text.h)),
    textS: parseFloat(getComputedStyle(root).getPropertyValue("--text-s") || String(targets.text.s)),
    textL: parseFloat(getComputedStyle(root).getPropertyValue("--text-l") || String(targets.text.l)),
    accentH: parseFloat(getComputedStyle(root).getPropertyValue("--accent-h") || String(targets.accent.h)),
    accentS: parseFloat(getComputedStyle(root).getPropertyValue("--accent-s") || String(targets.accent.s)),
    accentL: parseFloat(getComputedStyle(root).getPropertyValue("--accent-l") || String(targets.accent.l)),
  };

  gsap.to(current, {
    bgH: targets.bg.h,
    bgS: targets.bg.s,
    bgL: targets.bg.l,
    textH: targets.text.h,
    textS: targets.text.s,
    textL: targets.text.l,
    accentH: targets.accent.h,
    accentS: targets.accent.s,
    accentL: targets.accent.l,
    duration: 1.2,
    ease: "power2.inOut",
    onUpdate: () => {
      root.style.setProperty("--bg-h", String(current.bgH));
      root.style.setProperty("--bg-s", String(current.bgS));
      root.style.setProperty("--bg-l", String(current.bgL));
      root.style.setProperty("--text-h", String(current.textH));
      root.style.setProperty("--text-s", String(current.textS));
      root.style.setProperty("--text-l", String(current.textL));
      root.style.setProperty("--accent-h", String(current.accentH));
      root.style.setProperty("--accent-s", String(current.accentS));
      root.style.setProperty("--accent-l", String(current.accentL));
      // Update the composite custom properties
      root.style.setProperty("--bg", `${current.bgH} ${current.bgS}% ${current.bgL}%`);
      root.style.setProperty("--text", `${current.textH} ${current.textS}% ${current.textL}%`);
      root.style.setProperty("--text-dim", `${targets.textDim.h} ${targets.textDim.s}% ${targets.textDim.l}%`);
      root.style.setProperty("--text-ghost", `${targets.textGhost.h} ${targets.textGhost.s}% ${targets.textGhost.l}%`);
      root.style.setProperty("--accent", `${current.accentH} ${current.accentS}% ${current.accentL}%`);
      root.style.setProperty("--signal", `${targets.signal.h} ${targets.signal.s}% ${targets.signal.l}%`);
    },
  });
}

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeEra, setActiveEra] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  const handlePreloaderComplete = useCallback(() => setLoaded(true), []);

  // Lenis smooth scroll
  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Connect Lenis scroll to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    // Global scroll progress
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    // Era detection with animated color transitions
    ERA_MAP.forEach(({ selector, index, key }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          setActiveEra(index);
          animateEraTransition(key);
        },
        onEnterBack: () => {
          setActiveEra(index);
          animateEraTransition(key);
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [loaded]);

  if (!loaded) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="relative" style={{ backgroundColor: "hsl(var(--bg))" }}>
      <Navbar scrollProgress={scrollProgress} />
      <TimelineRail activeIndex={activeEra} scrollProgress={scrollProgress} />
      <main>
        <SectionHero />
        <SectionArpanet />
        <SectionWeb1 />
        <SectionDotCom />
        <SectionMobile />
        <SectionNow />
        <SectionClosing />
      </main>
    </div>
  );
}
