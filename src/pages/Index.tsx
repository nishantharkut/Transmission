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
import SignalDisruption, { type SignalDisruptionHandle } from "@/components/SignalDisruption";

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

function animateEraTransition(eraKey: EraKey) {
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

  const readHSL = (prop: string, fallback: { h: number; s: number; l: number }) => {
    const raw = getComputedStyle(root).getPropertyValue(prop).trim();
    if (!raw) return fallback;
    const parts = raw.replace(/%/g, "").split(/\s+/).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return fallback;
    return { h: parts[0], s: parts[1], l: parts[2] };
  };

  const curBg = readHSL("--bg", targets.bg);
  const curText = readHSL("--text", targets.text);
  const curAccent = readHSL("--accent", targets.accent);

  const current = {
    bgH: curBg.h, bgS: curBg.s, bgL: curBg.l,
    textH: curText.h, textS: curText.s, textL: curText.l,
    accentH: curAccent.h, accentS: curAccent.s, accentL: curAccent.l,
  };

  const duration = eraKey === "web3" ? 0.7 : eraKey === "present" ? 1.0 : 0.8;
  const ease = eraKey === "web3" ? "power2.in" : "power2.inOut";

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
    duration,
    ease,
    onUpdate: () => {
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
  const disruptionRef = useRef<SignalDisruptionHandle>(null);

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
          disruptionRef.current?.fire();
          setActiveEra(index);
          animateEraTransition(key);
        },
        onEnterBack: () => {
          disruptionRef.current?.fire();
          setActiveEra(index);
          animateEraTransition(key);
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
    <div className="relative overflow-hidden" style={{ backgroundColor: "hsl(var(--bg))" }}>
      <SignalDisruption ref={disruptionRef} />
      <Navbar scrollProgress={scrollProgress} activeEra={activeEra} />
      <TimelineRail activeIndex={activeEra} scrollProgress={scrollProgress} />
      <main>
        <SectionHero />
        {/* Hero & ARPANET are same color — no gradient needed */}
        <SectionArpanet />
        <div className="h-20" style={{ background: "linear-gradient(to bottom, hsl(120 100% 3%), hsl(40 15% 94%))" }} />
        <SectionWeb1 />
        <div className="h-20" style={{ background: "linear-gradient(to bottom, hsl(40 15% 94%), hsl(215 40% 10%))" }} />
        <SectionDotCom />
        <div className="h-20" style={{ background: "linear-gradient(to bottom, hsl(215 40% 10%), hsl(0 0% 97%))" }} />
        <SectionMobile />
        <div className="h-20" style={{ background: "linear-gradient(to bottom, hsl(0 0% 97%), hsl(252 22% 7%))" }} />
        <SectionWeb3 />
        <div className="h-16" style={{ background: "linear-gradient(to bottom, hsl(252 22% 7%), hsl(220 18% 9%))" }} />
        <SectionNow />
        <div className="h-12" style={{ background: "linear-gradient(to bottom, hsl(220 18% 9%), hsl(220 14% 11%))" }} />
        <SectionClosing />
      </main>
    </div>
  );
}
