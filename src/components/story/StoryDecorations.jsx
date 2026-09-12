/**
 * Editorial Grid, subtle plus-markers, auras, and decorative linework
 * Matches visual references for the 5 storytelling states.
 */

export function EditorialGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 3 Major Vertical Guide Lines */}
      <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
        <div className="border-r border-black/[0.05] h-full" />
        <div className="border-r border-black/[0.05] h-full" />
        <div className="h-full" />
      </div>

      {/* Horizontal Guide Lines */}
      <div className="absolute inset-0 grid grid-rows-3 pointer-events-none">
        <div className="border-b border-black/[0.05] w-full" />
        <div className="border-b border-black/[0.05] w-full" />
        <div className="w-full" />
      </div>

      {/* Grid Intersection Cross Markers (+) */}
      <span className="absolute left-[33.333%] top-[33.333%] -translate-x-1/2 -translate-y-1/2 text-neutral-300/80 text-xs font-light select-none">
        +
      </span>
      <span className="absolute left-[66.666%] top-[33.333%] -translate-x-1/2 -translate-y-1/2 text-neutral-300/80 text-xs font-light select-none">
        +
      </span>
      <span className="absolute left-[33.333%] top-[66.666%] -translate-x-1/2 -translate-y-1/2 text-neutral-300/80 text-xs font-light select-none">
        +
      </span>
      <span className="absolute left-[66.666%] top-[66.666%] -translate-x-1/2 -translate-y-1/2 text-neutral-300/80 text-xs font-light select-none">
        +
      </span>
    </div>
  );
}

/**
 * 4x4 matrix of subtle pluses in negative space
 */
export function PlusGridMatrix({ className = "" }) {
  return (
    <div
      className={`grid grid-cols-5 gap-3 sm:gap-4 pointer-events-none select-none text-neutral-300 text-[10px] font-mono leading-none ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i}>+</span>
      ))}
    </div>
  );
}

/**
 * Generative wireframe mesh wave for Story 04 (Culture)
 */
export function WireframeWave({ className = "" }) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      className={`pointer-events-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 0 160 C 80 120, 140 180, 220 130 C 300 80, 340 120, 400 90"
        stroke="#2547FF"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M 0 170 C 75 130, 145 190, 225 140 C 305 90, 345 130, 400 100"
        stroke="#2547FF"
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d="M 0 180 C 70 140, 150 200, 230 150 C 310 100, 350 140, 400 110"
        stroke="#2547FF"
        strokeWidth="0.8"
        opacity="0.18"
      />
      <path
        d="M 0 190 C 65 150, 155 210, 235 160 C 315 110, 355 150, 400 120"
        stroke="#2547FF"
        strokeWidth="0.6"
        opacity="0.12"
      />
    </svg>
  );
}

/**
 * Wireframe geometric globe for Story 05 (Impact)
 */
export function WireframeGlobe({ className = "" }) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      className={`pointer-events-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      <circle cx="150" cy="150" r="140" stroke="#2547FF" strokeWidth="0.8" opacity="0.2" />
      <ellipse cx="150" cy="150" rx="140" ry="60" stroke="#2547FF" strokeWidth="0.8" opacity="0.25" />
      <ellipse cx="150" cy="150" rx="140" ry="110" stroke="#2547FF" strokeWidth="0.8" opacity="0.25" />
      <ellipse cx="150" cy="150" rx="60" ry="140" stroke="#2547FF" strokeWidth="0.8" opacity="0.25" />
      <ellipse cx="150" cy="150" rx="110" ry="140" stroke="#2547FF" strokeWidth="0.8" opacity="0.25" />
      <line x1="10" y1="150" x2="290" y2="150" stroke="#2547FF" strokeWidth="0.8" opacity="0.2" />
      <line x1="150" y1="10" x2="150" y2="290" stroke="#2547FF" strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

/**
 * 4-Point Sparkle Star
 */
export function SparkleStar({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#2547FF"
      className={`w-5 h-5 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

/**
 * Radial Blue Aura Glow
 */
export function BlueAura({ position = "bottom-left", text = "" }) {
  const isBottomLeft = position === "bottom-left";

  return (
    <div
      className={`absolute z-0 pointer-events-none select-none flex items-center justify-center ${
        isBottomLeft
          ? "-bottom-16 -left-16 w-80 h-80 sm:w-96 sm:h-96"
          : "-bottom-20 -right-20 w-96 h-96 sm:w-[460px] sm:h-[460px]"
      }`}
      aria-hidden="true"
    >
      {/* High-performance radial gradient glow with zero filter blur overhead */}
      <div
        className="w-full h-full rounded-full"
        style={{
          background: isBottomLeft
            ? "radial-gradient(circle, rgba(37,71,255,0.22) 0%, rgba(37,71,255,0.06) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(37,71,255,0.26) 0%, rgba(37,71,255,0.08) 45%, transparent 70%)",
        }}
      />

      {/* Embedded circular metadata label */}
      {text && (
        <div
          className={`absolute text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase font-semibold text-[#2547FF] max-w-[130px] leading-tight text-center ${
            isBottomLeft ? "bottom-24 left-24" : "bottom-28 right-28"
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
