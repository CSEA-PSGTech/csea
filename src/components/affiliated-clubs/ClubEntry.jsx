import React from "react";

/**
 * ClubEntry Component
 * Editorial information block for each affiliated club.
 * Minimalist design: large blue number, horizontal divider, name, subtitle, description, and Explore link.
 */
export function ClubEntry({ club }) {
  if (!club) return null;

  return (
    <div className="club-entry group relative flex flex-col items-start select-none transition-all duration-300">
      {/* Number & Title Row */}
      <div className="flex items-baseline gap-3 sm:gap-6">
        <span className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0026ff] tracking-tight leading-none shrink-0 transition-transform duration-300 group-hover:scale-105">
          {club.index}
        </span>
        <div className="flex flex-col">
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-950 transition-transform duration-200 group-hover:translate-x-1.5">
            {club.name}
          </h3>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mt-0.5 sm:mt-1">
            {club.subtitle}
          </span>
        </div>
      </div>

      {/* Thin Horizontal Divider */}
      <div className="mt-2.5 sm:mt-3.5 h-[1px] w-full max-w-[260px] sm:max-w-[320px] bg-[#0026ff]/25 transition-all duration-300 group-hover:bg-[#0026ff]/60 group-hover:max-w-[360px]" />

      {/* Description */}
      <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-[15px] text-neutral-600 font-normal leading-relaxed w-full max-w-[300px] sm:max-w-[360px]">
        {club.description}
      </p>

      {/* Working Explore Link */}
      <a
        href={club.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#0026ff] hover:text-[#001bb3] transition-all group/link mt-3 sm:mt-4 py-1 focus:outline-none focus:ring-2 focus:ring-[#0026ff]/40 rounded-sm"
        aria-label={`Explore ${club.name} - ${club.subtitle}`}
      >
        <span>{club.linkText || "EXPLORE"}</span>
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </div>
  );
}

export default ClubEntry;
