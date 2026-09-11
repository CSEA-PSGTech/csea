import { useMemo, useCallback } from "react";
import { LEVELS } from "./constants";
import { DAY_MS, WEEKDAY_LABELS, toKey, startOfWeek } from "./utils";


const CELL = 16;
const GAP = 4;


export default function ContributionGrid({ byDate, onHover, onLeave, onSelect }) {
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
            label: firstOfMonthDay.date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
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
    <div className="min-w-[900px] font-mono">
      <div className="relative mb-3 h-5 pl-10">
        {monthMarkers.map((m) => (
          <span
            key={`${m.label}-${m.weekIndex}`}
            className="absolute text-[12px] tracking-wider text-[#5B7BB8]"
            style={{ left: `${m.weekIndex * step}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex" style={{ gap: GAP }}>
        <div className="mr-2 flex flex-col" style={{ gap: GAP }}>
          {WEEKDAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-end pr-1 text-[11px] tracking-wide text-[#3E5788]"
              style={{ height: CELL, width: 32 }}
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
                  className={`rounded-[3px] transition-all duration-150 ${
                    day.future ? "opacity-0" : ""
                  } ${
                    day.count
                      ? "cursor-pointer hover:scale-[1.3] hover:shadow-[0_0_10px_rgba(159,196,255,0.9)]"
                      : "cursor-default"
                  }`}
                  style={{ height: CELL, width: CELL, backgroundColor: LEVELS[level] }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
