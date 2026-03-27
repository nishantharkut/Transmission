import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealHeadingProps {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  triggerStart?: string;
  stagger?: number;
  duration?: number;
}

export default function RevealHeading({
  text,
  as: Tag = "h2",
  className,
  style,
  triggerStart = "top 82%",
  stagger = 0.03,
  duration = 0.55,
}: RevealHeadingProps) {
  const containerRef = useRef<HTMLElement>(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".rh-word"), {
        y: "100%",
        stagger,
        duration,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: triggerStart },
      });
    }, el);

    return () => ctx.revert();
  }, [triggerStart, stagger, duration]);

  return (
    <Tag ref={containerRef} className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <span className="rh-word" style={{ display: "inline-block" }}>
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
