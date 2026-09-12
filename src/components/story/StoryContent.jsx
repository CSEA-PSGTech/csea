import { motion } from "framer-motion";

/**
 * Editorial Left-Column Content Component
 * Displays the Eyebrow, split black/blue large Heading, Description, and Supporting Tag.
 * Transitions smoothly between the 5 story states.
 */
export function StoryContent({ story }) {
  if (!story) return null;

  return (
    <div className="relative z-10 w-full max-w-[440px] lg:max-w-[500px]">
      {/* Small uppercase label */}
      <motion.p
        key={`badge-${story.id}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-xs sm:text-sm font-black uppercase tracking-[0.38em] text-[#2547FF]"
      >
        {story.badge}
      </motion.p>

      {/* Oversized Heading with signature black + electric blue accent split */}
      <motion.h2
        key={`heading-${story.id}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="mt-4 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] leading-[0.94] text-neutral-950"
      >
        {story.headingPrefix && <span>{story.headingPrefix}</span>}
        {story.headingMiddle && (
          <>
            <br />
            <span>{story.headingMiddle}</span>
          </>
        )}
        <br />
        <span className="text-[#2547FF] font-black">{story.headingAccent}</span>
      </motion.h2>

      {/* Editorial Body Description */}
      <motion.p
        key={`desc-${story.id}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        className="mt-6 text-base sm:text-lg text-neutral-600 font-medium leading-[1.55] tracking-[-0.01em] max-w-[380px] lg:max-w-[420px]"
      >
        {story.description}
      </motion.p>

      {/* Supporting Concept */}
      <motion.div
        key={`supp-${story.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.28em] font-bold text-neutral-500"
      >
        <span>{story.supporting}</span>
      </motion.div>
    </div>
  );
}

export default StoryContent;
