import { useState } from "react";
import CornerBrackets from "./CornerBrackets";
import ScanLines from "./ScanLines";
import { formatDate } from "./utils";
import { PANEL_BG, PANEL_BORDER, STATUS_STYLES } from "./constants";


export default function EventCard({
  title,
  date,
  time,
  location,
  description,
  tag,
  status = "upcoming",
  href,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);
  const isInteractive = Boolean(href || onClick);
  const Wrapper = href ? "a" : "div";
  const statusMeta = STATUS_STYLES[status] || STATUS_STYLES.upcoming;

  return (
    <Wrapper
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col gap-5 overflow-hidden rounded-xl p-6 transition-all duration-200 ${
        isInteractive ? "cursor-pointer" : ""
      }`}
      style={{
        backgroundColor: PANEL_BG,
        border: `1px solid ${PANEL_BORDER}`,
        boxShadow: hovered ? "0 0 28px rgba(79,140,255,0.25)" : "none",
        transform: hovered && isInteractive ? "translateY(-2px)" : "none",
      }}
    >
      <CornerBrackets />
      <ScanLines />

      {/* Status + tag row */}
      <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em]">
        <span className="flex items-center gap-1.5" style={{ color: statusMeta.color }}>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: statusMeta.dot,
              boxShadow: status === "live" ? `0 0 6px ${statusMeta.dot}` : "none",
            }}
          />
          {statusMeta.label}
        </span>
        {tag && <span className="text-[#5B7BB8]">{tag}</span>}
      </div>

      {/* Title */}
      <h3 className="relative text-xl font-semibold leading-snug text-white">{title}</h3>

      {/* Description */}
      {description && (
        <p className="relative text-[14px] leading-relaxed text-[#B9C9EA]">{description}</p>
      )}

      {/* Meta footer */}
      <div className="relative mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#2A4FA0]/50 pt-4 font-mono text-[12px] text-[#8FA6D6]">
        {date && <span>{formatDate(date)}</span>}
        {time && <span>{time}</span>}
        {location && <span>{location}</span>}
      </div>
    </Wrapper>
  );
}
