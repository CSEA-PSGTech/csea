import React from "react";

/**
 * MobileHeroSection Component
 * Elegant, spacious mobile scrapbook/editorial layout matching
 * ChatGPT Image Sep 20, 2026, 10_16_36 PM.png and CSEA_mobile_redesign.md.
 *
 * Optimized for mobile & Android viewports:
 * - Reduced element dimensions to eliminate clustering
 * - Generous, airy breathing room between all visual blocks
 * - Centered institutional logo strip
 * - Compact Polaroid cards with tape & handwritten captions
 * - Balanced "we are CSEA ;)" typography
 * - Scaled 3D CSEA Cube with orbit and spark diamonds
 * - Subtle blueprint grids, halftone dots, and editorial annotations
 */
export function MobileHeroSection() {
  return (
    <section className="mobile-hero relative w-full min-h-[100svh] bg-[#FAFAFC] text-neutral-900 overflow-hidden select-none flex flex-col justify-between py-6 px-3.5 sm:px-5">
      {/* ========================================================
          1. ATMOSPHERIC BACKGROUND DECORATIONS
          ======================================================== */}

      {/* Top-Left Halftone Dot Cluster (Vector Masked) */}
      <svg
        className="absolute top-0 left-0 w-36 h-36 pointer-events-none z-0"
        viewBox="0 0 160 160"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ht-tl" cx="0%" cy="0%" r="95%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="40%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="ht-tl-mask">
            <rect width="160" height="160" fill="url(#ht-tl)" />
          </mask>
          <pattern
            id="ht-tl-pattern"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="4" cy="4" r="2.2" fill="#0047FF" />
          </pattern>
        </defs>
        <rect
          width="160"
          height="160"
          fill="url(#ht-tl-pattern)"
          mask="url(#ht-tl-mask)"
          opacity="0.45"
        />
      </svg>

      {/* Bottom-Left Halftone Dot Cluster (Vector Masked) */}
      <svg
        className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none z-0"
        viewBox="0 0 180 180"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ht-bl" cx="0%" cy="100%" r="95%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="40%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="ht-bl-mask">
            <rect width="180" height="180" fill="url(#ht-bl)" />
          </mask>
          <pattern
            id="ht-bl-pattern"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="4" cy="4" r="2.2" fill="#0047FF" />
          </pattern>
        </defs>
        <rect
          width="180"
          height="180"
          fill="url(#ht-bl-pattern)"
          mask="url(#ht-bl-mask)"
          opacity="0.5"
        />
      </svg>

      {/* Blueprint Grid: Left side behind metadata */}
      <div
        className="absolute left-0 top-[38%] w-24 sm:w-28 h-36 pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 71, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 71, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
        aria-hidden="true"
      />

      {/* Blueprint Grid: Right side behind handwritten annotation */}
      <div
        className="absolute right-0 top-[38%] w-26 sm:w-30 h-36 pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 71, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 71, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
        aria-hidden="true"
      />

      {/* Blue Hatch Accent Marks // */}
      <div
        className="absolute top-20 left-5 flex gap-1 -rotate-12 pointer-events-none select-none z-10 opacity-85"
        aria-hidden="true"
      >
        <div className="w-[2px] h-4 bg-[#0047FF] rounded-full" />
        <div className="w-[2px] h-4 bg-[#0047FF] rounded-full" />
      </div>

      <div
        className="absolute top-32 right-3 flex gap-1 -rotate-12 pointer-events-none select-none z-10 opacity-85"
        aria-hidden="true"
      >
        <div className="w-[2px] h-4 bg-[#0047FF] rounded-full" />
        <div className="w-[2px] h-4 bg-[#0047FF] rounded-full" />
      </div>

      <div
        className="absolute top-[63%] left-3 flex gap-1 -rotate-12 pointer-events-none select-none z-10 opacity-85"
        aria-hidden="true"
      >
        <div className="w-[2px] h-4 bg-[#0047FF] rounded-full" />
        <div className="w-[2px] h-4 bg-[#0047FF] rounded-full" />
      </div>

      {/* ========================================================
          2. TOP HEADER LOGO STRIP (CENTERED & REFINED)
          ======================================================== */}
      <div className="relative z-10 w-full flex items-center justify-center pt-1 px-2">
        <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-[90vw] mx-auto">
          <img
            src="/logos/hundred.png"
            alt="PSG 100 Years"
            className="h-5 sm:h-5.5 w-auto object-contain shrink-0"
            style={{ height: "20px", maxHeight: "22px", width: "auto" }}
            draggable={false}
          />
          <img
            src="/logos/psg.png"
            alt="PSG Since 1926"
            className="h-5 sm:h-5.5 w-auto object-contain shrink-0"
            style={{ height: "20px", maxHeight: "22px", width: "auto" }}
            draggable={false}
          />
          <a href="/" aria-label="CSEA Home" className="inline-flex items-center shrink-0">
            <img
              src="/logos/csea.png"
              alt="CSEA Logo"
              className="h-6 sm:h-6.5 w-auto object-contain shrink-0"
              style={{ height: "24px", maxHeight: "26px", width: "auto" }}
              draggable={false}
            />
          </a>
          <img
            src="/logos/PSGLogo.png"
            alt="PSG College Crest"
            className="h-5 sm:h-5.5 w-auto object-contain shrink-0"
            style={{ height: "20px", maxHeight: "22px", width: "auto" }}
            draggable={false}
          />
          <img
            src="/logos/Year75w.png"
            alt="75 Years"
            className="h-5 sm:h-5.5 w-auto object-contain shrink-0"
            style={{ height: "20px", maxHeight: "22px", width: "auto" }}
            draggable={false}
          />
        </div>
      </div>

      {/* ========================================================
          3. TOP POLAROID PAIR: BUILD & COLLABORATE
          ======================================================== */}
      <div className="relative z-10 w-full flex items-start justify-between px-2 mt-5 sm:mt-7">
        {/* Left Polaroid: build. */}
        <div className="relative w-[116px] sm:w-[128px] shrink-0 -rotate-[4.5deg] shadow-[0_10px_20px_-4px_rgba(15,23,42,0.11),0_3px_6px_-2px_rgba(15,23,42,0.05)] rounded-[2px] bg-white p-1.5 pb-3 border border-black/[0.04] transition-transform duration-300 active:scale-105">
          {/* Masking tape on top edge */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-9 h-3.5 bg-white/85 backdrop-blur-xs border border-neutral-300/50 shadow-xs -rotate-2 z-20 pointer-events-none"
            aria-hidden="true"
          />

          <img
            src="/landing_page/image (2).webp"
            alt="CSEA Workshop - Build"
            className="w-full aspect-[4/3.2] object-cover rounded-[1px]"
            loading="eager"
          />

          <p
            className="mt-1.5 text-center text-neutral-800 text-sm sm:text-base font-medium leading-none"
            style={{ fontFamily: "'Patrick Hand', cursive" }}
          >
            build.
          </p>
        </div>

        {/* Right Polaroid: collaborate. with annotation */}
        <div className="relative w-[116px] sm:w-[128px] shrink-0 mt-3 sm:mt-4">
          {/* Handwritten Annotation Above */}
          <div className="absolute -top-9 right-1 flex flex-col items-end pointer-events-none select-none">
            <p
              className="text-right text-[#17233B] leading-[1.1]"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}
            >
              same<br />people<br />brighter<br />ideas :)
            </p>
            <svg
              className="w-5 h-5 -mr-0.5 text-[#17233B]"
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M 4 8 C 18 2, 28 8, 22 26" strokeLinecap="round" />
              <path
                d="M 18 22 L 22 27 L 27 23"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="rotate-[4deg] shadow-[0_10px_20px_-4px_rgba(15,23,42,0.11),0_3px_6px_-2px_rgba(15,23,42,0.05)] rounded-[2px] bg-white p-1.5 pb-3 border border-black/[0.04] transition-transform duration-300 active:scale-105">
            <img
              src="/landing_page/image (8).webp"
              alt="CSEA Team - Collaborate"
              className="w-full aspect-[4/3.2] object-cover rounded-[1px]"
              loading="eager"
            />

            <p
              className="mt-1.5 text-center text-neutral-800 text-sm sm:text-base font-medium leading-none"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              collaborate.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. CENTER HERO HEADLINE: "we are CSEA ;)"
          ======================================================== */}
      <div className="relative z-10 w-full flex flex-col items-center text-center my-4 sm:my-6 select-none">
        <span className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0F172A] leading-tight">
          we are
        </span>
        <h1 className="text-[46px] sm:text-[56px] font-bold tracking-[-0.04em] text-[#0047FF] leading-[0.9] mt-0.5">
          CSEA ;)
        </h1>
      </div>

      {/* ========================================================
          5. CENTER 3D CSEA CUBE WITH ORBIT & STICKERS
          ======================================================== */}
      <div className="relative z-10 w-full flex items-center justify-center my-2 sm:my-3 select-none">
        {/* Left Side Metadata Block */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none text-left">
          <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.22em] text-neutral-500 uppercase leading-[1.55] block">
            IDEAS<br />PEOPLE<br />TECH<br />IMPACT
          </span>
          <div className="w-3.5 h-[1.5px] bg-neutral-300 mt-1.5" />
        </div>

        {/* Center Cube & Orbit Assembly */}
        <div className="relative w-[125px] h-[100px] flex items-center justify-center">
          {/* Atom Orbit Behind */}
          <img
            src="/csea_stickers/atom_orbit.png"
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-xs"
            style={{ width: "115px", height: "92px", margin: "auto" }}
            aria-hidden="true"
          />

          {/* 3D CSEA Cube */}
          <img
            src="/csea_stickers/csea_cube.png"
            alt="CSEA Cube"
            className="relative z-10 object-contain drop-shadow-md"
            style={{ width: "82px", height: "82px" }}
          />

          {/* Spark Diamond Star (Left) */}
       

          {/* Spark Diamond Star (Right) */}
          <img
            src="/csea_stickers/spark_diamond.png"
            alt=""
            className="absolute right-3 top-2 w-4 h-4 object-contain z-20 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Right Side Handwritten Annotation */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none text-right">
          <p
            className="text-right text-[#17233B] leading-[1.1]"
            style={{ fontFamily: "'Caveat', cursive", fontSize: "16px" }}
          >
            for<br />a better<br />tomorrow
          </p>
          <span className="text-[12px] font-mono font-bold text-neutral-700 tracking-wider block mt-0.5">
            &lt;/&gt;
          </span>
        </div>
      </div>

      {/* ========================================================
          6. ORGANIZATION & COLLEGE SUBTITLE
          ======================================================== */}
      <div className="relative z-10 text-center select-none px-4 mt-2 mb-1">
        <h2 className="text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-neutral-800 leading-snug">
          COMPUTER SCIENCE AND<br />ENGINEERING ASSOCIATION
        </h2>
        <p className="text-[8px] sm:text-[8.5px] font-medium tracking-[0.16em] uppercase text-neutral-500 mt-0.5">
          PSG COLLEGE OF TECHNOLOGY
        </p>
        <div className="w-9 h-[2px] bg-[#0047FF] rounded-full mx-auto mt-2" />
      </div>

      {/* ========================================================
          7. BOTTOM POLAROID PAIR: COMPETE & CREATE
          ======================================================== */}
      <div className="relative z-10 w-full flex items-end justify-between px-2 mt-5 sm:mt-7">
        {/* Left Polaroid: compete. */}
        <div className="relative w-[116px] sm:w-[128px] shrink-0 rotate-[3.5deg] shadow-[0_10px_20px_-4px_rgba(15,23,42,0.11),0_3px_6px_-2px_rgba(15,23,42,0.05)] rounded-[2px] bg-white p-1.5 pb-3 border border-black/[0.04] transition-transform duration-300 active:scale-105">
          {/* Blue masking tape on top edge */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-9 h-3.5 bg-[#0047FF]/80 backdrop-blur-xs border border-white/30 shadow-xs rotate-3 z-20 pointer-events-none"
            aria-hidden="true"
          />

          <img
            src="/landing_page/image (5).webp"
            alt="CSEA Activity - Compete"
            className="w-full aspect-[4/3.2] object-cover rounded-[1px]"
            loading="lazy"
          />

          <p
            className="mt-1.5 text-center text-neutral-800 text-sm sm:text-base font-medium leading-none"
            style={{ fontFamily: "'Patrick Hand', cursive" }}
          >
            compete.
          </p>
        </div>

        {/* Right Polaroid: create. */}
        <div className="relative w-[116px] sm:w-[128px] shrink-0 -rotate-[3deg] shadow-[0_10px_20px_-4px_rgba(15,23,42,0.11),0_3px_6px_-2px_rgba(15,23,42,0.05)] rounded-[2px] bg-white p-1.5 pb-3 border border-black/[0.04] transition-transform duration-300 active:scale-105">
          {/* Blue masking tape on top edge */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-9 h-3.5 bg-[#0047FF]/80 backdrop-blur-xs border border-white/30 shadow-xs -rotate-2 z-20 pointer-events-none"
            aria-hidden="true"
          />

          <img
            src="/landing_page/image (11).webp"
            alt="CSEA Innovation - Create"
            className="w-full aspect-[4/3.2] object-cover rounded-[1px]"
            loading="lazy"
          />

          <p
            className="mt-1.5 text-center text-neutral-800 text-sm sm:text-base font-medium leading-none"
            style={{ fontFamily: "'Patrick Hand', cursive" }}
          >
            create.
          </p>
        </div>
      </div>

      {/* ========================================================
          8. BOTTOM DETAILS & SCROLL INDICATOR
          ======================================================== */}
      <div className="relative z-10 w-full flex items-end justify-between px-2 pt-5 pb-2 mt-5 select-none">
        {/* Bottom Left: "more than code" with hand-drawn double underline */}
        <div className="flex flex-col items-start -rotate-6 select-none">
          <p
            className="text-neutral-900 font-bold leading-[1.05]"
            style={{ fontFamily: "'Caveat', cursive", fontSize: "17px" }}
          >
            more<br />than<br />code
          </p>
          <svg
            className="w-13 h-2.5 text-[#0047FF] mt-0.5"
            viewBox="0 0 70 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M 2 4 Q 25 1, 45 4 T 68 3" strokeLinecap="round" />
            <path d="M 4 8 Q 28 5, 48 8 T 66 7" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bottom Center: Scroll Down Indicator */}
        <div className="flex flex-col items-center text-center -mb-0.5">
          <div className="w-[1px] h-6 bg-neutral-300" />
          <span className="text-[8px] sm:text-[8.5px] tracking-[0.22em] font-bold text-neutral-500 uppercase mt-1.5">
            SCROLL DOWN
          </span>
          <svg
            className="w-3 h-3 text-neutral-800 mt-1 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Bottom Right: Metadata */}
        <div className="flex flex-col items-end text-right select-none">
          <span className="text-[8px] sm:text-[8.5px] font-bold tracking-[0.2em] text-neutral-500 uppercase leading-[1.55] block">
            COMMUNITY<br />LEARNING<br />OPPORTUNITIES<br />GROWTH
          </span>
          <div className="w-3.5 h-[1.5px] bg-neutral-300 mt-1.5" />
        </div>
      </div>
    </section>
  );
}

export default MobileHeroSection;
