
export default function EventTooltip({ x, y, label, items }) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-md border border-[#2F5FD6]/40 bg-[#0B1430] px-4 py-3 text-left font-mono shadow-[0_0_24px_rgba(47,95,214,0.3)]"
      style={{ left: x, top: y, minWidth: "190px" }}
    >
      <div className="text-[11px] uppercase tracking-wider text-[#4F8CFF]">{label}</div>
      <ul className="mt-1.5 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-[13px] leading-snug text-[#DCE6FF]">
            {item.title}
          </li>
        ))}
      </ul>
      <div
        className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[#2F5FD6]/40 bg-[#0B1430]"
        aria-hidden
      />
    </div>
  );
}
