"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({
  data,
  sectionNumber = "03 / Timeline",
  title = "Journey & Milestones",
  description = "A chronicle of innovation, technical workshops, and student growth.",
}) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.getBoundingClientRect().height);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section
      id="timeline"
      className="relative w-full py-16 sm:py-24 px-5 sm:px-8 md:px-[10%] flex flex-col justify-center overflow-hidden bg-transparent text-neutral-900"
      ref={containerRef}
    >
      {/* Section Header — Matching 03 / Members screenshot */}
      <div className="relative z-10 w-full mb-10 sm:mb-16">
        <div className="w-full max-w-[480px] lg:max-w-[560px]">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
            {sectionNumber}
          </p>
          <h2 className="mt-3 sm:mt-4 text-4xl sm:text-5xl font-light leading-[1.02] sm:leading-[0.95] tracking-[-0.055em] lg:text-6xl text-neutral-900">
            {title}
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl font-normal">
            {description}
          </p>
        </div>
      </div>

      <div ref={ref} className="relative w-full pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-24 md:gap-12"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-9 absolute left-3 md:left-3 w-9 rounded-full bg-white flex items-center justify-center border border-neutral-200 shadow-sm">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              </div>
              <h3 className="hidden md:block text-3xl md:pl-20 md:text-5xl lg:text-6xl font-light text-neutral-900 tracking-tight">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-3 text-left font-light text-neutral-900 tracking-tight">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Timeline track line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-7 left-7 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-neutral-200 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-600 via-blue-500 to-transparent from-[0%] via-[10%]"
          />
        </div>
      </div>
    </section>
  );
};

export default Timeline;
