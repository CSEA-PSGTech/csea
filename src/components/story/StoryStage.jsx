import { forwardRef } from "react";
import { AnimatePresence } from "framer-motion";
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
      className="relative h-screen w-full overflow-hidden bg-[#FAFAFC] text-neutral-900 select-none"
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



      {/* 6. Main Editorial Two-Column Stage */}
      <div className="relative z-10 h-full w-full px-[10%] flex items-center justify-between">
        {/* Left Column: Headline, Description & Concept */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <StoryContent key={currentStory.id} story={currentStory} />
          </AnimatePresence>

          {/* Mobile Fallback for Impact Stats (Story 05) */}
          {currentStory.stats && (
            <div className="md:hidden mt-6 grid grid-cols-2 gap-3 max-w-[340px]">
              {currentStory.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white/85 backdrop-blur-md border border-black/[0.06] p-3 shadow-xs"
                >
                  <div className="text-3xl font-black tracking-tight text-neutral-950 flex items-baseline">
                    <span className="inline-block transform scale-x-110 origin-left">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-[#2547FF] ml-0.5 font-black">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.22em] font-black text-neutral-800 mt-1.5">
                    <span className="inline-block transform scale-x-105 origin-left">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Editorial Floating Image Cards / Impact Stats (Tablet & Desktop) */}
        <div className="hidden md:flex md:w-7/12 h-full items-center justify-end relative">
          <AnimatePresence mode="wait">
            <StoryVisual key={currentStory.id} story={currentStory} />
          </AnimatePresence>
        </div>

        {/* Mobile Single Primary Image Accent (Stories 01–04) */}
        {currentStory.images?.[0] && !currentStory.stats && (
          <div className="md:hidden absolute right-4 bottom-28 w-28 h-36 rounded-xl overflow-hidden shadow-lg border border-black/10 opacity-30 pointer-events-none rotate-3">
            <img
              src={currentStory.images[0].src}
              alt={currentStory.images[0].alt}
              className="w-full h-full object-cover filter grayscale"
            />
          </div>
        )}
      </div>

      {/* 7. Bottom Story Progress Indicator */}
      <StoryProgress
        stories={stories}
        activeIndex={activeIndex}
        onSelectStory={onSelectStory}
      />
    </div>
  );
});

export default StoryStage;
