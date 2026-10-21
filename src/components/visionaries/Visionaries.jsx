import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ZoomThumb, MemberCardModal } from "../MemberFinder/PortraitZoom";

// Use the same base URL MemberFinder uses for /api/members.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// ---- Display order ----
// Matched against the "Position" column, ignoring case, spaces and hyphens
// ("Co - Patron" -> "copatron"). Anyone unmatched keeps sheet order, after these.
const ROLE_ORDER = [
  (p) => p.startsWith("chiefpatron"), // Managing Trustee
  (p) => p === "patron", // Principal
  (p) => p.startsWith("copatron"), // HoD, CSE
  (p) => p.startsWith("facultyadv"), // Faculty Advisor
  (p) => p.startsWith("cofacultyadv"), // Co-Faculty Advisor
  (p) => p.includes("secretary"), // Secretary, CSEA
];

function roleRank(member) {
  const p = (member.position || "").toLowerCase().replace(/[\s-]+/g, "");
  const idx = ROLE_ORDER.findIndex((matches) => matches(p));
  return idx === -1 ? ROLE_ORDER.length : idx;
}

function VisionaryCard({ member, onSelect }) {
  // "Year and class" column holds the designation for heads
  // (e.g. "Managing Trustee, PSG & Sons' Charities").
  const designation = member.yearAndClass;

  return (
    <li className="flex flex-1 min-w-[9.5rem] max-w-[14rem] snap-center flex-col items-center text-center">
      <ZoomThumb
        person={member}
        onSelect={onSelect}
        initialsClassName="text-4xl md:text-5xl"
      />

      <div className="mt-6 w-full px-1">
        <h3 className="text-base md:text-lg font-medium leading-tight tracking-[-0.02em] text-neutral-900">
          {member.name}
        </h3>
        {member.position && (
          <p className="mt-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5258FF]">
            {member.position}
          </p>
        )}
        {designation && (
          <p className="mt-1.5 text-xs md:text-sm leading-snug text-black/55">{designation}</p>
        )}
      </div>
    </li>
  );
}

export default function Visionaries() {
  const [heads, setHeads] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [selectedKey, setSelectedKey] = useState(null);
  const closeZoom = useCallback(() => setSelectedKey(null), []);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/members/head`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setHeads(data.members || []);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load visionaries:", err);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Stable sort: Chief Patron → Patron → Co-Patron → Faculty Advisor → Co-Faculty Advisor → Secretary.
  const ordered = useMemo(
    () =>
      heads
        .map((m, i) => ({ m, i }))
        .sort((a, b) => roleRank(a.m) - roleRank(b.m) || a.i - b.i)
        .map(({ m }) => m),
    [heads]
  );

  const selectedHead = ordered.find((m) => String(m.id || m.name) === selectedKey) || null;

  // Section height changes once data arrives — let ScrollSmoother/ScrollTrigger re-measure.
  useEffect(() => {
    if (status === "loading") return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [status, heads.length]);

  if (status === "error" || (status === "ready" && heads.length === 0)) return null;

  return (
    <section
      id="visionaries"
      className="relative w-full pt-8 sm:pt-20 pb-6 sm:pb-16 px-4 sm:px-8 md:px-[10%] flex flex-col justify-center overflow-hidden bg-transparent"
    >
      {/* Section Header — matches the Members header */}
      <div className="relative z-10 w-full mb-2 sm:mb-6">
        <div className="w-full max-w-[420px] lg:max-w-[520px]">
          <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
            04 / Visionaries
          </p>
          <h2 className="mt-2 sm:mt-4 text-2xl sm:text-5xl font-medium leading-[1.08] sm:leading-[0.95] tracking-[-0.03em] sm:tracking-[-0.055em] lg:text-6xl text-neutral-900">
            The Visionaries Behind CSEA
          </h2>
          <p className="mt-2 sm:mt-6 text-xs sm:text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl">
            The leadership that laid our foundation and continues to guide our vision — from our
            Managing Trustee and Principal to the Head of CSE, our Faculty Advisors and Secretary.
          </p>
        </div>
      </div>

      {/* One row of portraits — scrolls sideways on small screens */}
      <ul
        className="relative z-10 flex w-full snap-x snap-mandatory items-start justify-start lg:justify-center
          gap-6 md:gap-8 overflow-x-auto px-4 pt-12 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {status === "loading"
          ? Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="flex flex-1 min-w-[9.5rem] max-w-[14rem] flex-col items-center gap-4"
              >
                <span className="w-full aspect-square animate-pulse rounded-full bg-black/5" />
                <span className="h-4 w-3/4 animate-pulse rounded bg-black/5" />
                <span className="h-3 w-1/2 animate-pulse rounded bg-black/5" />
              </li>
            ))
          : ordered.map((member) => {
              const key = String(member.id || member.name);
              return (
                <VisionaryCard
                  key={key}
                  member={member}
                  onSelect={() => setSelectedKey(key)}
                />
              );
            })}
      </ul>

      {/* Member card (same as the Directory's) */}
      {selectedHead && <MemberCardModal person={selectedHead} onClose={closeZoom} />}
    </section>
  );
}