import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AccordionModal from "../ui/gallery";
import { EVENTS_DATA, EVENT_CATEGORIES } from "./eventsData";

export function EventsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter events based on active category
  const filteredEvents = useMemo(() => {
    if (selectedCategory === "All Events") {
      return EVENTS_DATA;
    }
    return EVENTS_DATA.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  // Apple-style carousel navigation
  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredEvents.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < filteredEvents.length - 1 ? prev + 1 : 0));
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setActiveIndex(0);
  };

  return (
    <section
      id="events"
      className="relative w-full py-24 px-[10%] flex flex-col justify-center overflow-hidden bg-transparent"
    >
      <div className="w-full">
        {/* Section Header — Aligned exactly to left-[10%] matching 05 / Culture */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="w-full max-w-[380px] lg:max-w-[460px]">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
              02 / Events
            </p>
            <h2 className="mt-4 text-5xl font-medium leading-[0.95] tracking-[-0.055em] lg:text-6xl text-neutral-900">
              Moments of craft &amp; code.
            </h2>
            <p className="mt-6 text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl">
              Flagship hackathons, technical symposiums, and hands-on developer workshops.
            </p>
          </div>

          {/* Controls: Apple Segmented Category Filter + Circular Arrow Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            {/* Segmented Category Control */}
            <div className="inline-flex items-center p-1 rounded-full bg-neutral-100/90 backdrop-blur-md border border-black/5">
              {EVENT_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                      isActive
                        ? "text-neutral-950 font-semibold"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="appleCategoryIndicator"
                        className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/5"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Apple Circular Arrow Navigation Buttons */}
            <div className="flex items-center gap-1.5 pl-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous event"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next event"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <AccordionModal
                items={filteredEvents}
                index={activeIndex}
                setIndex={setActiveIndex}
                open={modalOpen}
                setOpen={setModalOpen}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default EventsSection;
