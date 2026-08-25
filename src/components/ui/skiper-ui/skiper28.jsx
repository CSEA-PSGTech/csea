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
    offset: ["start end", "end start"],
  });

  // Text rises as this section scrolls through the viewport
  const yMotionValue = useTransform(
    scrollYProgress,
    [0, 1],
    [487, 0]
  );

  const transform = useMotionTemplate`
    rotateX(30deg)
    translateY(${yMotionValue}px)
    translateZ(10px)
  `;

  return (
    <section
      ref={targetRef}
      className="
        relative
        z-10
        h-[120vh]
        w-screen
        overflow-hidden
        bg-[#00000]
        text-black
      "
    >
         <div
        className="
          absolute
          left-1/2
          top-[10%]
          z-10
          grid
          -translate-x-1/2
          justify-items-center
          gap-6
          text-center
        "
      >
        <span
          className="
            relative
            max-w-[12ch]
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
            after:h-16
            after:w-px
            after:bg-[#5258FF]
            after:content-['']
          "
        >
          Scroll to explore
        </span>
      </div>

      {/* ==========================================
          LABEL
      ========================================== */}

   

      {/* ==========================================
          PERSPECTIVE TEXT
      ========================================== */}

      <div
        className="
          items-center
          justify-center
          bg-transparent
         
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
          <span>
             
     யாதும்     ஊரே
            <br />
           
         யாவரும்      கேளீர்
            <br />
           
            <br />

        
    
          </span>

          {/* ========================================
              BOTTOM FADE
          ======================================== */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-[-5vh]
              left-0
              h-[60vh]
              w-full
              bg-gradient-to-b
              from-transparent
              via-[#FAFDEE]/70
              to-[#FAFDEE]
            "
          />
        </motion.div>
      </div>

    </section>
  );
};


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