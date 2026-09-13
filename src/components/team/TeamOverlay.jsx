import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TEAM_MEMBERS } from "./teamData";
import { TeamCard } from "./TeamCard";
import { TeamGrid } from "./TeamGrid";
import "./Team.css";

const PANEL_COUNT = 7;
const PANELS = Array.from({ length: PANEL_COUNT }, (_, i) => i);

export const TeamOverlay = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef(null);
  const panelsRef = useRef([]);
  const surfaceRef = useRef(null);
  const headerRef = useRef(null);
  const backBtnRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const savedScrollYRef = useRef(0);
  const timelineRef = useRef(null);

  // Mount when isOpen becomes true
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }
  }, [isOpen]);

  // Unified GSAP Animation Sequence
  useLayoutEffect(() => {
    if (!mounted || !isOpen) return;

    // 1. Lock background scroll and store position
    savedScrollYRef.current = window.scrollY;
    document.body.style.overflow = "hidden";

    const panels = panelsRef.current.filter(Boolean);
    const cards = cardsContainerRef.current?.querySelectorAll(".csea-team-card") || [];
    const header = headerRef.current;
    const backBtn = backBtnRef.current;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (prefersReducedMotion) {
      gsap.set(panels, { yPercent: 0 });
      gsap.set([header, backBtn, ...cards], {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      });
      return;
    }

    // 2. Set pristine initial positions
    gsap.set(panels, { yPercent: 100, force3D: true });
    gsap.set(header, { opacity: 0, y: 35 });
    gsap.set(backBtn, { opacity: 0, x: -20 });
    gsap.set(cards, { opacity: 0, y: 60, scale: 0.96 });

    // 3. Single unified GSAP entrance timeline
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });
    timelineRef.current = tl;

    // Step A: 7 vertical panels rise from bottom with stepped staircase wave
    tl.to(panels, {
      yPercent: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: "power4.inOut",
    })
    // Step B: Thin minimal header reveals as panels reach top
    .to(
      header,
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out",
      },
      "-=0.25"
    )
    // Step C: Back button slides in
    .to(
      backBtn,
      {
        x: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.5"
    )
    // Step D: The 3 portrait cards stagger into position
    .to(
      cards,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=0.35"
    );

    return () => {
      tl.kill();
    };
  }, [mounted, isOpen]);

  // Handle Close with smooth reverse animation
  const handleClose = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const panels = panelsRef.current.filter(Boolean);
    const cards = cardsContainerRef.current?.querySelectorAll(".csea-team-card") || [];
    const header = headerRef.current;
    const backBtn = backBtnRef.current;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      document.body.style.overflow = "";
      window.scrollTo(0, savedScrollYRef.current);
      setMounted(false);
      onClose?.();
      return;
    }

    const closeTl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        window.scrollTo(0, savedScrollYRef.current);
        setMounted(false);
        onClose?.();
      },
    });
    timelineRef.current = closeTl;

    // Step 1: Content fades & slides away
    closeTl
      .to(
        [...cards, header, backBtn],
        {
          opacity: 0,
          y: 25,
          duration: 0.3,
          stagger: 0.03,
          ease: "power2.in",
        }
      )
      // Step 2: Panels retract back down in reverse order (right-to-left)
      .to(
        panels,
        {
          yPercent: 100,
          duration: 0.65,
          stagger: {
            each: 0.05,
            from: "end",
          },
          ease: "power3.inOut",
        },
        "-=0.1"
      );
  };

  // Keyboard accessibility (Escape key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && mounted) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="csea-team-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="CSEA Meet The Team"
    >
      {/* 1. Seven Vertical White Panels Rising from Bottom */}
      <div className="csea-team-transition" aria-hidden="true">
        {PANELS.map((p, i) => (
          <div
            key={p}
            ref={(el) => (panelsRef.current[i] = el)}
            className="csea-team-transition__panel"
            style={{ width: `${100 / PANEL_COUNT}%` }}
          />
        ))}
      </div>

      {/* 2. Editorial Poster Surface (Transparent, sits over the rising panels) */}
      <div className="csea-team-overlay__surface" ref={surfaceRef}>
        {/* Architectural Background Grid */}
        <TeamGrid />

        {/* Top-Left Back Control */}
        <div className="csea-team-overlay__top-bar">
          <button
            ref={backBtnRef}
            type="button"
            className="csea-team-overlay__back-btn"
            onClick={handleClose}
            aria-label="Back to previous section"
          >
            <svg
              className="csea-team-overlay__back-arrow"
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="17" y1="6" x2="1" y2="6" />
              <polyline points="6 1 1 6 6 11" />
            </svg>
            <span className="csea-team-overlay__back-text">BACK</span>
          </button>
        </div>

        {/* Main Content Area (Compact, non-scrollable) */}
        <div className="csea-team-overlay__container">
          {/* Elegant Thin Minimal Header */}
          <header className="csea-team-overlay__header" ref={headerRef}>
            <h1 className="csea-team-overlay__title">
              MEET THE TEAM
            </h1>
          </header>

          {/* Three Compact Portrait Cards Row */}
          <div className="csea-team-overlay__cards-row" ref={cardsContainerRef}>
            {TEAM_MEMBERS.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
