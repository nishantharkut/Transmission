import { useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";

export interface SignalDisruptionHandle {
  fire: () => void;
}

const SignalDisruption = forwardRef<SignalDisruptionHandle>((_props, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const rgbRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  useImperativeHandle(ref, () => ({
    fire: () => {
      if (running.current) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      running.current = true;

      const overlay = overlayRef.current;
      const rgb = rgbRef.current;
      if (!overlay) { running.current = false; return; }

      const tl = gsap.timeline({ onComplete: () => { running.current = false; } });

      // 1. Chromatic aberration - RGB split
      if (rgb) {
        tl.set(rgb, { opacity: 1 }, 0);
        tl.to(rgb, {
          x: 3,
          duration: 0.04,
          ease: "none",
        }, 0);
        tl.to(rgb, {
          x: -2,
          duration: 0.04,
          ease: "none",
        }, 0.04);
        tl.to(rgb, {
          x: 0,
          opacity: 0,
          duration: 0.06,
          ease: "power1.out",
        }, 0.08);
      }

      // 2. Screen shake on #root, then clear transform
      const root = document.getElementById("root");
      if (root) {
        tl.to(root, {
          x: "random(-3, 3)",
          y: "random(-2, 2)",
          duration: 0.03,
          repeat: 3,
          yoyo: true,
          ease: "none",
        }, 0.02);
        tl.set(root, { clearProps: "transform" }, 0.16);
      }
    },
  }));

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[150]"
      style={{ opacity: 0, backgroundColor: "transparent" }}
      aria-hidden="true"
    >
      {/* Chromatic aberration layer - red-tinted offset */}
      <div
        ref={rgbRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          background: "linear-gradient(90deg, rgba(255,0,0,0.06) 0%, transparent 40%, transparent 60%, rgba(0,100,255,0.06) 100%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
});

SignalDisruption.displayName = "SignalDisruption";
export default SignalDisruption;
