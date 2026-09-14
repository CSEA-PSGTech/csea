import { motion } from "framer-motion";

/**
 * Minimal Story Progress Indicator (01 02 03 04 05)
 * Remains visually pinned at the bottom of the stage.
 * Highlights the active story with an electric blue underline bar.
 * Supports clicking to jump to each story checkpoint.
 */
export function StoryProgress({ stories = [], activeIndex = 0, onSelectStory }) {
  return (
    <div className="absolute left-6 sm:left-[10%] bottom-8 sm:bottom-10 z-30 flex items-center gap-5 sm:gap-8 select-none">
      {stories.map((story, i) => {
        const isActive = activeIndex === i;

        return (
          <button
            key={story.id}
            onClick={() => onSelectStory && onSelectStory(i)}
            className="group relative flex flex-col items-center cursor-pointer transition-colors py-1 focus:outline-none"
            aria-label={`Jump to story ${story.number}: ${story.label}`}
          >
            {/* Story Number */}
            <span
              className={`text-xs sm:text-sm font-semibold tracking-wider transition-colors duration-300 ${
                isActive
                  ? "text-[#2547FF]"
                  : "text-neutral-400 group-hover:text-neutral-700"
              }`}
            >
              {story.number}
            </span>

            {/* Subtle Underline on Active State */}
            {isActive && (
              <motion.div
                layoutId="storyActiveUnderline"
                className="absolute -bottom-1 h-[2px] w-5 bg-[#2547FF] rounded-full"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default StoryProgress;
