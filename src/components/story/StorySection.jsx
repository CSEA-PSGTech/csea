import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StoryStage } from "./StoryStage";
import { STORIES_DATA } from "./storyData";

gsap.registerPlugin(ScrollTrigger);

/**
 * StorySection Component
 * Outer 320vh scroll container housing the 100vh pinned editorial stage.
 * Driven by GSAP ScrollTrigger with robust real-time SVG stroke scrubbing.
 */
export function StorySection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const pathRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) return;

    const container = containerRef.current;
    const stage = stageRef.current;
    const path = pathRef.current;
    if (!container || !stage) return;

    // Measure exact total path length with safe fallback
    let len = 4800;
    if (path && typeof path.getTotalLength === "function") {
      try {
        const measured = Math.ceil(path.getTotalLength());
        if (measured > 0) len = measured;
      } catch {
        len = 4800;
      }
    }

    // Initialize SVG stroke dash properties on both CSS and SVG attributes
    if (path) {
      path.style.strokeDasharray = `${len}px`;
      path.style.strokeDashoffset = `${len}px`;
      path.setAttribute("stroke-dasharray", `${len}`);
      path.setAttribute("stroke-dashoffset", `${len}`);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReducedMotion ? false : true,
          anticipatePin: 1,
          pinType: "transform",
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const p = tl.progress();

          // 1. Fast CSS stroke-dashoffset update
          if (path) {
            const currentOffset = Math.max(0, len * (1 - p));
            path.style.strokeDashoffset = `${currentOffset}px`;
          }

          // 2. Map smoothed progress to the 5 stories:
          const computedIndex = Math.min(
            STORIES_DATA.length - 1,
            Math.floor(p * STORIES_DATA.length)
          );

          if (computedIndex !== activeIndexRef.current) {
            activeIndexRef.current = computedIndex;
            setActiveIndex(computedIndex);
          }
        },
      });

      // GSAP timeline animation driving strokeDashoffset
      if (path && !prefersReducedMotion) {
        tl.fromTo(
          path,
          { strokeDashoffset: len },
          { strokeDashoffset: 0, ease: "none" }
        );
      }
    }, container);

    // Refresh ScrollTrigger calculations
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  // Smooth jump to specific story index when progress indicator is clicked
  const handleSelectStory = (index) => {
    const container = containerRef.current;
    if (!container) return;

    const targetRatio = (index + 0.5) / STORIES_DATA.length;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const sectionTop = scrollTop + rect.top;
    const scrollableDistance = rect.height - window.innerHeight;
    const targetY = sectionTop + scrollableDistance * targetRatio;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={containerRef}
      id="about"
      data-section="story"
      className="relative w-full bg-[#FAFAFC]"
    >
      {/* DESKTOP PINNED 320vh GSAP SCROLLTRIGGER EXPERIENCE (>= md) */}
      <div className="hidden md:block relative h-[320vh] w-full">
        <StoryStage
          ref={stageRef}
          pathRef={pathRef}
          stories={STORIES_DATA}
          activeIndex={activeIndex}
          onSelectStory={handleSelectStory}
        />
      </div>

      {/* MOBILE UNPINNED STATIC EDITORIAL STORY STACK (< md) */}
      <div className="md:hidden relative w-full py-12 px-5 flex flex-col gap-16 select-none bg-[#FAFAFC]">
        {STORIES_DATA.map((story) => (
          <div
            key={story.id}
            className="w-full flex flex-col items-center text-center pb-12 border-b border-black/5 last:border-b-0 last:pb-0"
          >
            {/* Top Badge & Counter */}
            <div className="w-full flex items-center justify-center gap-2 mb-3">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#0038FF]">
                {story.badge}
              </span>
              <span className="text-[11px] font-mono font-bold text-neutral-400">
                · {story.number} / 05
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-neutral-950 leading-[1.1]">
              {story.headingPrefix}{" "}
              <span className="text-[#0038FF] font-black">{story.headingAccent}</span>
            </h2>

            {/* Description */}
            <p className="mt-3 text-[14px] text-neutral-700 font-normal leading-[1.65] max-w-[320px] sm:max-w-[360px]">
              {story.description}
            </p>

            {/* Photo Card or Stats Grid */}
            {story.stats ? (
              <div className="mt-5 w-full max-w-[330px] grid grid-cols-2 gap-3">
                {story.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="relative rounded-2xl bg-white border border-black/[0.08] p-4 shadow-sm text-center"
                  >
                    <div className="text-3xl font-black tracking-[-0.04em] text-neutral-950 flex items-baseline justify-center select-none">
                      <span className="inline-block transform scale-x-110 origin-center">
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-[#0038FF] inline-block transform scale-x-110 origin-center ml-1 font-black">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="inline-block transform scale-x-105 origin-center text-[10px] uppercase tracking-[0.2em] font-black text-neutral-800 leading-tight">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : story.images?.[0] ? (
              <div className="mt-5 w-full flex justify-center">
                <div
                  className="w-full max-w-[290px] aspect-[4/3] rounded-2xl bg-white p-2 border border-black/10 shadow-md overflow-hidden relative"
                  style={{ transform: `rotate(${story.images[0].rotation || -1.5}deg)` }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden relative bg-neutral-900">
                    <img
                      src={story.images[0].src}
                      alt={story.images[0].alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    {story.images[0].caption && (
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white text-left">
                        <p className="text-[10px] font-bold tracking-tight uppercase font-mono leading-tight">
                          {story.images[0].caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Supporting Concept Pill */}
            {story.supporting && (
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-black/[0.08] shadow-xs text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-800">
                  {story.supporting}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default StorySection;
