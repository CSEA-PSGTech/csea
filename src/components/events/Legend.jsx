import { LEVELS } from "./constants";


export default function Legend() {
  return (
    <div className="mt-8 flex items-center justify-end gap-2 pl-10 font-mono text-[11px] uppercase tracking-wider text-[#3E5788]">
      <span>Idle</span>
      {LEVELS.map((color, i) => (
        <span key={i} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: color }} />
      ))}
      <span>Active</span>
    </div>
  );
}
