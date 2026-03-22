

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
The core design decision is era-shifting aesthetics. As the user scrolls, the page's own visual language transforms to match each period. The ARPANET section renders in phosphor-green terminal type. The early web switches to Times New Roman and hyperlink blue, referencing Tim Berners-Lee's original 1991 design. The mobile era returns to flat white. Web3 shifts to purple-black with Ethereum periwinkle, including a wallet connect interaction that simulates the failure loop most users encountered. The medium becomes the narrative.
Built with React, TypeScript, Vite, and Tailwind CSS, the project uses GSAP ScrollTrigger for scroll-driven sequences, animated CSS custom properties for era transitions, and a Canvas 2D network visualization where the user's cursor becomes a live node.
Three interactions ship: a NASDAQ bubble slider tracing the dot-com crash, a wallet connect failure loop, and a live canvas network visualization. Responsive across all breakpoints with a reduced-motion fallback for accessibility.
Live at https://transmission-one.vercel.app/
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
| Framework | React + TypeScript + Vite |
| Styling | Tailwind CSS + CSS Custom Properties |
| Animation | GSAP + ScrollTrigger |
| Scroll | Lenis, ticked via GSAP ticker |
| Visualization | Canvas 2D API |

No Three.js. No image assets. No Lottie. No external icon libraries.
Everything rendered in code. Bundle under 500KB. Lighthouse 100.

---

## Structure

Eight sections. One continuous narrative arc.

| Section | Description |
|---|---|
| Boot sequence | Terminal preloader. The "LO" message. Cannot be skipped. |
| Hero | The signal room. ARPANET node topology. 1969. |
| ERA 1 — ARPANET | Phosphor terminal. Live packet log. 1969—1983. |
| ERA 2 — WWW | Pinned scroll through three design eras. 1991—1999. |
| ERA 3 — Dot-com | The bubble. The NASDAQ slider. The crash. 2000—2011. |
| ERA 4 — Mobile | The phone becomes the web. 2012—2020. |
| ERA 4.5 — Web3 | Chains, wallets, gas. The promise of ownership. 2014—2023. |
| ERA 5 — Now | 5.4 billion nodes. You are one of them. 2026. |
| Close | Transmission complete. |

---

## Mandatory Requirements

| Requirement | Implementation |
|---|---|
| Story structure | 8 sections, single continuous narrative arc |
| Scroll interactions | Pinned era transitions, timeline rail fill, CSS custom property era blending |
| Interactive elements | NASDAQ bubble slider, wallet connect failure loop, Canvas 2D network node |
| Animations | Boot sequence type-on, era color transitions, node counter, block feed, canvas |
| Responsive | Mobile, tablet, desktop. Reduced-motion fallback throughout. |

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

## Design Decisions

**Era-shifting aesthetics.**
The single most unconventional choice in the build. Most scroll
storytelling sites maintain one visual language throughout. Transmission
has eight, each historically accurate to the period it represents, each
transitioning via GSAP-animated CSS custom properties rather than
hard cuts. The ARPANET section is phosphor green on near-black. The WWW
section is Times New Roman on warm grey. The mobile era is flat white.
Web3 is purple-black with Ethereum periwinkle. The medium becomes
the narrative.

**Phosphor green as the through-line.**
The `--signal` color (`hsl 142 70% 65%`) appears in every era as a
constant. It is the color of the original terminal. It is also the color
of the final network node the user becomes. One color, 60 years.

**No images.**
Every visual element is SVG, Canvas, or CSS. The wallet connect modal,
the NASDAQ chart, the phone wireframe, the blockchain data feed, the
network visualization — all rendered in code. Zero raster assets.

**Web3 treated as ERA 4.5.**
Web3 does not get a whole number. It sits between Mobile and Now,
rendered in purple-black with the actual color identities of the
protocols that defined it. The wallet connect interaction simulates
the failure loop most users encountered. The ETH price chart uses
real ATH and crash figures. The section closes on amber: the promise
remains unresolved.

---

## Typography

| Font | Role |
|---|---|
| Crimson Pro | Editorial narration, historian voice, pull quotes |
| Anybody | Era headers, width axis varies by historical period |
| Geist Mono | Terminal output, timestamps, packet data, all numbers |
| IBM Plex Sans | UI chrome, navigation, interactive labels |

---

## Scoring Criteria

| Criterion | Weight | How It Is Addressed |
|---|---|---|
| Creativity & Storytelling | 30% | "LO" framing, era-shifting design, user becomes node 5,400,000,001, Web3 as unresolved |
| Visual Design | 25% | Eight distinct visual languages, variable font axes, no stock assets, era-accurate color systems |
| Animation & Interactivity | 20% | GSAP ScrollTrigger, two pinned sections, canvas cursor node, wallet failure loop, NASDAQ slider |
| Responsiveness | 15% | Three breakpoints, reduced-motion fallback, mobile bottom progress bar |
| Code Quality | 10% | Component-driven architecture, custom hooks, clean separation of concerns |

---

## Accessibility

- `prefers-reduced-motion` disables all GSAP tweens, preserves opacity reveals
- All interactive elements keyboard navigable
- Canvas network visualization has `aria-label` describing its function
- Semantic HTML throughout
- Color contrast maintained across all era color states

---

## Lighthouse

| Metric | Score |
|---|---|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

---

## File Structure
```text
Transmission/
├── public/
├── src/
│   ├── components/         React components, one per section
│   ├── hooks/              Custom hooks for scroll, era state, canvas
│   ├── lib/                GSAP setup, Lenis integration, utilities
│   ├── pages/              Application views
│   ├── test/               Test files and fixtures
│   ├── App.tsx             Root component, era state machine
│   ├── index.css           Global styles, CSS custom properties
│   └── main.tsx            Entry point
├── index.html
├── package.json
└── vite.config.ts
```

---

*Nishant Harkut — Frontend Odyssey 2026*