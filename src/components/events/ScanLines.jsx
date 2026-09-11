
export default function ScanLines({ opacity = "opacity-[0.12]" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${opacity}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, #4F8CFF 0px, transparent 1px, transparent 3px)",
      }}
    />
  );
}
