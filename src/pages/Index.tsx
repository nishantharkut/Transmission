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

/** Destination surface color (Approach B); avoids “wrong era” flash under the curtain. */
const ERA_WIPE_COLORS: Record<EraKey, string> = {
  arpanet: "hsl(120 100% 3%)",
  web1: "hsl(38 18% 10%)",
  web2: "hsl(215 40% 10%)",
  mobile: "hsl(220 14% 13%)",
  web3: "hsl(252 22% 7%)",
  present: "hsl(220 18% 7%)",
};

const ERA_WIPE_FROM_RIGHT: ReadonlySet<EraKey> = new Set(["web1", "mobile"]);

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

let lastSettledEraKey: EraKey | null = null;
/** Target era of the in-flight wipe (dedupe rapid duplicate triggers). */
let wipeInflightTarget: EraKey | null = null;
let eraWipeTimeline: gsap.core.Timeline | null = null;

function resetWipeTransform(wipe: HTMLElement, fromRight: boolean) {
  if (fromRight) wipe.setAttribute("data-wipe-from", "");
  else wipe.removeAttribute("data-wipe-from");

  gsap.set(wipe, {
    xPercent: fromRight ? 100 : -100,
    force3D: true,
    "--wipe-edge-opacity": 0.28,
  });
}

function stopWipeCleanup(wipe: HTMLElement) {
  eraWipeTimeline?.kill();
  eraWipeTimeline = null;
  gsap.killTweensOf(wipe);
  wipe.style.removeProperty("will-change");
}

/**
 * Curtain = decisive cover (snap into destination) + calmer reveal (no floaty expo tail).
 * Web3→NOW stays longer so two near luminances read as a deliberate beat.
 */
function transitionEra(newEra: EraKey) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyDocumentEra(newEra);
    lastSettledEraKey = newEra;
    wipeInflightTarget = null;
    return;
  }

  const wipe = document.getElementById("era-wipe");
  if (!wipe) {
    applyDocumentEra(newEra);
    lastSettledEraKey = newEra;
    wipeInflightTarget = null;
    return;
  }

  if (!eraWipeTimeline && newEra === lastSettledEraKey) return;
  if (eraWipeTimeline && wipeInflightTarget === newEra) return;

  const prev = lastSettledEraKey;
  const web3ToNow = newEra === "present" && prev === "web3";
  const coverDur = web3ToNow ? 0.46 : 0.32;
  const revealDur = web3ToNow ? 0.7 : 0.44;
  const fromRight = ERA_WIPE_FROM_RIGHT.has(newEra);

  stopWipeCleanup(wipe);
  wipeInflightTarget = newEra;

  wipe.style.setProperty("--wipe-color", ERA_WIPE_COLORS[newEra]);
  resetWipeTransform(wipe, fromRight);
  wipe.style.willChange = "transform";

  const tl = gsap.timeline({
    defaults: { force3D: true },
    onComplete: () => {
      eraWipeTimeline = null;
      wipeInflightTarget = null;
      lastSettledEraKey = newEra;
      wipe.style.removeProperty("will-change");
    },
  });
  eraWipeTimeline = tl;

  const coverEase = "power2.in";
  const revealEase = "power3.out";

  if (fromRight) {
    tl.fromTo(wipe, { xPercent: 100 }, { xPercent: 0, duration: coverDur, ease: coverEase });
  } else {
    tl.fromTo(wipe, { xPercent: -100 }, { xPercent: 0, duration: coverDur, ease: coverEase });
  }

  tl.to(
    wipe,
    {
      "--wipe-edge-opacity": 0.72,
      duration: coverDur * 0.42,
      ease: "power2.out",
    },
    0,
  ).to(
    wipe,
    {
      "--wipe-edge-opacity": 0.38,
      duration: coverDur * 0.58,
      ease: "power2.in",
    },
    coverDur * 0.42,
  );

  tl.call(() => applyDocumentEra(newEra), undefined, coverDur);

  tl.to(
    wipe,
    {
      xPercent: 100,
      duration: revealDur,
      ease: revealEase,
    },
    coverDur,
  );

  tl.to(
    wipe,
    {
      "--wipe-edge-opacity": 0,
      duration: Math.min(0.2, revealDur * 0.28),
      ease: "power2.in",
    },
    "<",
  );
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
        lastSettledEraKey = key;
        wipeInflightTarget = null;
        const w = document.getElementById("era-wipe");
        if (w) resetWipeTransform(w, ERA_WIPE_FROM_RIGHT.has(key));
      });
    });

    return () => {
      window.removeEventListener("resize", onResize);
      const w = document.getElementById("era-wipe");
      if (w) stopWipeCleanup(w);
      wipeInflightTarget = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loaded]);

  if (!loaded) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="relative overflow-x-hidden" style={{ backgroundColor: "hsl(var(--bg))" }}>
      <div id="era-wipe" aria-hidden="true" />
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
