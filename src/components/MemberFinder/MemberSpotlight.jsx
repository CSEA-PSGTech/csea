import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TEAM_META } from "./MobileMemberFinder";
import { ZoomThumb, MemberCardModal } from "./PortraitZoom";

const pad = (n) => String(n).padStart(2, "0");

// Look up a vertical's description, forgiving case / spacing / plural differences
// between the sheet ("OFFICE BEARERS", "E Cell") and TEAM_META keys.
const normalise = (str = "") => str.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/s$/, "");
const DESCRIPTIONS = Object.fromEntries(
  Object.entries(TEAM_META).map(([name, meta]) => [
    normalise(name),
    { desktop: meta.description, mobile: meta.mobileDescription || meta.description },
  ])
);
const FALLBACK_DESCRIPTION = {
  desktop: "The members and contributors who make this team tick.",
  mobile: "The people who make this team tick.",
};

// Returns { desktop, mobile } — the longer line on md+ screens, the short one on phones.
function describeVertical(name) {
  return DESCRIPTIONS[normalise(name)] || FALLBACK_DESCRIPTION;
}

/* ------------------------------------------------------------------ */
/*  One member — round portrait + caption. Click zooms the photo.      */
/* ------------------------------------------------------------------ */
function MemberPortrait({ member, onSelect }) {
  const subtitle = member.yearAndClass || member.year || member.batch || "";

  return (
    <li className="flex w-[8rem] sm:w-36 md:w-44 flex-col items-center text-center">
      <ZoomThumb
        person={member}
        onSelect={onSelect}
        initialsClassName="text-3xl md:text-4xl"
      />

      <div className="mt-5 w-full px-1">
        <h4 className="text-sm md:text-base font-medium leading-tight tracking-[-0.02em] text-neutral-900">
          {member.name}
        </h4>
        {member.position && (
          <p className="mt-1.5 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5258FF]">
            {member.position}
          </p>
        )}
        {subtitle && (
          <p className="mt-1 text-[11px] md:text-xs leading-snug text-black/50">{subtitle}</p>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Edge arrow — pinned to the far left / right of the screen          */
/* ------------------------------------------------------------------ */
function EdgeArrow({ side, onClick, label }) {
  const Icon = side === "left" ? ArrowLeft : ArrowRight;
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-20 flex items-start md:items-center
        ${side === "left" ? "left-1.5 sm:left-4 md:left-6" : "right-1.5 sm:right-4 md:right-6"}`}
    >
      {/* sticky keeps the arrow on screen while scrolling a tall team on phones */}
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="pointer-events-auto group sticky top-[45vh] md:static flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14
          items-center justify-center rounded-full border border-black/10 bg-white/90 text-neutral-800 backdrop-blur
          shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)] transition
          hover:bg-[#002FE6] hover:text-white hover:border-[#002FE6]
          focus:outline-none focus-visible:ring-4 focus-visible:ring-black/20"
      >
        <Icon
          className={`h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 ${
            side === "left" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
          }`}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Spotlight — one vertical at a time, arrows move to the next one    */
/* ------------------------------------------------------------------ */
export function MemberSpotlight({ verticals = [], index = 0, onIndexChange, onLayoutChange }) {
  const [direction, setDirection] = useState(1);
  const [selectedKey, setSelectedKey] = useState(null);
  const chipsRef = useRef(null);

  const count = verticals.length;
  const current = verticals[index] || verticals[0];
  const prevVertical = count > 1 ? verticals[(index - 1 + count) % count] : null;
  const nextVertical = count > 1 ? verticals[(index + 1) % count] : null;

  const goTo = (target, dir) => {
    if (!count) return;
    const wrapped = (target + count) % count;
    if (wrapped === index) return;
    setDirection(dir ?? (wrapped > index ? 1 : -1));
    setSelectedKey(null);
    onIndexChange?.(wrapped);
  };
  const closeZoom = useCallback(() => setSelectedKey(null), []);
  const goNext = () => goTo(index + 1, 1);
  const goPrev = () => goTo(index - 1, -1);

  // Keep the active chip centred in its scroll strip (without touching page scroll).
  useEffect(() => {
    const strip = chipsRef.current;
    const chip = strip?.querySelector(`[data-chip="${index}"]`);
    if (!strip || !chip) return;
    strip.scrollTo({
      left: chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [index]);

  if (!current) return null;

  const description = describeVertical(current.name);
  const memberKey = (m) => String(m.id || m.name);
  const selectedMember = current.members.find((m) => memberKey(m) === selectedKey) || null;

  const onKeyDown = (e) => {
    if (selectedMember) return; // card is open — don't switch teams behind it
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  return (
    <div className="w-full" onKeyDown={onKeyDown}>
      {/* ---- Vertical header ---- */}
      <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-5 md:pb-7">
        <div className="min-w-0">
          <p className="font-mono text-[11px] md:text-xs tracking-[0.25em] text-black/40">
            <span className="text-[#5258FF]">{pad(index + 1)}</span> / {pad(count)}
            <span className="ml-3 hidden sm:inline">
              · {current.members.length} {current.members.length === 1 ? "member" : "members"}
            </span>
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="mt-2 text-3xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-[-0.045em] text-[#002FE6]">
                {current.name}
              </h3>
              {description && (
                <p className="mt-2 md:mt-3 text-xs sm:text-base text-black/55 max-w-xl">
                  <span className="hidden md:inline">{description.desktop}</span>
                  <span className="md:hidden">{description.mobile}</span>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {nextVertical && (
          <p className="hidden md:block shrink-0 text-[11px] uppercase tracking-[0.2em] text-black/40">
            Up next · <span className="text-[#002FE6]">{nextVertical.name}</span>
          </p>
        )}
      </div>

      {/* ---- Vertical chips (jump straight to any team) ---- */}
      {count > 1 && (
        <div
          ref={chipsRef}
          className="relative -mx-4 mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]"
        >
          <span className="w-4 shrink-0" aria-hidden />
          {verticals.map((v, i) => (
            <button
              key={v.name}
              type="button"
              data-chip={i}
              onClick={() => goTo(i)}
              aria-current={i === index ? "true" : undefined}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] md:text-xs font-medium transition
                ${
                  i === index
                    ? "border-[#002FE6] bg-[#002FE6] text-white shadow-[0_8px_20px_-10px_rgba(0,47,230,0.7)]"
                    : "border-black/10 bg-white text-neutral-600 hover:border-[#002FE6] hover:text-[#002FE6]"
                }`}
            >
              {v.name}
            </button>
          ))}
          <span className="w-4 shrink-0" aria-hidden />
        </div>
      )}

      {/*
        ---- Members, with arrows at the screen edges ----
        This strip is stretched to the full viewport width (escaping the
        section's side padding) so the arrows can sit at the far left/right.
      */}
      <div className="relative ml-[calc(50%-50vw)] w-screen">
        {prevVertical && (
          <EdgeArrow side="left" onClick={goPrev} label={`Previous: ${prevVertical.name}`} />
        )}
        {nextVertical && (
          <EdgeArrow side="right" onClick={goNext} label={`Next: ${nextVertical.name}`} />
        )}

        <div className="overflow-hidden px-12 sm:px-20 md:px-[10%]">
          <AnimatePresence
            mode="wait"
            custom={direction}
            initial={false}
            onExitComplete={onLayoutChange}
          >
            <motion.ul
              key={current.name}
              custom={direction}
              variants={{
                enter: (dir) => ({ opacity: 0, x: dir * 70 }),
                center: { opacity: 1, x: 0 },
                exit: (dir) => ({ opacity: 0, x: dir * -70 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={onLayoutChange}
              className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-8 md:gap-y-12 pt-10 md:pt-12 pb-8"
            >
              {current.members.map((member) => {
                const key = memberKey(member);
                return (
                  <MemberPortrait
                    key={key}
                    member={member}
                    onSelect={() => setSelectedKey(key)}
                  />
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>

      {/* Member card (same as the Directory's) */}
      {selectedMember && <MemberCardModal person={selectedMember} onClose={closeZoom} />}
    </div>
  );
}

export default MemberSpotlight;