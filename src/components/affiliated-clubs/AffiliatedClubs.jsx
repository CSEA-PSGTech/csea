import React from "react";
import { AFFILIATED_CLUBS } from "./affiliatedClubsData";
import { ClubEntry } from "./ClubEntry";
import { CseaAxis } from "./CseaAxis";

/**
 * AffiliatedClubs Component
 * Static, clean editorial display of CSEA Affiliated Clubs:
 * 01 GHCC, 02 THE EYE, 03 DT.
 * No scroll pinning, no scroll animations - instant 100% crisp visibility.
 */
export function AffiliatedClubs() {
  return (
    <section
      id="affiliated-clubs"
      className="relative w-full py-14 sm:py-24 lg:py-36 px-4 sm:px-[10%] lg:px-[12%] bg-[#FAFAFC] text-neutral-900 border-t border-black/5"
    >
      {/* Subtle Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="absolute left-[16%] top-0 bottom-0 w-[1px] bg-black/[0.03]" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/[0.03]" />
        <div className="absolute right-[16%] top-0 bottom-0 w-[1px] bg-black/[0.03]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col">
        {/* Section Header */}
        <div className="w-full max-w-2xl mb-10 sm:mb-16 lg:mb-20">
          <p className="text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em] text-[#0026ff]">
            AFFILIATED CLUBS
          </p>
          <h2 className="mt-2 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.03em] text-neutral-950 leading-[1.1]">
            Affiliated Clubs
          </h2>
          <p className="mt-2.5 text-xs sm:text-base md:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl">
            Communities, ideas, and opportunities beyond the classroom.
          </p>
        </div>

        {/* Two-Column Editorial Layout with Central CSEA Axis */}
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 lg:gap-24 items-start">
          {/* Central Vertical Connecting Thread */}
          <CseaAxis />

          {AFFILIATED_CLUBS.map((club, idx) => (
            <div
              key={club.id}
              className={`flex flex-col ${
                idx % 2 === 0 ? "lg:pr-8" : "lg:pl-8"
              }`}
            >
              <ClubEntry
                club={{
                  ...club,
                  index: String(idx + 1).padStart(2, "0"),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AffiliatedClubs;
