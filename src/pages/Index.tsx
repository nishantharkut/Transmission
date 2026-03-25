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

type EraKey = "arpanet" | "web1" | "web2" | "mobile" | "web3" | "present";

const ERA_MAP: { selector: string; index: number; key: EraKey }[] = [
  { selector: "[data-era='arpanet']", index: 0, key: "arpanet" },
  { selector: "[data-era='web1']", index: 1, key: "web1" },
  { selector: "[data-era='web2']", index: 2, key: "web2" },
  { selector: "[data-era='mobile']", index: 3, key: "mobile" },
  { selector: "[data-era='web3']", index: 4, key: "web3" },
  { selector: "[data-era='present']", index: 5, key: "present" },
];

/** Destination-era background for the wipe panel (removes wrong-color flash). */
const ERA_WIPE_COLORS: Record<EraKey, string> = {
  arpanet: "hsl(120 100% 3%)",
  web1: "hsl(40 15% 92%)",
  web2: "hsl(215 40% 10%)",
  mobile: "hsl(0 0% 97%)",
  web3: "hsl(252 22% 7%)",
  present: "hsl(220 18% 7%)",
};

const LIGHT_ERA_ENTERS_FROM_RIGHT: ReadonlySet<EraKey> = new Set(["web1", "mobile"]);

const LEGACY_ROOT_TWEEN_PROPS = [
  "--bg-h",
  "--bg-s",
  "--bg-l",
  "--text-h",
  "--text-s",
  "--text-l",
  "--accent-h",
  "--accent-s",
  "--accent-l",
  "--bg",
  "--text",
  "--text-dim",
  "--text-ghost",
  "--accent",
  "--signal",
] as const;

function clearLegacyRootStyleProps() {
  const s = document.documentElement.style;
  LEGACY_ROOT_TWEEN_PROPS.forEach((p) => s.removeProperty(p));
}

function applyDocumentEra(newEra: EraKey) {
  document.documentElement.setAttribute("data-era", newEra);
  clearLegacyRootStyleProps();
}

let eraWipeTimeline: gsap.core.Timeline | null = null;

function transitionEra(newEra: EraKey) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyDocumentEra(newEra);
    return;
  }

  const wipe = document.getElementById("era-wipe");
  if (!wipe) {
    applyDocumentEra(newEra);
    return;
  }

  eraWipeTimeline?.kill();
  wipe.style.setProperty("--wipe-color", ERA_WIPE_COLORS[newEra]);
  gsap.killTweensOf(wipe);

  const tl = gsap.timeline({
    onComplete: () => {
      eraWipeTimeline = null;
    },
  });
  eraWipeTimeline = tl;

  const fromRight = LIGHT_ERA_ENTERS_FROM_RIGHT.has(newEra);

  if (fromRight) {
    tl.fromTo(wipe, { x: "100%" }, { x: "0%", duration: 0.45, ease: "power2.in" });
  } else {
    tl.fromTo(wipe, { x: "-100%" }, { x: "0%", duration: 0.45, ease: "power2.in" });
  }

  tl.call(() => applyDocumentEra(newEra))
    .to(wipe, { x: "100%", duration: 0.45, ease: "power2.out" })
    .set(wipe, { x: "-100%" });
}

function eraAtViewportCenter(): EraKey {
  const mid = window.innerHeight * 0.5;
  for (const { key, selector } of ERA_MAP) {
    const el = document.querySelector(selector);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top < mid && r.bottom > mid) return key;
  }
  return "arpanet";
}

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeEra, setActiveEra] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const didSyncInitialEra = useRef(false);

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
          transitionEra(key);
        },
        onEnterBack: () => {
          setActiveEra(index);
          transitionEra(key);
        },
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (didSyncInitialEra.current) return;
        didSyncInitialEra.current = true;
        const key = eraAtViewportCenter();
        const idx = ERA_MAP.find((e) => e.key === key)?.index ?? 0;
        setActiveEra(idx);
        applyDocumentEra(key);
      });
    });

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      eraWipeTimeline?.kill();
      eraWipeTimeline = null;
    };
  }, [loaded]);

  if (!loaded) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="relative overflow-x-hidden" style={{ backgroundColor: "hsl(var(--bg))" }}>
      <div id="era-wipe" aria-hidden />
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
