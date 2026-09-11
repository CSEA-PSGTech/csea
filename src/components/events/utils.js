
export const DAY_MS = 24 * 60 * 60 * 1000;
export const WEEKDAY_LABELS = ["", "MON", "", "WED", "", "FRI", ""];

export function toKey(d) {
  return d.toISOString().slice(0, 10);
}

export function startOfWeek(d) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function computeLongestStreak(byDate) {
  const keys = [...byDate.keys()].sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  for (const key of keys) {
    const d = new Date(key);
    if (prev && (d - prev) / DAY_MS === 1) current += 1;
    else current = 1;
    longest = Math.max(longest, current);
    prev = d;
  }
  return longest;
}

// Sample data so components render meaningfully with no props.
export function buildSampleEvents() {
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
