import { motion } from "framer-motion";
import { SparkleStar, WireframeWave, WireframeGlobe } from "./StoryDecorations";

/**
 * Editorial Image Card with clean black & white styling, tilt, and subtle drop shadow
 */
function ImageCard({ img, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: img.rotation * 1.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, rotate: img.rotation, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, y: -15 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
      className={`absolute ${img.position} ${img.width} ${img.height} rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-neutral-900 z-10 select-none group`}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover filter grayscale contrast-105 brightness-95 transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Card vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Embedded editorial caption if present */}
      {img.caption && (
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <p className="text-xs sm:text-sm font-bold tracking-tight uppercase leading-tight font-mono">
            {img.caption}
          </p>
          {img.subCaption && (
            <p className="text-[10px] sm:text-xs text-white/70 font-mono tracking-wider mt-0.5">
              {img.subCaption}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

/**
 * Impact Statistics Grid for Story 05
 * Styled with thick, stretched typography (scale-x, font-black, wide tracking)
 * and ambient contrast halo for maximum legibility against the blue path.
 */
function ImpactStatsGrid({ stats = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.04, y: -15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-[4%] sm:right-[8%] lg:right-[10%] top-[14%] lg:top-[18%] z-20 w-[380px] sm:w-[480px] lg:w-[560px]"
    >
      <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            className="relative rounded-2xl bg-white/85 backdrop-blur-md border border-black/[0.06] p-5 sm:p-6 lg:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            {/* Thick, stretched large metric numbers */}
            <div className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] text-neutral-950 flex items-baseline select-none">
              <span className="inline-block transform scale-x-110 origin-left">
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-[#2547FF] inline-block transform scale-x-110 origin-left ml-1 font-black">
                  {stat.suffix}
                </span>
              )}
            </div>

            {/* Thick, stretched uppercase labels */}
            <div className="mt-3">
              <span className="inline-block transform scale-x-105 origin-left text-[11px] sm:text-xs lg:text-[13px] uppercase tracking-[0.24em] sm:tracking-[0.28em] font-black text-neutral-800 leading-tight">
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * StoryVisual Component (Right-column composition)
 */
export function StoryVisual({ story }) {
  if (!story) return null;

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[600px] pointer-events-none">
      {/* Editorial Floating Images (Stories 01–04) */}
      {story.images &&
        story.images.map((img, i) => (
          <ImageCard key={img.id} img={img} index={i} />
        ))}

      {/* Impact Statistics Matrix (Story 05) */}
      {story.stats && <ImpactStatsGrid stats={story.stats} />}

      {/* Decorative Overlays per Story State */}
      {story.metadata?.sparkle && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute right-[44%] top-[34%] z-20 pointer-events-none"
        >
          <SparkleStar className="w-6 h-6 animate-pulse" />
        </motion.div>
      )}

      {story.metadata?.doodle && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute right-[12%] top-[6%] z-20 pointer-events-none text-right"
        >
          <span className="text-[10px] sm:text-xs font-mono tracking-wider uppercase text-neutral-400">
            {story.metadata.doodle} ↗
          </span>
        </motion.div>
      )}

      {story.metadata?.quote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute right-[18%] bottom-[12%] z-20 pointer-events-none"
        >
          <p className="text-xs sm:text-sm font-serif italic text-neutral-500 max-w-[180px]">
            {story.metadata.quote}
          </p>
        </motion.div>
      )}

      {story.metadata?.hasMeshWave && (
        <div className="absolute left-[20%] bottom-0 z-0 w-80 h-40">
          <WireframeWave className="w-full h-full" />
        </div>
      )}

      {story.metadata?.hasGlobe && (
        <div className="absolute right-[6%] bottom-[4%] z-0 w-64 h-64 sm:w-80 sm:h-80 opacity-40">
          <WireframeGlobe className="w-full h-full" />
        </div>
      )}

      {/* Corner Metadata Labels */}
      {story.metadata?.topRight && (
        <div className="absolute right-[6%] top-[3%] text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
          {story.metadata.topRight}
        </div>
      )}

      {story.metadata?.bottomRight && (
        <div className="absolute right-[6%] bottom-[4%] text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
          {story.metadata.bottomRight}
        </div>
      )}
    </div>
  );
}

export default StoryVisual;
