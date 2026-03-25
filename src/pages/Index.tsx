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
import SectionWeb3 from "@/components/SectionWeb3";
import SectionNow from "@/components/SectionNow";
import SectionClosing from "@/components/SectionClosing";

gsap.registerPlugin(ScrollTrigger);

/** Must match `--era-{name}-*` custom properties in `src/index.css` (:root). */
type EraKey = "arpanet" | "web1" | "web2" | "mobile" | "web3" | "present";

const ERA_MAP: { selector: string; index: number; key: EraKey }[] = [
  { selector: "[data-era='arpanet']", index: 0, key: "arpanet" },
  { selector: "[data-era='web1']", index: 1, key: "web1" },
  { selector: "[data-era='web2']", index: 2, key: "web2" },
  { selector: "[data-era='mobile']", index: 3, key: "mobile" },
  { selector: "[data-era='web3']", index: 4, key: "web3" },
  { selector: "[data-era='present']", index: 5, key: "present" },
];

function parseHSL(str: string) {
  const parts = str.replace(/%/g, "").split(/\s+/).map(Number);
  return { h: parts[0], s: parts[1], l: parts[2] };
}

function readEraPaletteFromCss(eraKey: EraKey) {
  const root = getComputedStyle(document.documentElement);
  const v = (suffix: string) => root.getPropertyValue(`--era-${eraKey}-${suffix}`).trim();

  return {
    bg: v("bg"),
    text: v("text"),
    textDim: v("text-dim"),
    textGhost: v("text-ghost"),
    accent: v("accent"),
    signal: v("signal"),
  };
}

/** Instant global palette sync (no scroll-driven transition animation). */
function applyEraPalette(eraKey: EraKey) {
  const colors = readEraPaletteFromCss(eraKey);
  const root = document.documentElement;
  const targets = {
    bg: parseHSL(colors.bg),
    text: parseHSL(colors.text),
    textDim: parseHSL(colors.textDim),
    textGhost: parseHSL(colors.textGhost),
    accent: parseHSL(colors.accent),
    signal: parseHSL(colors.signal),
  };

  root.style.setProperty("--bg-h", String(targets.bg.h));
  root.style.setProperty("--bg-s", String(targets.bg.s));
  root.style.setProperty("--bg-l", String(targets.bg.l));
  root.style.setProperty("--text-h", String(targets.text.h));
  root.style.setProperty("--text-s", String(targets.text.s));
  root.style.setProperty("--text-l", String(targets.text.l));
  root.style.setProperty("--accent-h", String(targets.accent.h));
  root.style.setProperty("--accent-s", String(targets.accent.s));
  root.style.setProperty("--accent-l", String(targets.accent.l));
  root.style.setProperty("--bg", `${targets.bg.h} ${targets.bg.s}% ${targets.bg.l}%`);
  root.style.setProperty("--text", `${targets.text.h} ${targets.text.s}% ${targets.text.l}%`);
  root.style.setProperty("--text-dim", `${targets.textDim.h} ${targets.textDim.s}% ${targets.textDim.l}%`);
  root.style.setProperty("--text-ghost", `${targets.textGhost.h} ${targets.textGhost.s}% ${targets.textGhost.l}%`);
  root.style.setProperty("--accent", `${targets.accent.h} ${targets.accent.s}% ${targets.accent.l}%`);
  root.style.setProperty("--signal", `${targets.signal.h} ${targets.signal.s}% ${targets.signal.l}%`);
}

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeEra, setActiveEra] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  const handlePreloaderComplete = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: window.matchMedia("(max-width: 767px)").matches ? 1.5 : 1,
    });
    lenisRef.current = lenis;

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    ERA_MAP.forEach(({ selector, index, key }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          setActiveEra(index);
          applyEraPalette(key);
        },
        onEnterBack: () => {
          setActiveEra(index);
          applyEraPalette(key);
        },
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loaded]);

  if (!loaded) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="relative overflow-x-hidden" style={{ backgroundColor: "hsl(var(--bg))" }}>
      <Navbar scrollProgress={scrollProgress} activeEra={activeEra} />
      <TimelineRail activeIndex={activeEra} scrollProgress={scrollProgress} />
      <main>
        <SectionHero />
        <SectionArpanet />
        <SectionWeb1 />
        <SectionDotCom />
        <SectionMobile />
        <SectionWeb3 />
        <SectionNow />
        <SectionClosing />
      </main>
    </div>
  );
}
