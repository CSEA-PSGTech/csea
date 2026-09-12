/**
 * Continuous Electric Blue SVG Path
 * Weaves through all 5 stories as one single continuous visual thread.
 * Clean, majestic, open curvature matching the editorial design reference.
 */
export function StoryPath({ pathRef }) {
  // Fluid, open, continuous ribbon spline connecting all 5 story states
  const pathData = `
    M 1060 -50
    C 880 100, 840 240, 980 360
    C 1120 480, 1080 600, 880 680
    C 680 760, 420 680, 240 780
    C 120 850, 200 950, 420 940
    C 720 920, 940 700, 1160 520
    C 1340 360, 1480 480, 1380 680
    C 1280 860, 1040 880, 820 800
    C 600 720, 540 540, 720 420
    C 920 300, 1180 440, 1280 640
    C 1380 820, 1180 940, 920 920
    C 660 900, 480 780, 620 660
    C 780 540, 1120 680, 1340 780
    C 1480 840, 1560 870, 1680 900
  `;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="w-full h-full"
      >
        {/* Faint ambient guide path showing the full ribbon trajectory */}
        <path
          d={pathData}
          stroke="#2547FF"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.06"
        />

        {/* Real-time active drawing path scrubbed directly by GSAP */}
        <path
          ref={pathRef}
          d={pathData}
          stroke="#2547FF"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="will-change-[stroke-dashoffset]"
        />
      </svg>
    </div>
  );
}

export default StoryPath;
