import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AccordionModal from "../ui/gallery";

const EVENT_CATEGORIES = ["All Events", "Events", "Symposiums", "Hackathons", "Workshops"];

const CATEGORY_VALUE_MAP = {
  Events: "Events",
  Symposiums: "Symposium",
  Hackathons: "Hackathon",
  Workshops: "Workshop",
};


const STATUS_PRIORITY = {
  live: 0,
  ongoing: 0,
  upcoming: 1,
  unknown: 2,
  completed: 3,
};

function statusRank(status) {
  const key = (status || "").trim().toLowerCase();
  return STATUS_PRIORITY[key] ?? STATUS_PRIORITY.unknown;
}

// ---- Hook: load events from the backend ----
function useSheetEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${base}/api/events`);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Request failed (status ${res.status})`);
      }

      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, refetch: load };
}

// ---- Component ----
export function EventsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");

  // Independent gallery/modal state for each section, since they now
  // render as two separate AccordionModal instances.
  const [activeIndexUpcoming, setActiveIndexUpcoming] = useState(0);
  const [modalOpenUpcoming, setModalOpenUpcoming] = useState(false);
  const [activeIndexCompleted, setActiveIndexCompleted] = useState(0);
  const [modalOpenCompleted, setModalOpenCompleted] = useState(false);

  // Single toggle: which list is currently shown — "Upcoming" or "Completed".
  const [selectedStatusTab, setSelectedStatusTab] = useState("Completed");

  const { events, loading, error } = useSheetEvents();

  const filteredEvents = useMemo(() => {
    const base =
      selectedCategory === "All Events"
        ? events
        : events.filter((e) => e.category === CATEGORY_VALUE_MAP[selectedCategory]);

    // Stable sort: upcoming/live first, completed last. Array.prototype.sort
    // is stable in modern JS engines, so events with equal status keep
    // their original sheet order relative to each other.
    return [...base].sort((a, b) => statusRank(a.status) - statusRank(b.status));
  }, [events, selectedCategory]);

  const upcomingEvents = useMemo(
    () => filteredEvents.filter((e) => statusRank(e.status) !== STATUS_PRIORITY.completed),
    [filteredEvents]
  );

  const completedEvents = useMemo(
    () => filteredEvents.filter((e) => statusRank(e.status) === STATUS_PRIORITY.completed),
    [filteredEvents]
  );

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setActiveIndexUpcoming(0);
    setActiveIndexCompleted(0);
  };

  const handlePrevUpcoming = () => {
    setActiveIndexUpcoming((prev) => (prev > 0 ? prev - 1 : Math.max(upcomingEvents.length - 1, 0)));
  };

  const handleNextUpcoming = () => {
    setActiveIndexUpcoming((prev) => (prev < upcomingEvents.length - 1 ? prev + 1 : 0));
  };

  const handlePrevCompleted = () => {
    setActiveIndexCompleted((prev) => (prev > 0 ? prev - 1 : Math.max(completedEvents.length - 1, 0)));
  };

  const handleNextCompleted = () => {
    setActiveIndexCompleted((prev) => (prev < completedEvents.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      id="events"
      className="relative w-full py-16 sm:py-24 px-5 sm:px-8 md:px-[10%] flex flex-col justify-center overflow-hidden bg-transparent"
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="w-full max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
              02 / Events
            </p>
            <h2 className="mt-3 sm:mt-4 text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.02] sm:leading-[0.95] tracking-[-0.055em] text-neutral-900">
              Moments of craft &amp; code.
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl">
              Flagship hackathons, technical symposiums, and hands-on developer workshops.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-start md:self-end w-full sm:w-auto">
            {/* Upcoming / Completed toggle */}
            <div className="w-full sm:w-auto py-1">
              <div className="inline-flex items-center p-1 rounded-full bg-neutral-100/90 backdrop-blur-md border border-black/5 whitespace-nowrap">
                {["Upcoming", "Completed"].map((tab) => {
                  const isActive = selectedStatusTab === tab;
                  const count = tab === "Upcoming" ? upcomingEvents.length : completedEvents.length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setSelectedStatusTab(tab)}
                      className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer shrink-0 ${
                        isActive ? "text-[#5258FF] font-semibold" : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="statusTabIndicator"
                          className="absolute inset-0 rounded-full bg-[#EEF1FF] shadow-sm border border-[#5258FF]/15"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">
                        {tab} <span className="text-neutral-400">({count})</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Pills (Horizontal scroll on mobile, no wrap) */}
            <div className="w-full sm:w-auto overflow-x-auto scrollbar-none py-1">
              <div className="inline-flex items-center p-1 rounded-full bg-neutral-100/90 backdrop-blur-md border border-black/5 whitespace-nowrap">
                {EVENT_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer shrink-0 ${
                        isActive ? "text-neutral-950 font-semibold" : "text-neutral-500 hover:text-neutral-900"
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
            </div>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="w-full">
          {loading && (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              Loading events…
            </div>
          )}

          {!loading && error && (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm font-medium text-red-500">Couldn't load events.</p>
              <p className="max-w-sm text-xs text-neutral-400">{error}</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              No events in this category yet.
            </div>
          )}

          {/* Upcoming / Completed — only the selected tab renders */}
          <AnimatePresence mode="wait">
            {selectedStatusTab === "Upcoming" && !loading && !error && upcomingEvents.length > 0 && (
              <motion.div
                key={"upcoming-" + selectedCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full overflow-hidden"
              >
                <div className="flex items-center justify-end gap-2 mb-4 sm:mb-6">
                  <span className="text-xs font-mono font-medium text-neutral-400">
                    {String(activeIndexUpcoming + 1).padStart(2, "0")} / {String(upcomingEvents.length).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevUpcoming}
                      aria-label="Previous upcoming event"
                      disabled={upcomingEvents.length === 0}
                      className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextUpcoming}
                      aria-label="Next upcoming event"
                      disabled={upcomingEvents.length === 0}
                      className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>

                <AccordionModal
                  items={upcomingEvents}
                  index={activeIndexUpcoming}
                  setIndex={setActiveIndexUpcoming}
                  open={modalOpenUpcoming}
                  setOpen={setModalOpenUpcoming}
                />
              </motion.div>
            )}

            {selectedStatusTab === "Upcoming" && !loading && !error && upcomingEvents.length === 0 && (
              <motion.div
                key="upcoming-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-64 items-center justify-center text-sm text-neutral-400"
              >
                No upcoming events in this category.
              </motion.div>
            )}

            {selectedStatusTab === "Completed" && !loading && !error && completedEvents.length > 0 && (
              <motion.div
                key={"completed-" + selectedCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full overflow-hidden"
              >
                <div className="flex items-center justify-end gap-2 mb-4 sm:mb-6">
                  <span className="text-xs font-mono font-medium text-neutral-400">
                    {String(activeIndexCompleted + 1).padStart(2, "0")} / {String(completedEvents.length).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevCompleted}
                      aria-label="Previous completed event"
                      disabled={completedEvents.length === 0}
                      className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextCompleted}
                      aria-label="Next completed event"
                      disabled={completedEvents.length === 0}
                      className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all border border-black/5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>

                <AccordionModal
                  items={completedEvents}
                  index={activeIndexCompleted}
                  setIndex={setActiveIndexCompleted}
                  open={modalOpenCompleted}
                  setOpen={setModalOpenCompleted}
                />
              </motion.div>
            )}

            {selectedStatusTab === "Completed" && !loading && !error && completedEvents.length === 0 && (
              <motion.div
                key="completed-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-64 items-center justify-center text-sm text-neutral-400"
              >
                No completed events in this category.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default EventsSection;