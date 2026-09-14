import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditorialGrid, PlusGridMatrix, BlueAura } from "./StoryDecorations";
import { StoryPath } from "./StoryPath";
import { StoryContent } from "./StoryContent";
import { StoryVisual } from "./StoryVisual";
import { StoryProgress } from "./StoryProgress";

/**
 * StoryStage Component
 * Pinned 100vh viewport rendering the active story state, continuous SVG line, and decorations.
 */
export const StoryStage = forwardRef(function StoryStage(
  {
    stories = [],
    activeIndex = 0,
    pathRef,
    onSelectStory,
  },
  ref
) {
  const currentStory = stories[activeIndex] || stories[0];

  return (
    <div
      ref={ref}
      className="relative h-screen h-[100dvh] w-full overflow-hidden bg-[#FAFAFC] text-neutral-900 select-none"
    >
      {/* 1. Thin Editorial Background Grid */}
      <EditorialGrid />

      {/* 2. Subtle Plus Grid in Negative Space */}
      <div className="absolute left-[10%] top-[42%] z-0 pointer-events-none">
        <PlusGridMatrix className="opacity-40" />
      </div>

      {/* 3. Continuous Blue SVG Path weaved through the stage */}
      <StoryPath pathRef={pathRef} />

      {/* 4. Soft Blue Radial Aura (Story 01 & Story 05) */}
      <AnimatePresence>
        {currentStory.auraPosition && (
          <BlueAura
            key={`aura-${currentStory.id}`}
            position={currentStory.auraPosition}
            text={currentStory.metadata?.cornerBadge || currentStory.metadata?.auraText}
          />
        )}
      </AnimatePresence>



      {/* ========================================================
          MOBILE CLEAN EDITORIAL STORY LAYOUT (< md)
          Addresses user feedback:
          - Safe top clearance to prevent Menu + overlap (pt-14 / pt-16)
          - Left-grouped badge & counter to keep top-right free
          - Smaller, tighter gap between text description and photo/stats
          - Preserved frosted card effect for 5th story
          - Instant cross-fade without blank delays
          ======================================================== */}
      <div className="md:hidden relative z-10 h-full w-full px-5 pt-14 pb-4 flex flex-col justify-between select-none overflow-hidden">
        {/* Top Badge & Counter (Left-aligned, leaving top-right clear for Menu +) */}
        <div className="w-full flex items-center justify-start gap-2 pt-1">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#0038FF]">
            {currentStory.badge}
          </span>
          <span className="text-[11px] font-mono font-bold text-neutral-400">
            · {currentStory.number} / 05
          </span>
        </div>

        {/* Main Story Flow: Centered cohesive unit with smaller, elegant gap */}
        <AnimatePresence>
          <motion.div
            key={`mobile-story-${currentStory.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center text-center my-auto py-1"
          >
            {/* Top Text Group: Heading + Description */}
            <div className="w-full flex flex-col items-center">
              {/* Heading with deep contrast */}
              <h2 className="text-3xl sm:text-[2.25rem] font-bold tracking-[-0.03em] text-neutral-950 leading-[1.08]">
                {currentStory.headingPrefix}{" "}
                <span className="text-[#0038FF] font-black">{currentStory.headingAccent}</span>
              </h2>

              {/* Description */}
              <p className="mt-2.5 text-[13px] sm:text-sm text-neutral-800 font-medium leading-[1.6] max-w-[320px] sm:max-w-[360px]">
                {currentStory.description}
              </p>
            </div>

            {/* Centerpiece: Smaller gap between text and photo/stats (mt-4 sm:mt-5) */}
            {currentStory.stats ? (
              /* Story 05 Impact Frosted Glass Stats Grid — Exact Desktop Effect Preserved */
              <div className="mt-4 sm:mt-5 w-full max-w-[330px] sm:max-w-[360px] grid grid-cols-2 gap-3 sm:gap-3.5">
                {currentStory.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="relative rounded-2xl bg-white/85 backdrop-blur-md border border-black/[0.06] p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center transition-transform"
                  >
                    {/* Thick, stretched large metric numbers */}
                    <div className="text-3xl sm:text-4xl font-black tracking-[-0.04em] text-neutral-950 flex items-baseline justify-center select-none">
                      <span className="inline-block transform scale-x-110 origin-center">
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-[#2547FF] inline-block transform scale-x-110 origin-center ml-1 font-black">
                          {stat.suffix}
                        </span>
                      )}
                    </div>

                    {/* Thick, stretched uppercase labels */}
                    <div className="mt-2">
                      <span className="inline-block transform scale-x-105 origin-center text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-black text-neutral-800 leading-tight">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentStory.images?.[0] ? (
              /* Stories 01–04 Clean Editorial Image Card */
              <div className="mt-4 sm:mt-5 w-full flex justify-center">
                <div
                  className="w-full max-w-[280px] sm:max-w-[310px] aspect-[4/3] rounded-2xl bg-white p-2 border border-black/10 shadow-[0_12px_28px_rgba(0,0,0,0.09)] overflow-hidden relative group"
                  style={{ transform: `rotate(${currentStory.images[0].rotation || -1.5}deg)` }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden relative bg-neutral-900">
                    <img
                      src={currentStory.images[0].src}
                      alt={currentStory.images[0].alt}
                      className="w-full h-full object-cover"
                    />
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    {currentStory.images[0].caption && (
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white text-left">
                        <p className="text-[10px] font-bold tracking-tight uppercase font-mono leading-tight">
                          {currentStory.images[0].caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Supporting Concept in Frosted Protective Pill */}
            {currentStory.supporting && (
              <div className="mt-3.5 sm:mt-4">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-850">
                  {currentStory.supporting}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Story Indicator */}
        <div className="pt-2 pb-2 flex items-center justify-center gap-7 sm:gap-9">
          {stories.map((s, i) => {
            const isActive = activeIndex === i;
            return (
              <button
                key={s.id}
                onClick={() => onSelectStory && onSelectStory(i)}
                className="relative py-1.5 px-1 cursor-pointer flex flex-col items-center focus:outline-none"
              >
                <span
                  className={`text-xs tracking-wider transition-colors ${
                    isActive ? "text-[#0038FF] font-black" : "text-neutral-500 font-bold hover:text-neutral-800"
                  }`}
                >
                  {s.number}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobileStoryUnderline"
                    className="absolute -bottom-0.5 h-[2.5px] w-5 bg-[#0038FF] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          DESKTOP EDITORIAL TWO-COLUMN STAGE (>= md)
          Unchanged desktop layout
          ======================================================== */}
      <div className="hidden md:flex relative z-10 h-full w-full px-6 sm:px-8 md:px-[10%] items-center justify-between">
        {/* Left Column: Headline, Description & Concept */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <StoryContent key={currentStory.id} story={currentStory} />
          </AnimatePresence>
        </div>

        {/* Right Column: Editorial Floating Image Cards / Impact Stats */}
        <div className="flex md:w-7/12 h-full items-center justify-end relative">
          <AnimatePresence mode="wait">
            <StoryVisual key={currentStory.id} story={currentStory} />
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Story Progress Indicator (Desktop only) */}
      <div className="hidden md:block">
        <StoryProgress
          stories={stories}
          activeIndex={activeIndex}
          onSelectStory={onSelectStory}
        />
      </div>
    </div>
  );
});

export default StoryStage;
