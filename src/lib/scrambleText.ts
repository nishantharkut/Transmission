const GLYPHS = "█▓░▒!@#$%&*<>{}[]01?/\\|~^";

export interface ScrambleOptions {
  /** Total duration in ms (default 800) */
  duration?: number;
  /** Characters to cycle through (default: GLYPHS) */
  chars?: string;
  /** Delay before starting in ms (default 0) */
  delay?: number;
}

/**
 * Scramble-decode effect: cycles element text through random glyphs
 * before revealing the real text character-by-character.
 */
export function scrambleText(
  el: HTMLElement,
  finalText: string,
  opts: ScrambleOptions = {}
): { cancel: () => void } {
  const { duration = 800, chars = GLYPHS, delay = 0 } = opts;
  const len = finalText.length;
  let rafId = 0;
  const startTime = performance.now() + delay;

  const update = (now: number) => {
    if (now < startTime) {
      rafId = requestAnimationFrame(update);
      return;
    }

    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const resolved = Math.floor(progress * len);

    let output = "";
    for (let i = 0; i < len; i++) {
      if (i < resolved) {
        output += finalText[i];
      } else if (finalText[i] === " ") {
        output += " ";
      } else {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    el.textContent = output;

    if (progress < 1) {
      rafId = requestAnimationFrame(update);
    } else {
      el.textContent = finalText;
    }
  };

  rafId = requestAnimationFrame(update);

  return {
    cancel: () => cancelAnimationFrame(rafId),
  };
}
