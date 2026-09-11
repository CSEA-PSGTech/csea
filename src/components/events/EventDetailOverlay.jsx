import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import EventCard from "./EventCard";
import { formatDate } from "./utils";


export default function EventDetailOverlay({ day, originRect, onClose }) {
  const wrapperRef = useRef(null);
  const [phase, setPhase] = useState("enter"); 

  
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el || !originRect) return;

    const finalRect = el.getBoundingClientRect();
    const scaleX = originRect.width / finalRect.width;
    const scaleY = originRect.height / finalRect.height;
    const originCenterX = originRect.left + originRect.width / 2;
    const originCenterY = originRect.top + originRect.height / 2;
    const finalCenterX = finalRect.left + finalRect.width / 2;
    const finalCenterY = finalRect.top + finalRect.height / 2;
    const dx = originCenterX - finalCenterX;
    const dy = originCenterY - finalCenterY;

    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    el.style.opacity = "0.4";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition =
          "transform 320ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease";
        el.style.transform = "translate(0, 0) scale(1, 1)";
        el.style.opacity = "1";
        setPhase("settled");
      });
    });
  }, [originRect]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    const el = wrapperRef.current;
    if (el) {
      el.style.transition = "transform 180ms ease, opacity 180ms ease";
      el.style.transform = "translate(0, 0) scale(0.92, 0.92)";
      el.style.opacity = "0";
    }
    setPhase("exit");
    setTimeout(onClose, 170);
  }

  if (!day) return null;

  const overlay = (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto p-6"
      style={{
        backgroundColor: "rgba(6,11,24,0.55)",
        backdropFilter: "blur(3px)",
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 200ms ease",
      }}
      onClick={handleClose}
    >
      <div
        ref={wrapperRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-md flex-col gap-4"
        style={{ transformOrigin: "center" }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute -top-10 right-0 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#2A4FA0]/50 bg-[#0E2A6E] font-mono text-[#8FA6D6] transition-colors hover:border-[#4F8CFF] hover:text-white"
        >
          ×
        </button>

        {/* Date header */}
        <div className="px-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white">
          {formatDate(day.key)}
          <span className="ml-2 text-[#8FA6D6]">
            · {day.count} event{day.count > 1 ? "s" : ""} logged
          </span>
        </div>

        {/* One real EventCard per event on this day */}
        {day.events.map((ev, i) => (
          <EventCard key={i} {...ev} />
        ))}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}