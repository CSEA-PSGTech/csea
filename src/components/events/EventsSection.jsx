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

// ---- Date helpers ----
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Turns the sheet's date value into a timestamp (or null if it can't be read).
// Handles: "29/09/2026", "29-09-2026", "2026-09-29",
// "September 29 - 30, 2026", "29 Sep 2026", and Sheets serial numbers.
function parseEventDate(value) {
  if (value === null || value === undefined || value === "") return null;

  // Google Sheets / Excel serial number
  if (typeof value === "number" || /^\d{5}(\.\d+)?$/.test(String(value).trim())) {
    const n = Number(value);
    return Math.round((n - 25569) * 86400000);
  }

  const str = String(value).trim();

  // ISO: 2026-09-29
  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();

  // DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY (Indian format)
  m = str.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (m) {
    const year = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    return new Date(year, +m[2] - 1, +m[1]).getTime();
  }

  // Text dates like "September 29 - 30, 2026" or "29 Sep 2026"
  const yearMatch = str.match(/\b(\d{4})\b/);
  const monthMatch = str.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/);
  if (yearMatch && monthMatch) {
    const withoutYear = str.replace(yearMatch[0], "");
    const dayMatch = withoutYear.match(/\b(\d{1,2})\b/); // first day of a range
    const day = dayMatch ? +dayMatch[1] : 1;
    return new Date(+yearMatch[1], MONTHS.indexOf(monthMatch[1]), day).getTime();
  }

  const fallback = Date.parse(str);
  return Number.isNaN(fallback) ? null : fallback;
}

// Change this if your sheet column has a different name
function getEventDate(event) {
  return parseEventDate(event.date ?? event.startDate ?? event.eventDate);
}

function sortByDate(list, direction = "asc") {
  return [...list].sort((a, b) => {
    const da = getEventDate(a);
    const db = getEventDate(b);
    if (da === null && db === null) return 0;
    if (da === null) return 1; // undated events go last
    if (db === null) return -1;
    return direction === "asc" ? da - db : db - da;
  });
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

  // Independent gallery/modal state for each section, since they
  // render as two separate AccordionModal instances.
  const [activeIndexUpcoming, setActiveIndexUpcoming] = useState(0);
  const [modalOpenUpcoming, setModalOpenUpcoming] = useState(false);
  const [activeIndexCompleted, setActiveIndexCompleted] = useState(0);
  const [modalOpenCompleted, setModalOpenCompleted] = useState(false);

  // Tab the user picked by hand. null = automatic (Upcoming if any are scheduled, else Completed).
  const [userStatusTab, setUserStatusTab] = useState(null);

  const { events, loading, error } = useSheetEvents();

  const filteredEvents = useMemo(() => {
    const base =
      selectedCategory === "All Events"
        ? events
        : events.filter((e) => e.category === CATEGORY_VALUE_MAP[selectedCategory]);

    // Stable sort: upcoming/live first, completed last.
    return [...base].sort((a, b) => statusRank(a.status) - statusRank(b.status));
  }, [events, selectedCategory]);

  const upcomingEvents = useMemo(
    () =>
      sortByDate(
        filteredEvents.filter((e) => statusRank(e.status) !== STATUS_PRIORITY.completed),
        "asc" // soonest first
      ),
    [filteredEvents]
  );

  const completedEvents = useMemo(
    () =>
      sortByDate(
        filteredEvents.filter((e) => statusRank(e.status) === STATUS_PRIORITY.completed),
        "desc" // most recent first
      ),
    [filteredEvents]
  );

  // Upcoming is shown first whenever there is at least one upcoming event.
  const selectedStatusTab =
    userStatusTab ?? (upcomingEvents.length > 0 ? "Upcoming" : "Completed");

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setUserStatusTab(null);
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
      className="relative w-full py-12 sm:py-24 px-4 sm:px-8 md:px-[10%] flex flex-col justify-center overflow-hidden bg-transparent"
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8 mb-6 sm:mb-12">
          <div className="w-full max-w-2xl">
            <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#5258FF] lg:text-base">
              02 / Events
            </p>
            <h2 className="mt-2 sm:mt-4 text-2xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] sm:leading-[0.95] tracking-[-0.03em] sm:tracking-[-0.055em] text-neutral-900">
              Moments of craft &amp; code.
            </h2>
            <p className="mt-2 sm:mt-6 text-xs sm:text-base md:text-lg leading-[1.6] tracking-[-0.01em] text-black/60 lg:text-xl">
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
                      onClick={() => setUserStatusTab(tab)}
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