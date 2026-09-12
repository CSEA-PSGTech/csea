import { useRef, useState, useCallback, useEffect } from "react";
import GlassCanvas from "./GlassCanvas";
import { ArrowDownRight, Compass, Sparkles } from "lucide-react";

/**
 * CseaGlassHero Component
 * The interactive retro-futurist hero stage inspired by HAOQI.DESIGN:
 * - Shared pointer state with velocity damping
 * - Background falling CSEA sticker particles
 * - Real-time FBO glass refraction & chromatic dispersion
 * - Crisp, selectable, high-contrast DOM editorial typography
 */
export function CseaGlassHero() {
  const containerRef = useRef(null);
  const pointerRef = useRef({
    x: 0.5,
    y: 0.5,
    velocity: 0,
    inside: false,
  });

  const prevPointerRef = useRef({ x: 0.5, y: 0.5, time: performance.now() });

  const [telemetry, setTelemetry] = useState({
    fps: 60,
    activeCount: 6,
    poolTotal: 19,
    dispersion: "0.012",
    refractionStrength: "0.045",
  });

  const handleTelemetryUpdate = useCallback((data) => {
    setTelemetry(data);
  }, []);

  // Shared pointer move listener
  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

    if (clientX === undefined || clientY === undefined) return;

    const now = performance.now();
    const dt = Math.max(0.001, (now - prevPointerRef.current.time) / 1000);

    // Normalize coordinates to WebGL UV space:
    // u: 0 (left) to 1 (right)
    // v: 0 (bottom) to 1 (top)
    const u = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1.0 - (clientY - rect.top) / rect.height));

    const dx = u - prevPointerRef.current.x;
    const dy = v - prevPointerRef.current.y;
    const dist = Math.hypot(dx, dy);

    // Instantaneous velocity normalized and clamped
    const instantVelocity = Math.min(2.0, (dist / dt) * 0.08);

    prevPointerRef.current = { x: u, y: v, time: now };

    pointerRef.current = {
      x: u,
      y: v,
      velocity: instantVelocity,
      inside: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = {
      ...pointerRef.current,
      velocity: 0,
      inside: false,
    };
  };

  const scrollToStory = () => {
    const storySection = document.getElementById("story");
    if (storySection) {
      storySection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToEvents = () => {
    const eventsEl = document.getElementById("events");
    if (eventsEl) {
      eventsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      onPointerMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative h-screen w-full overflow-hidden bg-[#FAFAFC] select-none flex flex-col justify-between"
    >
      {/* =====================================================
          LAYER 1 & 2: WEBGL CANVAS (FALLING STICKERS + FBO GLASS)
          ===================================================== */}
      <GlassCanvas
        pointerRef={pointerRef}
        onTelemetryUpdate={handleTelemetryUpdate}
      />

      {/* =====================================================
          LAYER 3: RETRO-FUTURIST GRID & DECORATIVE OVERLAY
          ===================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] grid grid-cols-12 grid-rows-6 opacity-[0.45]"
        aria-hidden="true"
      >
        <div className="col-span-12 border-b border-black/[0.04]" />
        <div className="col-span-12 border-b border-black/[0.04]" />
        <div className="col-span-12 border-b border-black/[0.04]" />
        <div className="col-span-12 border-b border-black/[0.04]" />
        <div className="col-span-12 border-b border-black/[0.04]" />

        {/* Cross markers at key grid intersections */}
        <span className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-black/20 font-bold">
          +
        </span>
        <span className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-black/20 font-bold">
          +
        </span>
        <span className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 font-mono text-[10px] text-black/20 font-bold">
          +
        </span>
        <span className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 font-mono text-[10px] text-black/20 font-bold">
          +
        </span>
      </div>

      {/* =====================================================
          LAYER 4: FOREGROUND CRISP HTML TYPOGRAPHY & UI
          ===================================================== */}
      
      {/* Top Telemetry & Status Bar */}
      <header className="pointer-events-none relative z-10 w-full px-6 pt-6 sm:px-12 sm:pt-8 flex items-center justify-between text-[11px] font-mono tracking-wider text-black/70">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-[#0026FF] animate-pulse" />
          <span className="font-semibold text-black uppercase">
            CSEA // DEPT. OF CSE
          </span>
          <span className="hidden sm:inline text-black/30">|</span>
          <span className="hidden sm:inline text-black/50">
            SYS_STAGE: 00 // RETRO-FUTURIST LAB
          </span>
        </div>

        {/* Technical HUD Telemetry Chips */}
        <div className="hidden md:flex items-center gap-4 text-[10px] text-black/50">
          <div className="rounded border border-black/10 bg-white/70 backdrop-blur-sm px-2.5 py-1">
            FBO REFRACTION: <span className="text-[#0026FF] font-semibold">ACTIVE</span>
          </div>
          <div className="rounded border border-black/10 bg-white/70 backdrop-blur-sm px-2.5 py-1">
            DISPERSION: <span className="text-black font-semibold">Δ{telemetry.dispersion}</span>
          </div>
          <div className="rounded border border-black/10 bg-white/70 backdrop-blur-sm px-2.5 py-1">
            STICKERS: <span className="text-black font-semibold">{telemetry.poolTotal} DYNAMIC</span>
          </div>
        </div>
      </header>

      {/* Main Hero Editorial Typography */}
      <main className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-12 flex flex-col items-center text-center">
        {/* Editorial Sub-badge */}
        <div className="pointer-events-auto mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0026FF] shadow-sm backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-[#0026FF]" />
          <span>Interactive Optical Stage · 2026</span>
        </div>

        {/* Crisp Editorial Title */}
        <h1 className="select-text font-sans tracking-tight text-[#0F172A]">
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.02] tracking-[-0.04em]">
            BEYOND
          </span>
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.02] tracking-[-0.04em] bg-gradient-to-r from-[#0026FF] via-[#5227FF] to-[#8000FF] bg-clip-text text-transparent">
            THE HORIZON.
          </span>
          <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-black/60 tracking-[-0.03em] mt-1 sm:mt-2">
            IMAGINE. BUILD. IMPACT.
          </span>
        </h1>

        {/* Editorial Description */}
        <p className="select-text mt-5 sm:mt-7 max-w-2xl text-sm sm:text-base leading-relaxed text-black/60 font-sans font-normal">
          Where computational curiosity transforms into physical and digital reality.
          Explore our living ecosystem of student researchers, engineers, and creators.
        </p>

        {/* CTA Button Row */}
        <div className="pointer-events-auto mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={scrollToStory}
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#0026FF] px-6 py-3 text-xs sm:text-sm font-medium text-white shadow-lg shadow-[#0026FF]/25 transition-all duration-300 hover:bg-[#001ecc] hover:shadow-[#0026FF]/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore The Journey</span>
            <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </button>

          <button
            onClick={scrollToEvents}
            className="group inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/80 px-6 py-3 text-xs sm:text-sm font-medium text-black/80 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:border-black/30 hover:text-black hover:-translate-y-0.5"
          >
            <Compass className="h-4 w-4 text-[#0026FF]" />
            <span>Upcoming Events</span>
          </button>
        </div>
      </main>

      {/* Bottom Telemetry Footer */}
      <footer className="pointer-events-none relative z-10 w-full px-6 pb-6 sm:px-12 sm:pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono tracking-wider text-black/50">
        <div className="flex items-center gap-2">
          <span>LAT: 12.9716° N</span>
          <span>//</span>
          <span>LON: 79.1589° E</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-black/40">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>OPTICAL LENS: HOVER CURSOR TO REFRACT STICKERS</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-black/70">
            {telemetry.fps} FPS
          </span>
          <span className="text-black/30">|</span>
          <span className="uppercase text-black/60">
            CSEA ARCHIVE © 2026
          </span>
        </div>
      </footer>
    </section>
  );
}

export default CseaGlassHero;
