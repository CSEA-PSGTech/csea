import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
} from "framer-motion";

import { LinePath } from "../ui/skiper-ui/skiper19";

const AboutSection = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // =====================================================
  // ONE-WAY CHECKPOINT STATE
  // =====================================================

  const [visionEntered, setVisionEntered] = useState(false);
  const [aimEntered, setAimEntered] = useState(false);
  const [communityEntered, setCommunityEntered] = useState(false);
  const [cultureEntered, setCultureEntered] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value >= 0.15) {
        setVisionEntered(true);
      }

      if (value >= 0.40) {
        setAimEntered(true);
      }

      if (value >= 0.70) {
        setCommunityEntered(true);
      }

      if (value >= 0.80) {
        setCultureEntered(true);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      ref={ref}
      className="relative h-[320vh] bg-[#00000gi]"
    >

      {/* =================================================
          FULL LENGTH LINE
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <LinePath
          scrollYProgress={scrollYProgress}
          className="
            absolute
            left-1/2
            top-0
            h-full
            w-auto
            -translate-x-1/2
          "
        />
      </div>


      {/* =================================================
          CONTENT TIMELINE
      ================================================= */}

      <div className="absolute inset-0 z-10">


        {/* =================================================
            ABOUT / 01
        ================================================= */}

        <div
          className="
            absolute
            left-8
            top-[15vh]
            max-w-[720px]
            text-black
            lg:left-20
          "
        >
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.35em]
              text-[#5258FF]
              lg:text-base
            "
          >
            About CSEA / 01
          </p>

          <h2
            className="
              mt-7
              text-[5rem]
              font-medium
              leading-[0.84]
              tracking-[-0.07em]
              lg:text-[8rem]
              xl:text-[9rem]
            "
          >
            Beyond
            <br />

            <span className="text-[#5258FF]">
              the classroom.
            </span>
          </h2>

          <p
            className="
              mt-12
              max-w-[620px]
              text-xl
              font-normal
              leading-[1.45]
              tracking-[-0.015em]
              text-black/60
              lg:text-2xl
            "
          >
            The Computer Science and Engineering Association
            is a community where{" "}
            <span className="font-medium text-black">
              curiosity becomes creation.
            </span>{" "}
            We explore technology, build ideas, compete,
            and grow together.
          </p>

          <div className="mt-12 flex items-center gap-5">
            <span className="h-px w-16 bg-[#5258FF]" />

            <span
              className="
                text-sm
                font-medium
                uppercase
                tracking-[0.25em]
                text-black/50
                lg:text-base
              "
            >
              Learn · Build · Create
            </span>
          </div>
        </div>


        {/* =================================================
            20% — VISION
            RIGHT → LEFT
        ================================================= */}

        <motion.div
          initial={{ x: "100vw" }}
          animate={{
            x: visionEntered ? 0 : "100vw",
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute
            right-[10%]
            top-[30%]
            z-20
            w-[380px]
            text-black
            lg:w-[460px]
          "
        >
          <p
            className=" mt-12
              text-sm
              font-semibold
              uppercase
              tracking-[0.35em]
              text-[#5258FF]
              lg:text-base
            "
          >
            02 / Vision
          </p>

          <h3
            className="
              mt-4
              text-5xl
              font-medium
              leading-[0.95]
              tracking-[-0.055em]
              lg:text-6xl
            "
          >
            Imagine more.
          </h3>

          <p
            className="
              mt-6
              text-lg
              leading-[1.5]
              tracking-[-0.01em]
              text-black/60
              lg:text-xl
            "
          >
            A place where curiosity becomes exploration
            and ideas become something real.
          </p>
        </motion.div>


        {/* =================================================
            40% — AIM
            LEFT → RIGHT
        ================================================= */}

        <motion.div
          initial={{ x: "-100vw" }}
          animate={{
            x: aimEntered ? 0 : "-100vw",
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute
            left-[10%]
            top-[50%]
            z-20
            w-[380px]
            text-black
            lg:w-[460px]
          "
        >
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.35em]
              text-[#5258FF]
              lg:text-base
            "
          >
            03 / Aim
          </p>

          <h3
            className="
              mt-4
              text-5xl
              font-medium
              leading-[0.95]
              tracking-[-0.055em]
              lg:text-6xl
            "
          >
            Learn by building.
          </h3>

          <p
            className="
              mt-6
              text-lg
              leading-[1.5]
              tracking-[-0.01em]
              text-black/60
              lg:text-xl
            "
          >
            We encourage experimentation, collaboration,
            competition, and hands-on creation.
          </p>
        </motion.div>


        {/* =================================================
            60% — COMMUNITY
            RIGHT → LEFT
        ================================================= */}

        <motion.div
          initial={{ x: "100vw" }}
          animate={{
            x: communityEntered ? 0 : "100vw",
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute
            right-[10%]
            top-[70%]
            z-20
            w-[380px]
            text-black
            lg:w-[460px]
          "
        >
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.35em]
              text-[#5258FF]
              lg:text-base
            "
          >
            04 / Community
          </p>

          <h3
            className="
              mt-4
              text-5xl
              font-medium
              leading-[0.95]
              tracking-[-0.055em]
              lg:text-6xl
            "
          >
            Build together.
          </h3>

          <p
            className="
              mt-6
              text-lg
              leading-[1.5]
              tracking-[-0.01em]
              text-black/60
              lg:text-xl
            "
          >
            Different ideas, different skills, one community
            pushing each other forward.
          </p>
        </motion.div>


        {/* =================================================
            80% — CULTURE
            LEFT → RIGHT
        ================================================= */}

        <motion.div
          initial={{ x: "-100vw" }}
          animate={{
            x: cultureEntered ? 0 : "-100vw",
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute
            left-[10%]
            top-[90%]
            z-20
            w-[380px]
            text-black
            lg:w-[460px]
          "
        >
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.35em]
              text-[#5258FF]
              lg:text-base
            "
          >
            05 / Culture
          </p>

          <h3
            className="
              mt-4
              text-5xl
              font-medium
              leading-[0.95]
              tracking-[-0.055em]
              lg:text-6xl
            "
          >
            Create together.
          </h3>

          <p
            className="
              mt-6
              text-lg
              leading-[1.5]
              tracking-[-0.01em]
              text-black/60
              lg:text-xl
            "
          >
            CSEA is where students challenge themselves,
            share knowledge, and turn ideas into action.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;