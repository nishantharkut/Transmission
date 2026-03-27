import { useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";

export interface SignalDisruptionHandle {
  fire: () => void;
}

const SignalDisruption = forwardRef<SignalDisruptionHandle>((_props, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  useImperativeHandle(ref, () => ({
    fire: () => {
      if (running.current) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      running.current = true;

      const overlay = overlayRef.current;
      const scan = scanRef.current;
      const main = document.querySelector("main");
      if (!overlay || !scan) { running.current = false; return; }

      const tl = gsap.timeline({ onComplete: () => { running.current = false; } });

      // Scanline sweeps top to bottom
      tl.set(scan, { opacity: 0.6, top: "0%" });
      tl.to(scan, { top: "100%", duration: 0.15, ease: "none" });
      tl.set(scan, { opacity: 0 });

      // Micro horizontal displacement on main content
      if (main) {
        tl.to(main, { x: 4, duration: 0.03, ease: "none" }, 0);
        tl.to(main, { x: -3, duration: 0.03, ease: "none" }, 0.03);
        tl.to(main, { x: 2, duration: 0.03, ease: "none" }, 0.06);
        tl.to(main, { x: 0, duration: 0.03, ease: "none" }, 0.09);
      }

      // Brief white flash
      tl.to(overlay, { opacity: 0.04, duration: 0.05, ease: "none" }, 0);
      tl.to(overlay, { opacity: 0, duration: 0.1, ease: "power1.out" }, 0.06);
    },
  }));

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[150]"
      style={{ opacity: 0, backgroundColor: "white" }}
      aria-hidden="true"
    >
      <div
        ref={scanRef}
        className="absolute left-0 right-0 h-[2px]"
        style={{
          opacity: 0,
          background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 75%, transparent 95%)",
          boxShadow: "0 0 10px rgba(255,255,255,0.25)",
        }}
      />
    </div>
  );
});

SignalDisruption.displayName = "SignalDisruption";
export default SignalDisruption;
