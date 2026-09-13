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
      className="relative h-[320vh] w-full bg-[#FAFAFC]"
    >
      <StoryStage
        ref={stageRef}
        pathRef={pathRef}
        stories={STORIES_DATA}
        activeIndex={activeIndex}
        onSelectStory={handleSelectStory}
      />
    </section>
  );
}

export default StorySection;
