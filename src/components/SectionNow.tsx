import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_LINES = [
  "1969 — 4 nodes",
  "1983 — TCP/IP standardized",
  "1991 — Web born, gifted freely",
  "1995 — First online purchase",
  "2004 — Social graphs emerge",
  "2012 — Mobile majority",
  "2026 — 5.4 billion connected",
  "       ↓",
];

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function SectionNow() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeTextRef = useRef<HTMLSpanElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number>(0);
  const [showYou, setShowYou] = useState(false);

  // Counter animation
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

      // Stagger timeline lines
      gsap.from(".now-timeline-line", {
        opacity: 0,
        stagger: 0.12,
        duration: 0.3,
        scrollTrigger: { trigger: ".now-timeline", start: "top 75%" },
        onComplete: () => setTimeout(() => setShowYou(true), 800),
      });

      // "You are node" text — fade in 2s after canvas enters viewport
      ScrollTrigger.create({
        trigger: canvasRef.current,
        start: "top 60%",
        onEnter: () => {
          gsap.fromTo(
            nodeTextRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, delay: 2 }
          );
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Canvas network
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const nodeCount = Math.min(60, Math.floor(rect.width / 15));
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

      const maxDist = 100;
      ctx.strokeStyle = "hsla(142, 60%, 50%, 0.08)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = "hsla(142, 60%, 50%, 0.3)";
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      if (mouse.x > 0 && mouse.y > 0) {
        const distances = nodes.map((n, i) => ({
          i,
          dist: Math.sqrt((n.x - mouse.x) ** 2 + (n.y - mouse.y) ** 2),
        })).sort((a, b) => a.dist - b.dist);

        ctx.strokeStyle = "hsla(142, 70%, 65%, 0.3)";
        ctx.lineWidth = 1;
        for (let k = 0; k < Math.min(3, distances.length); k++) {
          const n = nodes[distances[k].i];
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }

        ctx.fillStyle = "hsl(142, 70%, 65%)";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          initCanvas();
          observer.disconnect();
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
      className="py-16 md:py-[120px]"
      style={{ backgroundColor: "hsl(220 18% 7%)" }}
    >
      {/* Counter */}
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 sm:min-h-[60vh] sm:px-6">
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
        <p className="mt-6 max-w-[min(100%,520px)] text-center font-serif-era text-[18px] font-semibold italic leading-[1.4] sm:text-[20px] md:text-[22px]" style={{ color: "hsl(220 8% 92%)" }}>
          All of them reached here through a message that lost its third letter in 1969.
        </p>
      </div>

      {/* Terminal recap */}
      <div className="now-timeline mx-auto mt-12 max-w-[480px] px-4 sm:mt-16 sm:px-6">
        {TIMELINE_LINES.map((line, i) => (
          <div key={i} className="now-timeline-line font-mono-era text-[11px] leading-[1.9] sm:text-[13px] sm:leading-[2]" style={{ color: "hsl(220 5% 52%)" }}>
            {line}
          </div>
        ))}
        {showYou && (
          <div className="mt-1 font-mono-era text-[16px] font-semibold sm:text-[20px]" style={{ color: "hsl(142 70% 65%)" }}>
            YOU
          </div>
        )}
      </div>

      {/* Canvas network */}
      <div className="mt-12 px-4 sm:mt-20 sm:px-6">
        <canvas
          ref={canvasRef}
          className="h-[min(42vh,260px)] w-full touch-none sm:h-[min(48vh,340px)] md:h-[60vh]"
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
