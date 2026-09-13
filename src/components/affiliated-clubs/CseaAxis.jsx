import React from "react";

/**
 * CseaAxis Component
 * Subtle central vertical connecting thread with CSEA label and central node.
 * Connects the 4 affiliated clubs in the editorial grid.
 */
export function CseaAxis({ className = "" }) {
  return (
    <div
      className={`csea-axis hidden lg:flex flex-col items-center absolute top-12 bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Tiny uppercase CSEA brand label */}
      <span className="text-[10px] font-mono font-bold tracking-[0.32em] text-[#0038ff] uppercase mb-3 select-none">
        CSEA
      </span>

      {/* Top vertical guide line */}
      <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-[#0038ff]/20 to-[#0038ff]/35" />

      {/* Subtle Central Node Indicator */}
      <div className="relative my-3 flex items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full bg-[#0038ff] border-2 border-[#FAFAFC] shadow-sm ring-4 ring-[#0038ff]/15" />
      </div>

      {/* Bottom vertical guide line */}
      <div className="w-[1px] flex-1 bg-gradient-to-b from-[#0038ff]/35 via-[#0038ff]/20 to-transparent" />
    </div>
  );
}

export default CseaAxis;
