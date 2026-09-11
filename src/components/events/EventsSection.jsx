import { useMemo, useState, useRef, useCallback, useLayoutEffect } from "react";

/* =====================================================
   EventsSection — white/blue contribution chart

   Single-file GitHub-contribution-style heatmap: white
   background, blue intensity ramp. Clicking a filled cell
   grows a detail card out from that cell (FLIP animation)
   listing the events logged that day.

   USAGE
   -----
   <EventsSection events={events} />

   events = [
     { date: "2026-01-14", title: "Kickoff Meetup", count: 1 },
   ]
   Omit `events` and sample data renders instead.
===================================================== */

// ---- Palette ----
const LEVELS = [
  "#EEF2F9", // 0 — empty cell
  "#CBDDF9", // 1
  "#93B9F3", // 2
  "#4F82E8", // 3
  "#0B3FBF", // 4 — most active
];

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const CELL = 14;
const GAP = 3;

function toKey(d) {
  return d.toISOString().slice(0, 10);
}
function startOfWeek(d) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildSampleEvents() {
  const titles = [
    "General Body Meeting",
    "Workshop: Getting Started",
    "Guest Talk",
    "Hack Night",
    "Team Sync",
    "Outreach Drive",
    "Project Demo Day",
    "Study Jam",
  ];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);

  const out = [];
  for (let i = 0; i < 364; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const frac = seed - Math.floor(seed);
    if (frac > 0.88) {
      const numEvents = frac > 0.965 ? 2 : 1;
      for (let n = 0; n < numEvents; n++) {
        out.push({
          date: toKey(d),
          title: titles[Math.floor(Math.abs(seed) * (n + 1)) % titles.length],
          count: 1,
        });
      }
    }
  }
  return out;
}

// ---- Grid ----
function ContributionGrid({ byDate, onHover, onLeave, onSelect }) {
  const { weeks, monthMarkers, maxCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const gridStart = startOfWeek(new Date(today.getTime() - 364 * DAY_MS));

    const weeksArr = [];
    let cursor = new Date(gridStart);
    let max = 0;

    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const key = toKey(cursor);
        const dayEvents = byDate.get(key) || [];
        const count = dayEvents.reduce((sum, e) => sum + (e.count || 1), 0);
        max = Math.max(max, count);
        week.push({
          date: new Date(cursor),
          key,
          count,
          events: dayEvents,
          future: cursor > today,
        });
        cursor = new Date(cursor.getTime() + DAY_MS);
      }
      weeksArr.push(week);
    }

    const markers = [];
    let lastMonth = null;
    weeksArr.forEach((week, wi) => {
      const firstOfMonthDay = week.find((day) => day.date.getDate() <= 7);
      if (firstOfMonthDay) {
        const m = firstOfMonthDay.date.getMonth();
        if (m !== lastMonth) {
          markers.push({
            weekIndex: wi,
            label: firstOfMonthDay.date.toLocaleString("en-US", { month: "short" }),
          });
          lastMonth = m;
        }
      }
    });

    return { weeks: weeksArr, monthMarkers: markers, maxCount: max };
  }, [byDate]);

  const levelFor = useCallback(
    (count) => {
      if (count <= 0) return 0;
      if (maxCount <= 1) return count > 0 ? 3 : 0;
      const ratio = count / maxCount;
      if (ratio > 0.75) return 4;
      if (ratio > 0.5) return 3;
      if (ratio > 0.25) return 2;
      return 1;
    },
    [maxCount]
  );

  const step = CELL + GAP;

  return (
    <div className="min-w-[780px]">
      <div className="relative mb-2 h-4 pl-8">
        {monthMarkers.map((m) => (
          <span
            key={`${m.label}-${m.weekIndex}`}
            className="absolute text-xs font-medium text-[#5C6B85]"
            style={{ left: `${m.weekIndex * step}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex" style={{ gap: GAP }}>
        <div className="mr-1 flex flex-col" style={{ gap: GAP }}>
          {WEEKDAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-end pr-1 text-[10px] text-[#94A2BE]"
              style={{ height: CELL, width: 28 }}
            >
              {label}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
            {week.map((day) => {
              const level = levelFor(day.count);
              return (
                <button
                  key={day.key}
                  type="button"
                  disabled={day.future}
                  onMouseEnter={(e) => day.count && onHover?.(e, day)}
                  onMouseLeave={onLeave}
                  onFocus={(e) => day.count && onHover?.(e, day)}
                  onBlur={onLeave}
                  onClick={(e) => day.count && onSelect?.(e, day)}
                  aria-label={
                    day.count
                      ? `${day.count} event${day.count > 1 ? "s" : ""} on ${day.date.toDateString()}`
                      : `No events on ${day.date.toDateString()}`
                  }
                  className={`rounded-[3px] transition-transform duration-100 ${
                    day.future ? "opacity-0" : "hover:scale-125"
                  } ${day.count ? "cursor-pointer" : "cursor-default"}`}
                  style={{
                    height: CELL,
                    width: CELL,
                    backgroundColor: LEVELS[level],
                    outline: day.count ? "1px solid rgba(11,63,191,0.12)" : "none",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-6 flex items-center justify-end gap-2 pl-8 text-xs text-[#94A2BE]">
      <span>Less</span>
      {LEVELS.map((color, i) => (
        <span key={i} className="h-[12px] w-[12px] rounded-[3px]" style={{ backgroundColor: color }} />
      ))}
      <span>More</span>
    </div>
  );
}

function EventTooltip({ x, y, label, items }) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-[#E4E9F2] bg-[#0B1220] px-3 py-2 text-left text-white shadow-lg"
      style={{ left: x, top: y, minWidth: "160px" }}
    >
      <div className="text-[11px] font-medium text-[#93B9F3]">{label}</div>
      <ul className="mt-1 space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-[12px] leading-snug text-white">
            {item.title}
          </li>
        ))}
      </ul>
      <div
        className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#0B1220]"
        aria-hidden
      />
    </div>
  );
}

// ---- Click-to-expand detail card (FLIP animation) ----
function EventDetailOverlay({ day, originRect, onClose }) {
  const cardRef = useRef(null);
  const [phase, setPhase] = useState("enter");

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el || !originRect) return;

    const finalRect = el.getBoundingClientRect();
    const scaleX = originRect.width / finalRect.width;
    const scaleY = originRect.height / finalRect.height;
    const dx = originRect.left + originRect.width / 2 - (finalRect.left + finalRect.width / 2);
    const dy = originRect.top + originRect.height / 2 - (finalRect.top + finalRect.height / 2);

    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    el.style.opacity = "0.4";
    el.style.borderRadius = "4px";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition =
          "transform 320ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease, border-radius 320ms ease";
        el.style.transform = "translate(0, 0) scale(1, 1)";
        el.style.opacity = "1";
        el.style.borderRadius = "16px";
        setPhase("settled");
      });
    });
  }, [originRect]);

  function handleClose() {
    const el = cardRef.current;
    if (el) {
      el.style.transition = "transform 180ms ease, opacity 180ms ease";
      el.style.transform = "translate(0, 0) scale(0.92, 0.92)";
      el.style.opacity = "0";
    }
    setPhase("exit");
    setTimeout(onClose, 170);
  }

  if (!day) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-6"
      style={{
        backgroundColor: "rgba(11,18,32,0.35)",
        backdropFilter: "blur(3px)",
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 200ms ease",
      }}
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden border border-[#E4E9F2] bg-white p-7 shadow-2xl"
        style={{ transformOrigin: "center" }}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#E4E9F2] text-[#5C6B85] transition-colors hover:border-[#0B3FBF] hover:text-[#0B3FBF]"
        >
          ×
        </button>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0B3FBF]">
          {formatDate(day.key)}
        </div>
        <div className="mt-1 text-[12px] text-[#94A2BE]">
          {day.count} event{day.count > 1 ? "s" : ""} logged
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {day.events.map((ev, i) => (
            <div key={i} className={`pb-4 ${i < day.events.length - 1 ? "border-b border-[#EEF2F9]" : ""}`}>
              <h3 className="text-lg font-semibold leading-snug text-[#0B1220]">{ev.title}</h3>
              {ev.description && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#5C6B85]">{ev.description}</p>
              )}
              {(ev.time || ev.location) && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#94A2BE]">
                  {ev.time && <span>{ev.time}</span>}
                  {ev.location && <span>{ev.location}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Main section ----
export default function EventsSection({ events, title = "Events", subtitle }) {
  const data = useMemo(() => (events && events.length ? events : buildSampleEvents()), [events]);

  const [tooltip, setTooltip] = useState(null);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  const byDate = useMemo(() => {
    const map = new Map();
    for (const ev of data) {
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date).push(ev);
    }
    return map;
  }, [data]);

  const totalEvents = useMemo(() => data.reduce((sum, e) => sum + (e.count || 1), 0), [data]);

  const handleHover = useCallback((e, day) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const cellRect = e.currentTarget.getBoundingClientRect();
    if (!containerRect) return;

    setTooltip({
      x: cellRect.left - containerRect.left + cellRect.width / 2,
      y: cellRect.top - containerRect.top,
      label: formatDate(day.key),
      items: day.events,
    });
  }, []);

  const handleLeave = useCallback(() => setTooltip(null), []);

  const handleSelect = useCallback((e, day) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip(null);
    setSelected({ key: day.key, count: day.count, events: day.events, originRect: rect });
  }, []);

  return (
    <section className="relative w-full bg-white py-24 px-6 sm:px-10 lg:px-16 text-[#0B1220]">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#0B1220]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#5C6B85]">{subtitle}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold text-[#0B3FBF]">{totalEvents}</div>
            <div className="text-sm text-[#5C6B85]">events in the last year</div>
          </div>
        </div>

        {/* Chart card */}
        <div
          ref={containerRef}
          className="relative overflow-x-auto rounded-2xl border border-[#E4E9F2] bg-[#FBFCFE] p-6 sm:p-8"
        >
          <ContributionGrid
            byDate={byDate}
            onHover={handleHover}
            onLeave={handleLeave}
            onSelect={handleSelect}
          />
          <Legend />
          {tooltip && <EventTooltip {...tooltip} />}
        </div>
      </div>

      {selected && (
        <EventDetailOverlay day={selected} originRect={selected.originRect} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}