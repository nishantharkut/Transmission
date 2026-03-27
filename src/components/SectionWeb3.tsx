import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BORDER = "rgba(255,255,255,0.07)";
/** Row highlight while connecting — neutral (amber reserved for warnings only). */
const ROW_ACTIVE_DIM = "hsla(220, 12%, 48%, 0.14)";
/** Ethereum / Etherscan — block numbers & chart (not amber) */
const ETH_PERIWINKLE = "hsl(226 79% 66%)";
const SPINNER = ["|", "/", "-", "\\"] as const;

const WALLETS = [
  { id: "mm", initial: "M", name: "MetaMask" },
  { id: "wc", initial: "W", name: "WalletConnect" },
  { id: "cb", initial: "C", name: "Coinbase Wallet" },
];

/** Per-wallet avatar colors on the connect modal. */
const WALLET_AVATAR_STYLES: { background: string; color: string; border: string }[] = [
  { background: "hsl(27 91% 18%)", color: "hsl(27 91% 53%)", border: "1px solid hsl(27 91% 30%)" },
  { background: "hsl(211 85% 16%)", color: "hsl(211 100% 62%)", border: "1px solid hsl(211 85% 28%)" },
  { background: "hsl(226 79% 16%)", color: "hsl(226 79% 66%)", border: "1px solid hsl(226 79% 28%)" },
];

function formatBlock(n: number) {
  return `#${n.toLocaleString("en-US")}`;
}

function randTx() {
  return 8 + Math.floor(Math.random() * 17);
}

/** ETH/USD-style polyline in section viewBox units (approx. 2021–2022). */
const CHART_POINTS = "0,38 8,35 18,28 28,12 38,6 48,14 58,22 68,18 78,26 88,30 100,28";

export default function SectionWeb3() {
  const sectionRef = useRef<HTMLElement>(null);
  const act1Ref = useRef<HTMLDivElement>(null);
  const act2Ref = useRef<HTMLDivElement>(null);
  const firstBlockRowRef = useRef<HTMLDivElement>(null);
  const mempoolDotRef = useRef<HTMLSpanElement>(null);

  const [modalPhase, setModalPhase] = useState<"idle" | "connecting" | "error">("idle");
  const [connectingRow, setConnectingRow] = useState<number | null>(null);
  const [spinnerFrame, setSpinnerFrame] = useState(0);

  const [act2Revealed, setAct2Revealed] = useState(false);
  const [sectionPaused, setSectionPaused] = useState(true);
  const prevBlockTopRef = useRef<number | null>(null);

  const [blocks, setBlocks] = useState(() => {
    const top = 19847293;
    return Array.from({ length: 5 }, (_, i) => ({
      n: top - i,
      tx: randTx(),
    }));
  });

  const [gasGwei, setGasGwei] = useState(34);
  const [mempoolCycle, setMempoolCycle] = useState(0);
  const [mempoolPhase, setMempoolPhase] = useState<"pending" | "failed">("pending");

  const connectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinnerIvRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => setSectionPaused(!self.isActive),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const act2 = act2Ref.current;
    if (!act2) return;
    const st = ScrollTrigger.create({
      trigger: act2,
      start: "top 70%",
      once: true,
      onEnter: () => setAct2Revealed(true),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const act1 = act1Ref.current;
    const act2 = act2Ref.current;
    if (!section || !act1 || !act2) return;

    const ctx = gsap.context(() => {
      const mq = reducedMotion.current;
      const dur = (n: number) => (mq ? 0.01 : n);

      gsap.from(act1.querySelectorAll(".web3-act1-quote, .web3-wallet-wrap"), {
        y: (i) => (i === 0 ? 30 : 24),
        opacity: 0,
        duration: dur(0.7),
        delay: (i) => (i === 0 ? 0 : 0.2),
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(act2.querySelectorAll(".web3-act2-cell"), {
        y: 16,
        opacity: 0,
        stagger: mq ? 0 : 0.15,
        duration: dur(0.5),
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (mempoolPhase !== "pending") return;
    const dot = mempoolDotRef.current;
    if (!dot || reducedMotion.current) return;
    const t = gsap.to(dot, { opacity: 0, repeat: -1, yoyo: true, duration: 0.45, ease: "power1.inOut" });
    return () => {
      t.kill();
    };
  }, [mempoolPhase]);

  useEffect(() => {
    if (modalPhase !== "connecting" || connectingRow === null) {
      if (spinnerIvRef.current) {
        clearInterval(spinnerIvRef.current);
        spinnerIvRef.current = null;
      }
      return;
    }
    spinnerIvRef.current = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % 4);
    }, 120);
    connectTimerRef.current = setTimeout(() => {
      if (spinnerIvRef.current) {
        clearInterval(spinnerIvRef.current);
        spinnerIvRef.current = null;
      }
      setModalPhase("error");
    }, 2200);
    return () => {
      if (spinnerIvRef.current) {
        clearInterval(spinnerIvRef.current);
        spinnerIvRef.current = null;
      }
      if (connectTimerRef.current) clearTimeout(connectTimerRef.current);
    };
  }, [modalPhase, connectingRow]);

  useEffect(() => {
    if (modalPhase !== "error") {
      if (errorResetRef.current) clearTimeout(errorResetRef.current);
      return;
    }
    errorResetRef.current = setTimeout(() => {
      setModalPhase("idle");
      setConnectingRow(null);
    }, 1800);
    return () => {
      if (errorResetRef.current) clearTimeout(errorResetRef.current);
    };
  }, [modalPhase]);

  const onWalletClick = (i: number) => {
    if (modalPhase !== "idle") return;
    setConnectingRow(i);
    setModalPhase("connecting");
    setSpinnerFrame(0);
  };

  const onTryAgain = () => {
    if (errorResetRef.current) clearTimeout(errorResetRef.current);
    setModalPhase("idle");
    setConnectingRow(null);
  };

  const runFeed = act2Revealed && !sectionPaused;

  useEffect(() => {
    if (!runFeed) return;
    const id = setInterval(() => {
      setBlocks((prev) => {
        const nextN = prev[0].n + 1;
        const next = [{ n: nextN, tx: randTx() }, ...prev].slice(0, 5);
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [runFeed]);

  useLayoutEffect(() => {
    if (!runFeed || reducedMotion.current) return;
    const top = blocks[0]?.n;
    if (top === undefined) return;
    if (prevBlockTopRef.current === null) {
      prevBlockTopRef.current = top;
      return;
    }
    if (prevBlockTopRef.current === top) return;
    prevBlockTopRef.current = top;
    const row = firstBlockRowRef.current;
    if (!row) return;
    gsap.fromTo(row, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
  }, [blocks[0]?.n, runFeed]);

  useEffect(() => {
    if (!runFeed) return;
    const id = setInterval(() => {
      setGasGwei((g) => g + 0.1 + Math.random() * 0.7);
    }, 800);
    return () => clearInterval(id);
  }, [runFeed]);

  useEffect(() => {
    if (!runFeed) return;
    setGasGwei(34);
    setMempoolPhase("pending");
    const fail = setTimeout(() => setMempoolPhase("failed"), 8000);
    return () => clearTimeout(fail);
  }, [runFeed, mempoolCycle]);

  useEffect(() => {
    if (!runFeed || mempoolPhase !== "failed") return;
    const reset = setTimeout(() => setMempoolCycle((c) => c + 1), 2000);
    return () => clearTimeout(reset);
  }, [runFeed, mempoolPhase]);

  const gasDisplay = gasGwei.toFixed(1);
  const gasHigh = gasGwei > 50;
  const feeUsd = (gasGwei * 2.37).toFixed(2);

  return (
    <section
      ref={sectionRef}
      data-era="web3"
      className="min-h-screen py-[100px] pb-16"
      style={{
        background: `radial-gradient(ellipse 65% 45% at 50% 25%, hsla(252, 55%, 45%, 0.055), transparent 70%), hsl(var(--bg))`,
      }}
    >
      <div className="mx-auto max-w-[900px] px-6">
        {/* Act 1 */}
        <div ref={act1Ref}>
          <p
            className="font-mono-era text-center text-[10px] font-normal tracking-[3px]"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            ERA 4.5
          </p>
          <blockquote
            className="web3-act1-quote mx-auto mt-4 max-w-[680px] text-center font-serif-era text-[28px] font-bold italic leading-[1.1] sm:text-[46px]"
            style={{
              fontVariationSettings: "'opsz' 72, 'wght' 700",
              color: "hsl(var(--text))",
            }}
          >
            The internet forgot who built it. Web3 promised to remember.
          </blockquote>

          <div className="web3-wallet-wrap mx-auto mt-12 max-w-[420px]">
            {modalPhase === "error" ? (
              <div
                className="overflow-hidden rounded-2xl"
                style={{ backgroundColor: "hsl(var(--bg-raised))", border: `1px solid ${BORDER}` }}
              >
                <div
                  className="flex items-center justify-between border-b px-6 py-5"
                  style={{ borderColor: BORDER }}
                >
                  <span className="font-ui-era text-[15px] font-medium" style={{ color: "hsl(0 90% 65%)" }}>
                    Connection Failed
                  </span>
                  <span className="font-ui-era text-[18px] font-normal cursor-default" style={{ color: "hsl(var(--text-dim))" }}>
                    ×
                  </span>
                </div>
                <div className="px-6 py-8 text-center">
                  <p className="font-ui-era mx-auto max-w-[280px] text-[13px] font-normal leading-snug" style={{ color: "hsl(var(--text-dim))" }}>
                    Unable to connect. Make sure your wallet extension is installed and unlocked.
                  </p>
                  <button
                    type="button"
                    className="font-ui-era mt-6 w-full rounded-[10px] px-4 py-3 text-[14px] font-medium transition-colors"
                    style={{
                      border: `1px solid ${BORDER}`,
                      color: "hsl(var(--text))",
                      backgroundColor: "transparent",
                    }}
                    onClick={onTryAgain}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="overflow-hidden rounded-2xl"
                style={{ backgroundColor: "hsl(var(--bg-raised))", border: `1px solid ${BORDER}` }}
              >
                <div
                  className="flex items-center justify-between px-6 py-5"
                  style={{ borderBottom: `1px solid ${BORDER}` }}
                >
                  <span
                    className="font-display-era text-[15px] font-semibold"
                    style={{ fontStretch: "100%", color: "hsl(var(--text))" }}
                  >
                    Connect a Wallet
                  </span>
                  <span
                    className="font-ui-era cursor-default text-[18px] font-normal"
                    style={{ color: "hsl(var(--text-dim))" }}
                    aria-hidden
                  >
                    ×
                  </span>
                </div>
                <div className="p-3">
                  {WALLETS.map((w, i) => (
                    <button
                      key={w.id}
                      type="button"
                      className={`mb-1 flex w-full cursor-pointer items-center rounded-[10px] px-[14px] py-3 text-left transition-colors last:mb-0 ${
                        modalPhase === "idle" ? "hover:bg-[hsla(220,12%,42%,0.12)]" : ""
                      }`}
                      style={{
                        backgroundColor:
                          modalPhase === "connecting" && connectingRow === i ? ROW_ACTIVE_DIM : undefined,
                      }}
                      onClick={() => onWalletClick(i)}
                      disabled={modalPhase !== "idle"}
                    >
                      <span
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg font-mono-era text-[14px] font-semibold"
                        style={WALLET_AVATAR_STYLES[i]}
                      >
                        {w.initial}
                      </span>
                      <span className="font-ui-era flex-1 px-3 text-[14px] font-medium" style={{ color: "hsl(var(--text))" }}>
                        {w.name}
                      </span>
                      <span className="font-ui-era text-[18px] font-light" style={{ color: "hsl(var(--text-dim))" }}>
                        {modalPhase === "connecting" && connectingRow === i ? SPINNER[spinnerFrame] : "›"}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="px-6 py-4 text-center" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <p className="font-ui-era text-[11px] font-normal" style={{ color: "hsl(var(--text-dim))" }}>
                    By connecting, you agree to{" "}
                    <span style={{ color: ETH_PERIWINKLE, textDecoration: "underline" }}>Terms of Service</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <p
            className="font-ui-era mt-7 text-center text-[13px] font-light italic"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            This was the onboarding experience for a $3 trillion market.
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-14 h-px" style={{ backgroundColor: BORDER }}>
          <span
            className="font-mono-era absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-[11px] font-normal"
            style={{ backgroundColor: "hsl(var(--bg))", color: "hsl(var(--text-dim))" }}
          >
            2014 — 2023
          </span>
        </div>

        {/* Act 2 */}
        <div ref={act2Ref} className="grid grid-cols-1 gap-px md:grid-cols-3" style={{ backgroundColor: BORDER, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Blocks */}
          <div className="web3-act2-cell bg-era p-5 md:p-[20px_18px]" style={{ backgroundColor: "hsl(var(--bg))" }}>
            <div className="font-mono-era mb-3 text-[9px] font-normal tracking-[2px]" style={{ color: "hsl(var(--text-dim))" }}>
              LATEST BLOCKS
            </div>
            {blocks.map((b, idx) => (
              <div
                key={b.n}
                ref={idx === 0 ? firstBlockRowRef : undefined}
                className="flex justify-between border-b py-1.5 font-mono-era last:border-b-0"
                style={{ borderColor: BORDER }}
              >
                <span className="text-[12px] font-medium" style={{ color: ETH_PERIWINKLE }}>
                  {formatBlock(b.n)}
                </span>
                <span className="text-[11px] font-normal" style={{ color: "hsl(var(--text-dim))" }}>
                  {b.tx} txns
                </span>
              </div>
            ))}
          </div>

          {/* Mempool */}
          <div className="web3-act2-cell bg-era p-5 md:p-[20px_18px]" style={{ backgroundColor: "hsl(var(--bg))" }}>
            <div className="font-mono-era mb-3 text-[9px] font-normal tracking-[2px]" style={{ color: "hsl(var(--text-dim))" }}>
              MEMPOOL
            </div>
            <div
              className="rounded-lg p-3"
              style={{ backgroundColor: "hsl(var(--bg-raised))", border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-mono-era text-[10px] font-medium tracking-[2px]"
                  style={{ color: mempoolPhase === "failed" ? "hsl(0 90% 65%)" : "hsl(var(--accent))" }}
                >
                  {mempoolPhase === "failed" ? "FAILED" : "PENDING"}
                </span>
                {mempoolPhase === "pending" && (
                  <span ref={mempoolDotRef} className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "hsl(var(--accent))" }} />
                )}
              </div>
              <div className="mt-2 space-y-1 font-ui-era text-[11px]">
                <div>
                  <span style={{ color: "hsl(var(--text-dim))" }}>From: </span>
                  <span className="font-mono-era font-medium" style={{ color: "hsl(var(--text))" }}>
                    0x4f3a…c91b
                  </span>
                </div>
                <div>
                  <span style={{ color: "hsl(var(--text-dim))" }}>To: </span>
                  <span className="font-mono-era font-medium" style={{ color: "hsl(var(--text))" }}>
                    0x8d2e…f47a
                  </span>
                </div>
                <div>
                  <span style={{ color: "hsl(var(--text-dim))" }}>Gas: </span>
                  <span
                    className="font-mono-era font-medium"
                    style={{
                      color: gasHigh ? "hsl(var(--accent))" : "hsl(var(--text-dim))",
                    }}
                  >
                    {gasDisplay} Gwei
                  </span>
                </div>
                <div>
                  <span style={{ color: "hsl(var(--text-dim))" }}>Est. fee: </span>
                  <span className="font-mono-era font-medium" style={{ color: "hsl(var(--text))" }}>
                    ${feeUsd}
                  </span>
                </div>
                {mempoolPhase === "failed" && (
                  <p className="font-mono-era pt-1 text-[10px] font-normal" style={{ color: "hsl(0 90% 65%)" }}>
                    Reason: out of gas
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="web3-act2-cell bg-era p-5 md:p-[20px_18px]" style={{ backgroundColor: "hsl(var(--bg))" }}>
            <div className="font-mono-era mb-3 text-[9px] font-normal tracking-[2px]" style={{ color: "hsl(var(--text-dim))" }}>
              ETH/USD
            </div>
            <svg className="h-20 w-full" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
              <polyline
                fill="none"
                stroke={ETH_PERIWINKLE}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={CHART_POINTS}
              />
            </svg>
            <div className="mt-3 flex justify-between gap-4">
              <div>
                <div className="font-mono-era text-[9px] font-normal tracking-[2px]" style={{ color: "hsl(var(--text-dim))" }}>
                  ATH
                </div>
                <div className="font-mono-era text-[18px] font-semibold" style={{ color: "hsl(160 60% 48%)" }}>
                  $4,891
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono-era text-[9px] font-normal tracking-[2px]" style={{ color: "hsl(var(--text-dim))" }}>
                  NOW
                </div>
                <div className="font-mono-era text-[18px] font-semibold" style={{ color: "hsl(0 90% 65%)" }}>
                  $1,197
                </div>
              </div>
            </div>
            <p className="font-mono-era mt-3 text-center text-[28px] font-bold" style={{ color: "hsl(0 90% 65%)" }}>
              -75.5%
            </p>
          </div>
        </div>

        <blockquote
          className="mx-auto mt-12 max-w-[560px] text-center font-serif-era text-[24px] font-semibold italic leading-[1.4]"
          style={{ fontVariationSettings: "'opsz' 72, 'wght' 600", color: "hsl(var(--text))" }}
        >
          The code worked. The wallets connected eventually. The blocks kept coming. The promise just never arrived for most people.
        </blockquote>
        <p
          className="font-mono-era mt-4 text-center text-[11px] font-medium tracking-[3px]"
          style={{ color: "hsl(var(--accent))" }}
        >
          THE PROMISE REMAINS UNRESOLVED
        </p>
      </div>
    </section>
  );
}
