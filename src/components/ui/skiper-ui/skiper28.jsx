"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useRef } from "react";

export const Skiper28 = () => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  // Desktop 3D perspective motion: text rises as section scrolls into view
  // Completes rise before footer arrives so text is always fully revealed
  const yMotionValue = useTransform(scrollYProgress, [0, 0.85], [160, 0]);

  const transform = useMotionTemplate`
    rotateX(30deg)
    translateY(${yMotionValue}px)
    translateZ(10px)
  `;

  return (
    <section className="relative z-10 w-full overflow-hidden bg-white text-black">
      {/* ========================================================
          MOBILE NORMAL EDITORIAL TYPOGRAPHY (< md)
          Replaces 3D perspective with crisp, legible typography
          visible cleanly above the footer folder tab
          ======================================================== */}
      <div className="md:hidden relative w-full pt-12 pb-24 px-6 flex flex-col items-center justify-center text-center bg-white select-none">
        {/* Minimal Scroll Indicator */}
        <div className="flex flex-col items-center mb-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#5258FF]/70">
          
          </span>
          <div className="w-[1px] h-6 bg-[#5258FF]/30 mt-2" />
        </div>

        {/* Clear, Beautiful Tamil Typography */}
        <h2 className="text-4xl sm:text-5xl font-black leading-[1.15] tracking-[-0.03em] text-[#5258FF]">
          <span className="block">யாதும் ஊரே</span>
          <span className="block mt-2">யாவரும் கேளீர்</span>
        </h2>

        {/* Supporting Philosophy */}
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-neutral-400 font-medium max-w-[290px]">
          To us, all towns are our own, all people our kin
        </p>
      </div>

      {/* ========================================================
          DESKTOP 3D PERSPECTIVE SCROLL (>= md)
          Original full-fidelity Skiper28 experience
          ======================================================== */}
      <div
        ref={targetRef}
        className="
          hidden
          md:flex
          relative
          min-h-[85vh]
          h-[95vh]
          w-full
          overflow-hidden
          bg-white
          text-black
          flex-col
          items-center
          justify-center
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-[8%]
            z-10
            grid
            -translate-x-1/2
            justify-items-center
            gap-4
            text-center
          "
        >
          <span
            className="
              relative
              max-w-[14ch]
              text-xs
              font-medium
              uppercase
              leading-tight
              tracking-[0.25em]
              text-[#5258FF]
              opacity-60

              after:absolute
              after:left-1/2
              after:top-full
              after:h-12
              after:w-px
              after:bg-[#5258FF]
              after:content-['']
            "
          >
          </span>
        </div>

        {/* Perspective Text Stage */}
        <div
          className="
            relative
            flex
            items-center
            justify-center
            w-full
            h-full
            pt-10
            pb-8
            bg-transparent
            overflow-hidden
          "
          style={{
            transformStyle: "preserve-3d",
            perspective: "500px",
          }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
            }}
            className="
              relative
              w-full
              max-w-63xl
              px-8
              text-center
              text-6xl
              font-semibold
              leading-[0.85]
              tracking-[-0.07em]
              text-[#5258FF]

              md:text-5xl
              lg:text-[9rem]
              xl:text-[11rem]
            "
          >
            <span className="block select-none">
              யாதும் ஊரே
              <br />
              யாவரும் கேளீர்
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skiper28;


/**
 * Skiper 28 PerspectiveTextScroll
 *
 * React + Framer Motion
 *
 * Adapted for the CSEA landing page.
 *
 * Original inspiration:
 * Skiper UI
 *
 * Free version attribution:
 * Skiper UI
 */