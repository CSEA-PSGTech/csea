import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { EVENTS_DATA } from "../events/eventsData";

/**
 * Single Accordion Item in the strip — Apple-style minimalism
 */
function GalleryItem({
  item,
  isActive,
  onActivate,
  onOpenModal,
}) {
  return (
    <motion.div
      layout
      whileTap={{ scale: 0.99 }}
      onMouseEnter={onActivate}
      onClick={onOpenModal}
      className={`relative h-[420px] sm:h-[460px] md:h-[500px] rounded-[24px] overflow-hidden cursor-pointer shrink-0 transition-[width] ease-[cubic-bezier(0.25,1,0.5,1)] duration-500 select-none ${
        isActive
          ? "w-[280px] sm:w-[420px] md:w-[520px] lg:w-[600px] shadow-2xl"
          : "w-[44px] sm:w-[54px] md:w-[64px] opacity-65 hover:opacity-90"
      }`}
    >
      {/* Background Image */}
      <motion.img
        src={item.url}
        alt={item.title}
        layoutId={`event-img-${item.id}`}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
      />

      {/* Subtle Vignette Gradient */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isActive
            ? "bg-gradient-to-t from-black/90 via-black/30 to-black/10"
            : "bg-black/55 hover:bg-black/40"
        }`}
      />

      {/* Active Card Content — Minimal & Restrained */}
      {isActive ? (
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10 text-white">
          {/* Top minimal category badge */}
          <div>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10">
              {item.category}
            </span>
          </div>

          {/* Bottom typography */}
          <div className="space-y-3">
            <p className="text-xs text-white/70 font-medium tracking-wide">
              {item.date} • {item.venue}
            </p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
              {item.title}
            </h3>
            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed max-w-md font-normal">
              {item.tagline || item.description}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-md transition-all border border-white/20">
                View Event
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed Spine — Pure, Clean Typography */
        <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
          <div className="rotate-180 [writing-mode:vertical-rl] text-xs font-medium tracking-wider uppercase text-white/75 whitespace-nowrap">
            {item.title}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Minimalist Apple-style Event Modal via React Portal
 */
export function EventModal({ item, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  // Completed events don't need a registration call-to-action —
  // status comparison is case-insensitive since sheet values may
  // vary ("Completed", "completed", etc.).
  const isCompleted = item?.status?.trim().toLowerCase() === "completed";

  return createPortal(
    <AnimatePresence>
      {isOpen && item && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white text-neutral-900 rounded-[28px] overflow-hidden shadow-2xl border border-black/10 my-auto z-10 flex flex-col"
          >
            {/* Header Image */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
              <motion.img
                src={item.url}
                alt={item.title}
                layoutId={`event-img-${item.id}`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Category pill on image */}
              <div className="absolute bottom-4 left-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                  {item.date} • {item.venue}
                </p>
              </div>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                {item.description}
              </p>

              {/* Action Buttons */}
              <div
                className={`pt-4 flex items-center border-t border-neutral-100 ${
                  isCompleted ? "justify-start" : "justify-between"
                }`}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-900 px-3 py-2 transition-colors"
                >
                  Close
                </button>

                {/* Completed events skip the registration CTA entirely */}
                {!isCompleted && (
                  <a
                    href={item.registrationLink || "#"}
                    onClick={(e) => {
                      if (!item.registrationLink || item.registrationLink.startsWith("#")) {
                        e.preventDefault();
                        alert(`Registration/Details for "${item.title}" will open soon!`);
                      }
                    }}
                    target={item.registrationLink ? "_blank" : undefined}
                    rel={item.registrationLink ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-sm"
                  >
                    <span>Register for Event</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * Gallery Accordion Component with no scrollbars
 */
export function Gallery({
  items = EVENTS_DATA,
  index = 0,
  setIndex,
  setOpen,
}) {
  const containerRef = useRef(null);

  // Smoothly center the active item when index changes
  useEffect(() => {
    if (!containerRef.current) return;
    const activeChild = containerRef.current.children[index];
    if (activeChild) {
      activeChild.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [index]);

  return (
    <div className="w-full flex items-center justify-start py-2 overflow-hidden">
      <div
        ref={containerRef}
        className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto no-scrollbar py-4 max-w-full"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((item, i) => (
          <GalleryItem
            key={item.id}
            item={item}
            isActive={index === i}
            onActivate={() => setIndex(i)}
            onOpenModal={() => {
              setIndex(i);
              setOpen(true);
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Main Combined AccordionModal Component
 */
export default function AccordionModal({
  items = EVENTS_DATA,
  index = 0,
  setIndex,
  open = false,
  setOpen,
}) {
  const safeIndex = index < items.length ? index : 0;
  const activeItem = items[safeIndex] || items[0];

  return (
    <div className="relative w-full">
      <Gallery
        items={items}
        index={safeIndex}
        setIndex={setIndex}
        setOpen={setOpen}
      />

      <EventModal
        item={activeItem}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}