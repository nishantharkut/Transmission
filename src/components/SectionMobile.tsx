import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const APP_ICONS = [
  { bg: "linear-gradient(135deg, hsl(211 100% 55%), hsl(211 100% 40%))", label: "Social", icon: "◉" },
  { bg: "linear-gradient(135deg, hsl(145 65% 48%), hsl(145 65% 35%))", label: "Messages", icon: "💬" },
  { bg: "linear-gradient(135deg, hsl(350 80% 58%), hsl(350 80% 42%))", label: "Photos", icon: "◐" },
  { bg: "linear-gradient(135deg, hsl(30 95% 55%), hsl(15 90% 50%))", label: "Music", icon: "♪" },
  { bg: "linear-gradient(135deg, hsl(270 65% 58%), hsl(270 65% 42%))", label: "News", icon: "▤" },
  { bg: "linear-gradient(135deg, hsl(190 75% 50%), hsl(190 75% 38%))", label: "Maps", icon: "◇" },
  { bg: "linear-gradient(135deg, hsl(0 0% 25%), hsl(0 0% 12%))", label: "Camera", icon: "⦿" },
  { bg: "linear-gradient(135deg, hsl(340 85% 55%), hsl(340 85% 40%))", label: "Mail", icon: "✉" },
  { bg: "linear-gradient(135deg, hsl(125 50% 48%), hsl(125 50% 35%))", label: "Phone", icon: "✆" },
];

const FEED_ITEMS = [
  { name: "Sarah Chen", handle: "@sarchen", text: "Just redesigned our entire product in flat design. Skeuomorphism is dead 💀", time: "2m", lines: 2, likes: 147, retweets: 23, saves: 8 },
  { name: "Marcus Webb", handle: "@mwebb", text: "10 million downloads in the first weekend. The app store changed everything.", time: "8m", lines: 2, likes: 89, retweets: 12, saves: 3 },
  { name: "Lena Torres", handle: "@lenatorres", text: "Swipe right, swipe left. The gesture is the interface now.", time: "14m", lines: 1, likes: 203, retweets: 31, saves: 11 },
  { name: "David Park", handle: "@dpark", text: "Your phone knows where you are, who you're with, and what you want for dinner. Is that convenient or terrifying?", time: "22m", lines: 3, likes: 56, retweets: 8, saves: 4 },
  { name: "Amara Osei", handle: "@amarao", text: "Stories disappear in 24 hours. But the attention is permanent.", time: "31m", lines: 1, likes: 178, retweets: 42, saves: 15 },
  { name: "Jin Tanaka", handle: "@jint", text: "We don't scroll anymore. The feed scrolls us.", time: "45m", lines: 1, likes: 312, retweets: 67, saves: 9 },
];

export default function SectionMobile() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [showBadges, setShowBadges] = useState(false);
  const [visibleCards, setVisibleCards] = useState(2);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: "top top",
          end: () => (window.innerWidth < 768 ? "+=120%" : "+=150%"),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const cards = Math.min(FEED_ITEMS.length, Math.floor(2 + progress * (FEED_ITEMS.length - 1)));
            setVisibleCards(cards);
          },
        },
      });

      tl.from(phoneRef.current, { x: 56, opacity: 0, duration: 0.5 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (feedContainerRef.current && visibleCards > 2) {
      const scrollAmount = (visibleCards - 2) * 68;
      gsap.to(feedContainerRef.current, {
        y: -scrollAmount,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [visibleCards]);

  useEffect(() => {
    if (!showBadges) return;
    const badges = document.querySelectorAll(".app-badge");
    badges.forEach((badge, i) => {
      gsap.fromTo(badge, { scale: 0 }, { scale: 1, delay: i * 0.15, duration: 0.25, ease: "back.out(3)" });
    });
    return () => {
      badges.forEach((badge) => gsap.set(badge, { scale: 0 }));
    };
  }, [showBadges]);

  return (
    <section ref={sectionRef} data-era="mobile">
      <div
        ref={pinnedRef}
        className="relative flex min-h-dvh items-center"
        style={{ backgroundColor: "hsl(0 0% 97%)" }}
      >
        <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-4 px-4 py-4 sm:gap-10 sm:py-8 md:grid-cols-2 md:gap-16 md:py-0 sm:px-6">
          {/* Left text */}
          <div>
            <div className="font-mono-era text-[10px] mb-4" style={{ color: "hsl(0 0% 60%)", letterSpacing: "2px" }}>
              ERA 04 · MOBILE & SOCIAL
            </div>
            <h2
              className="font-serif-era font-semibold text-[20px] sm:text-[22px] md:text-[36px] leading-[1.15] mb-3 sm:mb-6"
              style={{ color: "hsl(0 0% 13%)" }}
            >
              The phone became the web. The feed became the thought.
            </h2>
            <p className="font-ui-era text-[15px] max-w-[420px] leading-[1.7]" style={{ color: "hsl(0 0% 45%)" }}>
              By 2020, the average person touched their phone 2,617 times a day. The internet had stopped being a place you visited.
            </p>
            <div className="mt-6 flex flex-wrap gap-8 sm:mt-8 sm:gap-12">
              <div>
                <div className="font-mono-era font-bold text-[28px]" style={{ color: "hsl(0 0% 13%)" }}>2,617</div>
                <div className="font-ui-era text-[11px] mt-1" style={{ color: "hsl(0 0% 55%)" }}>daily touches</div>
              </div>
              <div>
                <div className="font-mono-era font-bold text-[28px]" style={{ color: "hsl(0 0% 13%)" }}>3.5B</div>
                <div className="font-ui-era text-[11px] mt-1" style={{ color: "hsl(0 0% 55%)" }}>smartphone users</div>
              </div>
            </div>
          </div>

          {/* Right: Phone wireframe */}
          <div className="flex justify-center">
            <div
              ref={phoneRef}
              className="relative w-full max-w-[260px] cursor-pointer touch-manipulation"
              onMouseEnter={() => setShowBadges(true)}
              onMouseLeave={() => setShowBadges(false)}
              onClick={() => {
                if (window.matchMedia("(hover: none)").matches) setShowBadges((v) => !v);
              }}
            >
              {/* Phone frame SVG — refined proportions */}
              <svg viewBox="0 0 260 540" fill="none" className="w-full" aria-label="Phone wireframe showing mobile apps. Hover to see notifications.">
                {/* Outer body with subtle shadow */}
                <defs>
                  <filter id="phoneShadow" x="-10%" y="-5%" width="120%" height="110%">
                    <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="hsl(0 0% 0%)" floodOpacity="0.08" />
                  </filter>
                </defs>
                <rect x="1" y="1" width="258" height="538" rx="40" fill="hsl(0 0% 98%)" stroke="hsl(0 0% 82%)" strokeWidth="1.5" filter="url(#phoneShadow)" />
                {/* Inner screen */}
                <rect x="8" y="8" width="244" height="524" rx="36" fill="hsl(0 0% 97%)" />
                {/* Dynamic Island */}
                <rect x="88" y="14" width="84" height="24" rx="12" fill="hsl(0 0% 8%)" />
                {/* Side button */}
                <rect x="258" y="120" width="2" height="40" rx="1" fill="hsl(0 0% 78%)" />
                <rect x="258" y="180" width="2" height="24" rx="1" fill="hsl(0 0% 78%)" />
                {/* Home indicator */}
                <rect x="95" y="518" width="70" height="4" rx="2" fill="hsl(0 0% 72%)" />
              </svg>

              {/* Status bar */}
              <div className="absolute top-[14px] left-[20px] right-[20px] flex justify-between items-center px-2" style={{ height: 24 }}>
                <span className="font-ui-era font-semibold text-[11px]" style={{ color: "hsl(0 0% 8%)" }}>9:41</span>
                <div className="flex items-center gap-1">
                  {/* Signal bars */}
                  <svg width="16" height="10" viewBox="0 0 16 10">
                    <rect x="0" y="7" width="3" height="3" rx="0.5" fill="hsl(0 0% 15%)" />
                    <rect x="4" y="5" width="3" height="5" rx="0.5" fill="hsl(0 0% 15%)" />
                    <rect x="8" y="3" width="3" height="7" rx="0.5" fill="hsl(0 0% 15%)" />
                    <rect x="12" y="0" width="3" height="10" rx="0.5" fill="hsl(0 0% 15%)" />
                  </svg>
                  {/* Battery */}
                  <svg width="22" height="10" viewBox="0 0 22 10">
                    <rect x="0" y="1" width="18" height="8" rx="2" stroke="hsl(0 0% 20%)" strokeWidth="1" fill="none" />
                    <rect x="2" y="3" width="14" height="4" rx="1" fill="hsl(0 0% 20%)" />
                    <rect x="19" y="3" width="2" height="4" rx="1" fill="hsl(0 0% 20%)" />
                  </svg>
                </div>
              </div>

              {/* App grid */}
              <div className="absolute top-[50px] left-[18px] right-[18px] grid grid-cols-3 gap-x-3 gap-y-3 px-1">
                {APP_ICONS.map((app, i) => (
                  <div key={i} className="flex flex-col items-center gap-[3px] relative">
                    <div
                      className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center text-[18px]"
                      style={{
                        background: app.bg,
                        boxShadow: "0 2px 6px hsla(0, 0%, 0%, 0.12)",
                        color: "hsl(0 0% 100%)",
                      }}
                    >
                      {app.icon}
                    </div>
                    {showBadges && i < 5 && (
                      <div
                        className="app-badge absolute -top-[3px] -right-[2px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold px-1"
                        style={{
                          backgroundColor: "hsl(0 75% 52%)",
                          color: "white",
                          transform: "scale(0)",
                          boxShadow: "0 1px 3px hsla(0, 0%, 0%, 0.2)",
                        }}
                      >
                        {[3, 12, 1, 7, 24][i]}
                      </div>
                    )}
                    <span className="text-[9px] font-ui-era" style={{ color: "hsl(0 0% 40%)" }}>{app.label}</span>
                  </div>
                ))}
              </div>

              {/* Feed area — below app grid */}
              <div
                className="absolute left-[14px] right-[14px] overflow-hidden"
                style={{ top: 288, height: 218, borderRadius: 12 }}
              >
                <div ref={feedContainerRef} className="space-y-[2px]">
                  {FEED_ITEMS.slice(0, visibleCards).map((item, n) => (
                    <div
                      key={n}
                      className="flex items-start gap-2.5 px-3 py-3"
                      style={{
                        backgroundColor: "hsl(0 0% 100%)",
                        borderBottom: n < visibleCards - 1 ? "1px solid hsl(0 0% 92%)" : "none",
                      }}
                    >
                      {/* Avatar with initial */}
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold"
                        style={{
                          background: APP_ICONS[n % APP_ICONS.length].bg,
                          color: "white",
                        }}
                      >
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-ui-era font-semibold text-[11px]" style={{ color: "hsl(0 0% 10%)" }}>
                            {item.name}
                          </span>
                          <span className="font-ui-era text-[10px]" style={{ color: "hsl(0 0% 55%)" }}>
                            {item.handle}
                          </span>
                          <span className="font-ui-era text-[10px] ml-auto" style={{ color: "hsl(0 0% 65%)" }}>
                            {item.time}
                          </span>
                        </div>
                        <p className="font-ui-era text-[10px] leading-[1.5] mt-0.5" style={{ color: "hsl(0 0% 25%)" }}>
                          {item.text}
                        </p>
                        {/* Engagement row */}
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className="text-[9px]" style={{ color: "hsl(0 0% 55%)" }}>♡ {item.likes}</span>
                          <span className="text-[9px]" style={{ color: "hsl(0 0% 55%)" }}>↺ {item.retweets}</span>
                          <span className="text-[9px]" style={{ color: "hsl(0 0% 55%)" }}>◩ {item.saves}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
