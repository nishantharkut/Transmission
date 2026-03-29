

# Transmission

<img src="./public/transmission%20logo.png" alt="Transmission" width="80" align="center"/>

> An interactive history of the internet, told as a 60-year signal log.

**Frontend Odyssey 2026** — Theme 2: Evolution of the Internet
Solo submission — Nishant Harkut

**Live:** https://transmission-one.vercel.app/

**Repo:** https://github.com/nishantharkut/Transmission

---

# Project Description

Transmission is an interactive web experience built around Theme 2: Evolution of the Internet. Rather than presenting history as a forward-looking timeline, the project frames it as a declassified signal log. The user enters as a communications operator receiving dispatches from 60 years of internet history, starting with the two-letter message that crashed on ARPANET in 1969 and ending as an active node in a live network visualization.

The core design decision is era-shifting aesthetics. As the user scrolls, the page's own visual language transforms to match each period. The ARPANET section renders in phosphor-green terminal type. The early web switches to Times New Roman and hyperlink blue, referencing Tim Berners-Lee's original 1991 design. The dot-com era displays a live NASDAQ slider. The mobile era returns to flat white with a phone wireframe. Web3 shifts to purple-black with Ethereum periwinkle, including a wallet connect interaction that simulates the failure loop most users encountered. The medium becomes the narrative.

Built with React, TypeScript, Vite, and Tailwind CSS, the project uses GSAP ScrollTrigger for scroll-driven sequences, animated CSS custom properties for era transitions, a text scramble decoder for the transmission metaphor, and a Canvas 2D network visualization where the user's cursor becomes a live node. Performance is optimized through imperative DOM updates for scroll-driven values, React.memo boundaries to eliminate re-render cascades, and visibility-gated canvas rendering.

The experience ends with the user identified as node number 5,400,000,001. Everything before that was setup.

---

## The Concept

The first message ever sent on ARPANET was "LO".

The operator was trying to type "LOGIN". The system crashed after the
second character. The internet began with an incomplete sentence.

Transmission starts there and ends with the user becoming a node in the
network they just scrolled through. Each era renders in the visual
language of its time. The page redesigns itself as you read it.

---

## Theme

Evolution of the Internet — ARPANET to present day, framed as a
declassified transmission log rather than a forward-looking timeline.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + CSS Custom Properties (era palettes) |
| Animation | GSAP + ScrollTrigger + custom text scramble decoder |
| Scroll | Lenis smooth scroll, ticked via GSAP ticker |
| Visualization | Canvas 2D API (interactive network) |
| Performance | Imperative DOM refs, React.memo, visibility-gated RAF |

No Three.js. No image assets. No Lottie. No external icon libraries.
Everything rendered in code.

---

## Structure

Eight sections. One continuous narrative arc.

| Section | Era | Description |
|---|---|---|
| Boot Sequence | — | CRT terminal preloader. The "LO" message. Press any key to begin. |
| Hero | 1969 | The signal room. ARPANET node topology. Transmission log. |
| ERA 1 — ARPANET | 1969–1983 | Phosphor terminal. Animated packet log. Stat count-ups. |
| ERA 2 — WWW | 1991–1999 | Pinned scroll through CERN page, Netscape Navigator, Yahoo portal. |
| ERA 3 — Dot-Com | 2000–2011 | Stock ticker tape. Interactive NASDAQ bubble slider. The crash. |
| ERA 4 — Mobile | 2012–2020 | Phone wireframe with notification badges and social feed. |
| ERA 4.5 — Web3 | 2014–2023 | Wallet connect failure loop. Live block feed. Gas meter. |
| ERA 5 — Now | 2026 | 5.4 billion counter. Interactive canvas network. You are a node. |
| Close | — | Transmission receipt with scramble-decode. END TRANSMISSION. |

---

## Mandatory Requirements

| Requirement | Implementation |
|---|---|
| **Story structure (5+ sections)** | 8 sections forming a continuous narrative arc from 1969 to present |
| **Scroll interactions (2+)** | Pinned era transitions (Web1, Mobile), timeline rail fill, era palette blending, parallax ASCII background |
| **Interactive elements (3+)** | NASDAQ bubble slider, wallet connect failure loop, Canvas 2D network with cursor/touch node, phone badge toggle |
| **Animations (3+)** | CRT boot sequence, text scramble decoder, era color transitions, stat count-ups, packet animations, block feed, canvas network, RevealHeading word-lift, signal disruption on era change |
| **Responsive design** | Mobile, tablet, desktop. Safe-area insets. Touch-optimized. Reduced-motion fallback throughout. |

---

## Key Interactions

**NASDAQ Bubble Slider** — Drag/slide to replay the dot-com run-up and crash. SVG chart with gradient fill traces the NASDAQ from 1,000 to 5,048 to 1,114. Live counter updates in real-time.

**Wallet Connect Failure Loop** — Click any wallet (MetaMask, WalletConnect, Coinbase). Watch the spinner. Get "Connection Failed." Try again. This was the onboarding experience for a $3 trillion market.

**Canvas Network Visualization** — Move your cursor (or touch on mobile) to become a node in the network. Lines connect you to the nearest nodes. You are node #5,400,000,001.

**Text Scramble Decoder** — Key headings decode through random glyphs before resolving to their final text, reinforcing the "transmission being decoded" metaphor.

---

## Performance Architecture

Scroll-driven storytelling sites are notorious for jank. Transmission solves this at the architecture level:

- **Zero scroll-frame re-renders.** Scroll progress updates are pushed to Navbar and TimelineRail via `useImperativeHandle` refs with direct DOM manipulation. React never re-renders during scroll.
- **Memo-wrapped sections.** All 8 section components are wrapped in `React.memo()`. They receive zero props and never re-render from parent state changes.
- **Era transition guards.** A ref-based guard prevents duplicate `setActiveEra` calls when ScrollTrigger fires for the same era.
- **Visibility-gated canvas.** The Canvas 2D network pauses its `requestAnimationFrame` loop via `IntersectionObserver` when scrolled off-screen.
- **Mobile-optimized pins.** Pinned sections use `scrub: 0.5` and `anticipatePin: 1` on mobile for snappier, stutter-free pin entry/exit.
- **Reduced SVG filter cost.** Blur filters use constrained `filterUnits` and reduced `stdDeviation` values.

---

## Accessibility

- Skip-to-content link (visible on keyboard focus)
- Screen-reader-only `<h1>` with proper heading hierarchy
- `prefers-reduced-motion: reduce` disables all GSAP tweens and CSS animations
- All interactive elements keyboard-navigable (timeline rail, buttons)
- Focus management after preloader dismissal (moves focus to main content)
- Canvas network has `aria-label` and `role="img"`
- Preloader uses `role="dialog"` with `aria-live="polite"`
- Era-adaptive `::selection` colors for text highlighting
- `env(safe-area-inset-*)` throughout for notched devices

---

## Typography

| Font | Role |
|---|---|
| VT323 | CRT preloader terminal text |
| Crimson Pro | Editorial narration, historian voice, pull quotes |
| Anybody | Era headers, display text (width axis varies by period) |
| Geist Mono | Terminal output, timestamps, packet data, all numbers |
| IBM Plex Sans | UI chrome, navigation, interactive labels |

Font loading is non-render-blocking via `media="print" onload` pattern with `display=swap`. VT323 (preloader font) is preloaded for instant CRT terminal rendering.

---

## Design Decisions

**Era-shifting aesthetics.**
Most scroll storytelling sites maintain one visual language throughout. Transmission has eight, each historically accurate to the period it represents, each transitioning via GSAP-animated CSS custom properties. The ARPANET section is phosphor green on near-black. The WWW section is Times New Roman on warm grey. The mobile era is flat white. Web3 is purple-black with Ethereum periwinkle. The medium becomes the narrative.

**Phosphor green as the through-line.**
The `--signal` color (`hsl 142 70% 65%`) appears in every era as a constant. It is the color of the original terminal. It is also the color of the final network node the user becomes. One color, 60 years.

**No images.**
Every visual element is SVG, Canvas, or CSS. The wallet connect modal, the NASDAQ chart, the phone wireframe, the blockchain data feed, the network visualization — all rendered in code. Zero raster assets.

**Text as transmission.**
Key headings use a scramble-decode effect — characters cycle through random glyphs before resolving to the real text. This reinforces the core metaphor: you are receiving a transmission, and it is being decoded in front of you.

**Web3 treated as ERA 4.5.**
Web3 does not get a whole number. It sits between Mobile and Now, rendered in purple-black with the actual color identities of the protocols that defined it. The wallet connect interaction simulates the failure loop most users encountered. The section closes on amber: the promise remains unresolved.

**Gradient bridges with narrative markers.**
Transition zones between eras use multi-stop gradients with ghost-text labels ("FREQUENCY SHIFT", "SIGNAL REACQUIRED", "DECENTRALIZING", "CONVERGING") continuing the signal/transmission metaphor into the space between sections.

---

## Scoring Criteria

| Criterion | Weight | How It Is Addressed |
|---|---|---|
| Creativity & Storytelling | 30% | "LO" framing, era-shifting design, user becomes node 5,400,000,001, Web3 as unresolved, text scramble decoder, gradient narrative markers |
| Visual Design | 25% | Eight distinct visual languages, variable font axes, no stock assets, era-accurate color systems, era-adaptive `::selection`, CRT preloader |
| Animation & Interactivity | 20% | 45+ animations, GSAP ScrollTrigger with pinned sections, canvas cursor node, wallet failure loop, NASDAQ slider, stat count-ups, signal disruption, text scramble |
| Responsiveness | 15% | Mobile-first touch targets, safe-area insets, `anticipatePin` for smooth mobile pins, visibility-gated canvas, touch-action management, non-blocking font loading |
| Code Quality | 10% | Zero scroll-frame re-renders, imperative handles, React.memo boundaries, proper GSAP context scoping and cleanup, TypeScript throughout |

---

## Running Locally

```bash
git clone https://github.com/nishantharkut/Transmission
cd Transmission
npm install
npm run dev
```

Opens on `localhost:8000`.

---

## File Structure

```text
Transmission/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── transmission logo.png
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            Fixed navbar with imperative scroll handle
│   │   ├── Preloader.tsx         CRT terminal boot sequence
│   │   ├── RevealHeading.tsx     Scroll-triggered word-by-word reveal
│   │   ├── SectionArpanet.tsx    ERA 1 — terminal feed, packet SVG, stat count-ups
│   │   ├── SectionClosing.tsx    Transmission receipt with scramble-decode
│   │   ├── SectionDotCom.tsx     ERA 3 — ticker tape, NASDAQ slider, bubble chart
│   │   ├── SectionHero.tsx       Signal room, transmission log, ASCII parallax
│   │   ├── SectionMobile.tsx     ERA 4 — phone wireframe, social feed, badges
│   │   ├── SectionNow.tsx        ERA 5 — counter, timeline, canvas network
│   │   ├── SectionWeb1.tsx       ERA 2 — pinned CERN/Netscape/Yahoo recreation
│   │   ├── SectionWeb3.tsx       ERA 4.5 — wallet modal, blocks, mempool, ETH chart
│   │   ├── SignalDisruption.tsx   Scanline + flash on era transitions
│   │   └── TimelineRail.tsx      Desktop sidebar + mobile progress bar
│   ├── lib/
│   │   ├── scrambleText.ts       Text scramble-decode animation utility
│   │   └── utils.ts              Tailwind cn() merge utility
│   ├── pages/
│   │   └── Index.tsx             Main page — scroll orchestration, era state, memo wrappers
│   ├── App.tsx                   Root component
│   ├── index.css                 Global styles, era palettes, CRT styles, selection colors
│   ├── main.tsx                  Entry point
│   └── vite-env.d.ts            Vite type declarations
├── index.html                    Font loading, skip link, theme-color, preload hints
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

*Nishant Harkut — Frontend Odyssey 2026*
