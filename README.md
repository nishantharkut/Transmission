# Project Description 

Transmission is an interactive web experience built around Theme 2: Evolution of the Internet. Rather than presenting history as a forward-looking timeline, the project frames it as a declassified signal log. The user enters as a communications operator receiving dispatches from 60 years of internet history, starting with the two-letter message that crashed on ARPANET in 1969 and ending as an active node in a live network visualization.
The core design decision that drives the entire experience is era-shifting aesthetics. As the user scrolls through each historical period, the page's own visual language transforms. The ARPANET section renders in phosphor-green terminal type on near-black. The early web section switches to a light background with actual Times New Roman and hyperlink blue, referencing Tim Berners-Lee's original 1991 design. The flat design era returns to clean white. By the final section, the experience has cycled through every major design paradigm that produced the screen the user is reading on. The medium becomes the narrative.
Built with React, TypeScript, Vite, and Tailwind CSS, the project uses GSAP ScrollTrigger for all scroll-driven sequences including two pinned sections, animated CSS custom properties for era transitions, and a Canvas 2D network visualization where the user's cursor becomes a live node in the historical network.
Three distinct interactions ship: horizontal scrolling sequences, interactive terminal typing, and a live canvas network node visualization. Responsive across all breakpoints, with a reduced-motion fallback that preserves the narrative while disabling animation for accessibility.
The experience ends with the user identified as node number 5,400,000,001. Everything before that was setup.

# Transmission

An interactive history of the internet, told as a 60-year signal log.

Built for Frontend Odyssey 2026. Theme 2: Evolution of the Internet.
Solo submission — Nishant Harkut.

Live: 

---

## The Concept

The first message ever sent on ARPANET was "LO".

The operator was trying to type "LOGIN". The system crashed after the second
character. The internet began with an incomplete sentence.

Transmission starts there and ends with the user becoming a node in the
network they just scrolled through. Each of the five eras renders in the
visual language of its time. The page redesigns itself as you read it.

---

## Theme

Evolution of the Internet — ARPANET to present day, framed as a
declassified transmission log rather than a product timeline.

---

## Tech Stack

- React + TypeScript + Vite + Tailwind CSS
- GSAP + ScrollTrigger — all scroll-driven sequences and animations
- Lenis — smooth scroll, ticked via GSAP ticker
- Canvas 2D API — live network node visualization
- CSS Custom Properties — animated per era via GSAP

No Three.js. No image assets. No Lottie. Everything rendered in code.

---

## Structure

The experience has seven sections forming a single narrative arc.

  Boot sequence    Terminal preloader. The "LO" message. Cannot be skipped.
  Hero             The signal room. ARPANET node topology. 1969.
  ERA 1            ARPANET 1969-1983. Phosphor terminal. Live packet log.
  ERA 2            Web 1991-1999. Pinned scroll through three design eras.
  ERA 3            Dot-com 2000-2011. The bubble. The crash. The recovery.
  ERA 4            Mobile 2012-2020. The phone becomes the web.
  ERA 5            Now. 5.4 billion nodes. You are one of them.
  Close            Transmission complete.

---

## Mandatory Requirements

Story structure       7 sections, single continuous narrative
Scroll interactions   3 implemented — pinned era transitions,
                      timeline rail, CSS custom property blending
Interactive elements  3 implemented — terminal typing, horizontal scroll timeline, and network node visualization
Animations            Boot sequence, era transitions, counter,
                      marquee, canvas network
Responsive            Mobile, tablet, desktop. Reduced-motion fallback.

---

## Running Locally

git clone https://github.com/nishantharkut/internet_evo
cd internet_evo
npm install
npm run dev

Opens on localhost:8000.

---

## Design Decisions

Era-shifting aesthetics. The single most unconventional choice in the
build. Most scroll storytelling sites have one visual language throughout.
This one has five, each historically accurate to the period it represents,
each transitioning via animated CSS custom properties rather than hard cuts.

No images. Every visual element is SVG, Canvas, or CSS. This kept the
bundle under 500KB and Lighthouse performance at 100.

Phosphor green as the through-line. The --signal color (hsl 142 70% 65%)
appears in every era as a constant. It is the color of the original
terminal. It is also the color of the final network node the user becomes.
One color, 60 years.

---

## Fonts

  Crimson Pro     Editorial narration, historian voice, pull quotes
  Anybody         Era headers, width axis varies by period
  Geist Mono      Terminal output, timestamps, packet data, all numbers
  IBM Plex Sans   UI chrome, navigation, interactive labels

---

## Scoring Criteria Addressed

  Creativity & Storytelling   30%   Era-shifting design, "LO" framing,
                                    user becomes node #5,400,000,001
  Visual Design               25%   Five distinct visual languages,
                                    variable font axes, no stock assets
  Animation & Interactivity   20%   GSAP ScrollTrigger, pinned sections,
                                    canvas interaction, era transitions
  Responsiveness              15%   Three breakpoints, reduced-motion
                                    fallback, mobile-specific layout
  Code Quality                10%   Component-driven architecture with clean separation of concerns and maintainable hooks.

---

## Accessibility

prefers-reduced-motion disables GSAP tweens, preserves opacity reveals.
All interactive elements are keyboard navigable.
Canvas network node has aria-label describing its function.
Semantic HTML throughout.

---

## Lighthouse

Performance   100
Accessibility 100
Best Practices 100
SEO           100

---

---

## File Structure

```text
transmission/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and library wrappers
│   ├── pages/              # Application views/pages
│   ├── test/               # Test files and fixtures
│   ├── App.tsx             # Root component
│   ├── index.css           # Global styles and CSS variables
│   └── main.tsx            # Entry point
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
└── vite.config.ts          # Vite configuration
```

Nishant Harkut, 2026.
Frontend Odyssey — Interactive Web Experience Challenge.