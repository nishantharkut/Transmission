import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealHeading from "@/components/RevealHeading";

gsap.registerPlugin(ScrollTrigger);

type TimelineRow =
  | { kind: "event"; year: string; label: string }
  | { kind: "subnote"; text: string };

const TIMELINE_ROWS: TimelineRow[] = [
  { kind: "event", year: "1969", label: "4 nodes" },
  { kind: "event", year: "1983", label: "TCP/IP standardized" },
  { kind: "event", year: "1991", label: "Web born, gifted freely" },
  { kind: "event", year: "1995", label: "First online purchase" },
  { kind: "event", year: "2004", label: "Social graphs emerge" },
  { kind: "event", year: "2012", label: "Mobile majority" },
  {
    kind: "event",
    year: "2014",
    label: "CHAINS, WALLETS, GAS. THE PROMISE OF OWNERSHIP.",
  },
  { kind: "subnote", text: "THE PROMISE REMAINS UNRESOLVED" },
  { kind: "event", year: "__YEAR__", label: "5.4 billion connected" },
];

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NETWORK_BASE = "hsl(142 64% 54%)";
const NETWORK_BASE_SOFT = "hsla(142, 64%, 54%, 0.24)";
const NETWORK_LINK = "hsla(142, 56%, 46%, 0.14)";
const NETWORK_LINK_NEAR = "hsla(142, 62%, 54%, 0.22)";
const NETWORK_CURSOR = "hsl(142 78% 66%)";
const NETWORK_CURSOR_LINK = "hsla(142, 78%, 66%, 0.55)";
const NETWORK_CURSOR_GLOW = "hsla(142, 92%, 72%, 0.22)";

export default function SectionNow() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeTextRef = useRef<HTMLSpanElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number>(0);
  const isCanvasVisibleRef = useRef(false);
  const drawFnRef = useRef<(() => void) | null>(null);
  const [showYou, setShowYou] = useState(false);
  const presentYear = String(new Date().getFullYear());

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 5400000000,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top 70%",
        },
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counter.val).toLocaleString();
          }
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".now-timeline", start: "top 75%" },
        onComplete: () => setTimeout(() => setShowYou(true), 800),
      });
      const root = sectionRef.current;
      if (root) {
        const animEls = root.querySelectorAll(".now-timeline-anim");
        animEls.forEach((el, i) => {
          const isSubnote = el.classList.contains("now-timeline-subnote");
          const pos = i === 0 ? 0 : isSubnote ? "<0.28" : "<0.08";
          tl.from(el, { opacity: 0, duration: 0.3 }, pos);
        });
      }

      ScrollTrigger.create({
        trigger: canvasRef.current,
        start: "top 60%",
        onEnter: () => {
          gsap.fromTo(
            nodeTextRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.7, delay: 0.7 }
          );
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!showYou) return;
    gsap.fromTo(
      ".now-timeline-you",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
    );
  }, [showYou]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const isMobile = rect.width < 640;
    const nodeCount = Math.min(isMobile ? 30 : 60, Math.floor(rect.width / (isMobile ? 18 : 15)));
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio;

    const draw = () => {
      if (!isCanvasVisibleRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > rect.width) n.vx *= -1;
        if (n.y < 0 || n.y > rect.height) n.vy *= -1;
      });

      const maxDist = rect.width < 640 ? 90 : 118;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const strength = 1 - dist / maxDist;
            ctx.strokeStyle = strength > 0.55 ? NETWORK_LINK_NEAR : NETWORK_LINK;
            ctx.lineWidth = strength > 0.55 ? 0.95 : 0.65;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.fillStyle = NETWORK_BASE_SOFT;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = NETWORK_BASE;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      if (mouse.x > 0 && mouse.y > 0) {
        const distances = nodes.map((n, i) => ({
          i,
          dist: Math.sqrt((n.x - mouse.x) ** 2 + (n.y - mouse.y) ** 2),
        })).sort((a, b) => a.dist - b.dist);

        for (let k = 0; k < Math.min(3, distances.length); k++) {
          const n = nodes[distances[k].i];
          const linkStrength = Math.max(0.35, 1 - distances[k].dist / 180);
          ctx.strokeStyle = `hsla(142, 78%, 66%, ${0.3 + linkStrength * 0.35})`;
          ctx.lineWidth = 1.25 + linkStrength * 0.55;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }

        ctx.fillStyle = NETWORK_CURSOR_GLOW;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = NETWORK_CURSOR_LINK;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 7.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = NETWORK_CURSOR;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      animFrameRef.current = requestAnimationFrame(draw);
    };

    drawFnRef.current = draw;
    draw();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let initialized = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isCanvasVisibleRef.current;
        isCanvasVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!initialized) {
            initialized = true;
            initCanvas();
          } else if (!wasVisible && drawFnRef.current) {
            drawFnRef.current();
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -100, y: -100 };
    };
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchstart", handleTouch, { passive: true });
    canvas.addEventListener("touchmove", handleTouch, { passive: true });
    canvas.addEventListener("touchend", handleLeave);
    canvas.addEventListener("touchcancel", handleLeave);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("touchmove", handleTouch);
      canvas.removeEventListener("touchend", handleLeave);
      canvas.removeEventListener("touchcancel", handleLeave);
      observer.disconnect();
    };
  }, [initCanvas]);

  return (
    <section
      ref={sectionRef}
      data-era="present"
      className="pt-14 pb-16 md:pt-20 md:pb-[120px]"
      style={{ backgroundColor: "hsl(220 18% 9%)" }}
    >
      {/* Counter */}
      <div className="flex flex-col items-center px-4 pt-2 sm:px-6 md:pt-4">
        <div
          ref={counterRef}
          className="font-mono-era text-[34px] font-bold tabular-nums text-signal sm:text-[52px] md:text-[80px] lg:text-[96px]"
          style={{ color: "hsl(142 70% 65%)" }}
        >
          0
        </div>
        <p className="mt-2 text-center font-ui-era text-[15px] font-light sm:text-[18px]" style={{ color: "hsl(220 5% 52%)" }}>
          People on the internet right now.
        </p>
        <RevealHeading
          text="All of them reached here through a message that lost its third letter in 1969."
          as="p"
          className="mt-6 max-w-[min(100%,520px)] text-center font-serif-era text-[18px] font-semibold italic sm:text-[20px] md:text-[22px]"
          style={{ color: "hsl(220 8% 92%)", lineHeight: 1.4 }}
          triggerStart="top 75%"
        />
      </div>

      {/* Terminal recap — compact vertical timeline, centered as one unit (w-fit) */}
      <div className="flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10">
        <div
          className="now-timeline relative w-fit max-w-[480px]"
          aria-label="Milestones from ARPANET to today"
        >
          {/* Rail — aligned to dot column; box is only as wide as content so the group centers */}
          <div
            className="pointer-events-none absolute bottom-2 left-3.5 top-2 z-0 w-px sm:left-4"
            style={{
              background:
                "linear-gradient(180deg, hsl(142 55% 48% / 0.85) 0%, hsl(142 40% 40% / 0.35) 45%, hsl(220 12% 38% / 0.45) 100%)",
              boxShadow: "0 0 12px hsl(142 60% 45% / 0.12)",
            }}
            aria-hidden
          />

          <div className="relative z-[1]">
            {TIMELINE_ROWS.map((row, i) => {
              if (row.kind === "subnote") {
                return (
                  <p
                    key="subnote-promise"
                    className="now-timeline-anim now-timeline-subnote font-mono-era pb-2 pl-[1.5em] text-[11px] leading-snug sm:text-[12px] sm:leading-normal"
                    style={{ color: "hsl(44 96% 56%)", fontWeight: 500 }}
                  >
                    {row.text}
                  </p>
                );
              }
              const year = row.year === "__YEAR__" ? presentYear : row.year;
              return (
                <div
                  key={`${year}-${row.label}-${i}`}
                  className="now-timeline-line now-timeline-anim flex items-start gap-2.5 pb-2 sm:gap-3 sm:pb-2.5"
                >
                  <div className="flex w-7 shrink-0 flex-col items-center sm:w-8">
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5"
                      style={{
                        background: "hsl(142 65% 52%)",
                        boxShadow:
                          "0 0 0 2px hsl(220 18% 7%), 0 0 10px hsl(142 70% 50% / 0.35)",
                      }}
                    />
                  </div>
                  <p className="min-w-0 max-w-[56ch] pt-0.5 text-left font-mono-era text-[11px] font-normal leading-snug sm:text-[12px] sm:leading-normal">
                    <span
                      className="font-semibold tabular-nums tracking-wide"
                      style={{ color: "hsl(142 72% 58%)" }}
                    >
                      {year}
                    </span>
                    <span style={{ color: "hsl(220 8% 45%)" }}> — </span>
                    <span style={{ color: "hsl(220 8% 62%)" }}>{row.label}</span>
                  </p>
                </div>
              );
            })}

            <div className="now-timeline-line now-timeline-anim flex items-start gap-2.5 pb-1 pt-0.5 sm:gap-3">
              <div className="flex w-7 shrink-0 justify-center sm:w-8">
                <span
                  className="font-mono-era text-[13px] leading-none sm:text-base"
                  style={{ color: "hsl(220 12% 48%)" }}
                  aria-hidden
                >
                  ↓
                </span>
              </div>
              <div className="font-mono-era text-[9px] uppercase tracking-[0.18em] sm:text-[10px]" style={{ color: "hsl(220 10% 42%)" }}>
                You are here
              </div>
            </div>

            {showYou && (
              <div className="now-timeline-you flex items-center gap-2.5 opacity-0 sm:gap-3">
                <div className="flex w-7 shrink-0 justify-center sm:w-8">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full sm:h-3.5 sm:w-3.5"
                    style={{
                      background: "hsl(142 78% 58%)",
                      boxShadow:
                        "0 0 0 2px hsl(220 18% 7%), 0 0 16px hsl(142 85% 55% / 0.55)",
                    }}
                  />
                </div>
                <div
                  className="font-mono-era text-[20px] font-bold leading-none tracking-tight sm:text-[24px]"
                  style={{ color: "hsl(142 78% 62%)" }}
                >
                  YOU
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas network */}
      <div className="mt-6 px-4 sm:mt-10 sm:px-6">
        <p
          className="mb-3 text-center font-mono-era text-[10px] tracking-[2px] sm:mb-4 sm:text-[10px]"
          style={{ color: "hsl(220 8% 35%)" }}
        >
          <span className="hidden sm:inline">MOVE YOUR CURSOR TO JOIN THE NETWORK</span>
          <span className="sm:hidden">TOUCH TO JOIN THE NETWORK</span>
        </p>
        <canvas
          ref={canvasRef}
          className="h-[min(55vh,360px)] w-full sm:h-[min(55vh,380px)] md:h-[60vh]"
          style={{ touchAction: "pan-y" }}
          aria-label="Interactive network visualization. Move your finger or cursor to become a node in the network."
          role="img"
        />
        <div className="text-center mt-6">
          <span
            ref={nodeTextRef}
            className="font-mono-era text-[14px] font-semibold sm:text-[18px]"
            style={{ color: "hsl(142 70% 65%)", opacity: 0 }}
          >
            You are node #5,400,000,001
          </span>
        </div>
      </div>
    </section>
  );
}
