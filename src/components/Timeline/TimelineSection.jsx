import { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTimeline } from "./useTimeline";

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const FILTERS = ["All", "This Month", "Previous Month", "Older"];

// Parses free-text dates like "17 - 21 August 2026" or "21 August 2026"
// down to just { month, year } — good enough to bucket entries by
// month without needing a fully parseable date format in the sheet.
function parseMonthYear(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.toLowerCase().match(/([a-z]+)\s+(\d{4})/);
  if (!match) return null;
  const month = MONTH_NAMES.indexOf(match[1]);
  const year = parseInt(match[2], 10);
  if (month === -1 || Number.isNaN(year)) return null;
  return { month, year };
}

function getBucket(entry, now) {
  const parsed = parseMonthYear(entry.date);
  if (!parsed) return "Older"; // unparseable dates fall back to Older rather than being hidden

  const nowMonth = now.getMonth();
  const nowYear = now.getFullYear();
  if (parsed.month === nowMonth && parsed.year === nowYear) return "This Month";

  let prevMonth = nowMonth - 1;
  let prevYear = nowYear;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear -= 1;
  }
  if (parsed.month === prevMonth && parsed.year === prevYear) return "Previous Month";

  return "Older";
}

// For sorting recent -> older. Pulls the FIRST day out of a range
// ("17 - 21 August 2026" -> 17) along with month/year, builds a
// real Date for comparison. Entries whose date can't be parsed sort
// to the very end (oldest), rather than throwing off the order of
// everything else.
function parseSortDate(dateStr) {
  if (!dateStr) return null;
  const match = dateStr
    .toLowerCase()
    .match(/(\d{1,2})\s*(?:-\s*\d{1,2}\s*)?([a-z]+)\s+(\d{4})/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const month = MONTH_NAMES.indexOf(match[2]);
  const year = parseInt(match[3], 10);
  if (month === -1 || Number.isNaN(day) || Number.isNaN(year)) return null;
  return new Date(year, month, day).getTime();
}

/**
 * TimelineModal
 * A centered card floating over a translucent, blurred backdrop —
 * opened when a timeline entry is clicked. Portaled to document.body
 * so it isn't affected by the horizontal-scroll container's overflow
 * clipping, same reasoning as EventModal in gallery.jsx.
 */
function TimelineModal({ entry, onClose }) {
  const [imageExpanded, setImageExpanded] = useState(false);

  useEffect(() => {
    if (!entry) setImageExpanded(false);
  }, [entry]);

  useEffect(() => {
    if (!entry) return undefined;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (imageExpanded) {
          setImageExpanded(false);
        } else {
          onClose();
        }
      }
    }
    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [entry, onClose, imageExpanded]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {entry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[999999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-neutral-100 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 shadow-sm"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>

            {entry.preview && (
              <button
                type="button"
                onClick={() => setImageExpanded(true)}
                aria-label="View photo full size"
                className="group relative block w-full rounded-t-[24px] sm:rounded-t-[28px] overflow-hidden bg-neutral-100 cursor-pointer"
              >
                <img
                  src={entry.preview}
                  alt={entry.title}
                  className="w-full h-full object-cover aspect-[16/10] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            )}

            <div className="p-6 sm:p-8">
              {entry.date && (
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5258FF] bg-[#EEF1FF] border border-[#5258FF]/15 px-3 py-1 rounded-full mb-4">
                  {entry.date}
                </span>
              )}

              <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight leading-snug mb-3">
                {entry.title}
              </h3>

              {entry.description && (
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed whitespace-pre-line">
                  {entry.description}
                </p>
              )}
            </div>
          </motion.div>

          {/* Full-size photo lightbox, layered above this modal */}
          <AnimatePresence>
            {imageExpanded && entry.preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageExpanded(false);
                }}
                className="fixed inset-0 z-[1000000] bg-black/90 flex items-center justify-center p-4 sm:p-8"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageExpanded(false);
                  }}
                  aria-label="Close photo"
                  className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>

                <motion.img
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={entry.preview}
                  alt={entry.title}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * TimelineEntry
 * One stop on the horizontal axis. Alternates above/below the running
 * line based on its position (even = above, odd = below). Clicking a
 * card opens it in TimelineModal — the card itself stays static/small,
 * a fixed-height box on each half so the axis dots never shift.
 */
function TimelineEntry({ entry, index, onSelect, hasDraggedRef }) {
  const isAbove = index % 2 === 0;

  const card = (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      onClick={() => {
        if (hasDraggedRef?.current) return;
        onSelect(entry);
      }}
      className="w-[70vw] max-w-[250px] sm:w-[320px] sm:max-w-none rounded-[16px] sm:rounded-[20px] bg-white border border-black/5 cursor-pointer p-3 sm:p-5 shadow-xs hover:shadow-lg hover:border-[#5258FF]/20 transition-all duration-300 select-none"
    >
      {entry.preview && (
        <div className="w-full rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100 mb-2 sm:mb-3 pointer-events-none">
          <img
            src={entry.preview}
            alt={entry.title}
            className="w-full h-full object-cover aspect-[16/10]"
            loading="lazy"
          />
        </div>
      )}

      <h3 className="text-sm sm:text-lg font-semibold text-neutral-900 tracking-tight leading-snug mb-1 sm:mb-1.5">
        {entry.title}
      </h3>

      {entry.description && (
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
          {entry.description}
        </p>
      )}
    </motion.div>
  );

  return (
    <div className="snap-start shrink-0 flex flex-col items-center w-[70vw] max-w-[250px] sm:w-[320px] sm:max-w-none">
      {/* Top half: On mobile, ALL cards sit above the axis in strict 1, 2, 3, 4 order. On desktop (sm:), alternates based on index. */}
      <div className="relative w-full flex items-end justify-center pb-3 sm:pb-0 sm:h-[250px]">
        <div className={`sm:absolute sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 ${isAbove ? "block" : "block sm:hidden"}`}>
          {card}
        </div>
      </div>

      {/* Stem + dot sitting on the axis */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className={`w-px h-5 sm:h-6 bg-[#5258FF]/30 ${isAbove ? "order-1" : "order-1 sm:order-3"}`} />
        <div className="order-2 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-[#5258FF] ring-4 ring-white shadow-[0_0_0_1px_rgba(82,88,255,0.15)] z-10" />
        {entry.date && (
          <span
            className={`order-4 absolute ${
              isAbove
                ? "top-full mt-2 sm:mt-2.5"
                : "top-full mt-2 sm:mt-2.5 sm:top-auto sm:bottom-full sm:mb-2.5"
            } whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#5258FF] bg-[#EEF1FF] border border-[#5258FF]/25 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs z-20 select-none`}
          >
            {entry.date}
          </span>
        )}
      </div>

      {/* Bottom half: Reserved height for date badge on mobile, full card half on desktop (sm:) */}
      <div className="relative w-full h-12 sm:h-[250px]">
        {!isAbove && (
          <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2">{card}</div>
        )}
      </div>
    </div>
  );
}

export function TimelineSection() {
  const { timeline, loading, error } = useTimeline();
  const scrollerRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const hasDraggedRef = useRef(false);

  const now = useMemo(() => new Date(), []);

  const filteredTimeline = useMemo(() => {
    const base =
      activeFilter === "All"
        ? timeline
        : timeline.filter((entry) => getBucket(entry, now) === activeFilter);

    // Recent -> older. Unparseable dates sort last.
    return [...base].sort((a, b) => {
      const da = parseSortDate(a.date) ?? -Infinity;
      const db = parseSortDate(b.date) ?? -Infinity;
      return db - da;
    });
  }, [timeline, activeFilter, now]);

  const scrollByEntry = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.firstChild ? el.firstChild.offsetWidth + 24 : 320; // + gap
    el.scrollBy({ left: direction * width, behavior: "smooth" });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const el = scrollerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(x - startX) > 5) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative w-full py-12 sm:py-28 lg:py-32 px-4 sm:px-8 md:px-[10%] bg-transparent overflow-x-hidden overflow-y-hidden">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8 mb-6 sm:mb-10">
          <div className="w-full max-w-2xl">
            <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
              03 / News & Timeline
            </p>
            <h2 className="mt-2 sm:mt-4 text-2xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] sm:leading-[0.95] tracking-[-0.03em] sm:tracking-[-0.055em] text-neutral-900">
              Our year in motion.
            </h2>
            <p className="mt-2 sm:mt-6 text-xs sm:text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl">
              A running record of what CSEA has been up to, as it happens.
            </p>
          </div>

          {!loading && !error && timeline.length > 0 && (
            <div className="flex items-center gap-1.5 self-start md:self-end">
              <button
                type="button"
                onClick={() => scrollByEntry(-1)}
                aria-label="Earlier"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={() => scrollByEntry(1)}
                aria-label="Later"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          )}
        </div>

        {/* Filter pills */}
        {!loading && !error && timeline.length > 0 && (
          <div className="mb-10 sm:mb-14 overflow-x-auto scrollbar-none">
            <div className="inline-flex items-center p-1 rounded-full bg-neutral-100/90 backdrop-blur-md border border-black/5 whitespace-nowrap">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer shrink-0 ${
                      isActive ? "text-neutral-950 font-semibold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="timelineFilterIndicator"
                        className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/5"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{filter}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* States */}
        {loading && (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
            Loading timeline…
          </div>
        )}

        {!loading && error && (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-red-500">Couldn't load the timeline.</p>
            <p className="max-w-sm text-xs text-neutral-400">{error}</p>
          </div>
        )}

        {!loading && !error && timeline.length === 0 && (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
            Nothing on the timeline yet.
          </div>
        )}

        {!loading && !error && timeline.length > 0 && filteredTimeline.length === 0 && (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
            Nothing in this range yet.
          </div>
        )}

        {/* Axis + entries */}
        {!loading && !error && filteredTimeline.length > 0 && (
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-[#5258FF]/0 via-[#5258FF]/25 to-[#5258FF]/0" />

            <div
              ref={scrollerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`relative flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar -mx-5 px-5 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 pt-6 pb-12 sm:py-8 ${
                isDragging ? "cursor-grabbing select-none" : "cursor-grab"
              }`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                touchAction: "pan-x pan-y",
                overscrollBehaviorY: "none",
                overscrollBehaviorX: "contain",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {filteredTimeline.map((entry, i) => (
                <TimelineEntry
                  key={entry.rowIndex ?? `${entry.id}-${i}`}
                  entry={entry}
                  index={i}
                  onSelect={setSelectedEntry}
                  hasDraggedRef={hasDraggedRef}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <TimelineModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </section>
  );
}

export default TimelineSection;