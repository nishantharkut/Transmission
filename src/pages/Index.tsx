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

/** Last completed era transition; used to extend timing for Web3 → NOW only. */
let lastCompletedEraKey: EraKey | null = null;
let eraColorTween: gsap.core.Tween | null = null;

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

function animateEraTransition(eraKey: EraKey) {
  const previousEra = lastCompletedEraKey;
  const fromWeb3ToPresent = eraKey === "present" && previousEra === "web3";
  const duration = fromWeb3ToPresent ? 1.2 : 0.9;
  const ease = "power2.inOut";

  eraColorTween?.kill();

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

  eraColorTween = gsap.to(current, {
    bgH: targets.bg.h,
    bgS: targets.bg.s,
    bgL: targets.bg.l,
    textH: targets.text.h,
    textS: targets.text.s,
    textL: targets.text.l,
    accentH: targets.accent.h,
    accentS: targets.accent.s,
    accentL: targets.accent.l,
    duration,
    ease,
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
      root.style.setProperty("--bg", `${current.bgH} ${current.bgS}% ${current.bgL}%`);
      root.style.setProperty("--text", `${current.textH} ${current.textS}% ${current.textL}%`);
      root.style.setProperty("--text-dim", `${targets.textDim.h} ${targets.textDim.s}% ${targets.textDim.l}%`);
      root.style.setProperty("--text-ghost", `${targets.textGhost.h} ${targets.textGhost.s}% ${targets.textGhost.l}%`);
      root.style.setProperty("--accent", `${current.accentH} ${current.accentS}% ${current.accentL}%`);
      root.style.setProperty("--signal", `${targets.signal.h} ${targets.signal.s}% ${targets.signal.l}%`);
    },
    onComplete: () => {
      lastCompletedEraKey = eraKey;
      eraColorTween = null;
    },
  });
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
      // Let native touch scrolling drive the page on phones (better feel + fewer pin glitches)
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
          animateEraTransition(key);
        },
        onEnterBack: () => {
          setActiveEra(index);
          animateEraTransition(key);
        },
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      eraColorTween?.kill();
      eraColorTween = null;
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
