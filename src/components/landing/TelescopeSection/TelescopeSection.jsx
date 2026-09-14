import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import BackgroundGrid from "../../background/BackgroundGrid";
import { preloadImages } from "./utils";
import GlassCanvas from "../GlassHero/GlassCanvas";
import {
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpLeft,
  HandDrawnUnderline,
} from "./AnnotationArrows";
import "./TelescopeSection.css";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function TelescopeSection() {
  const sectionRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pointerRef = useRef({
    x: 0.5,
    y: 0.5,
    velocity: 0,
    inside: false,
  });
  const prevPointerRef = useRef({ x: 0.5, y: 0.5, time: performance.now() });

  const handlePointerMove = (e) => {
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

    if (clientX === undefined || clientY === undefined) return;

    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;

    const now = performance.now();
    const dt = Math.max(0.001, (now - prevPointerRef.current.time) / 1000);

    const u = Math.max(0, Math.min(1, clientX / width));
    const v = Math.max(0, Math.min(1, 1.0 - clientY / height));
    const dist = Math.hypot(u - prevPointerRef.current.x, v - prevPointerRef.current.y);
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const frontImages = section.querySelectorAll(
        ".section__media__front"
      );

      const smallImages = section.querySelectorAll(
        ".section__images .photo-card"
      );

      gsap.set(smallImages, {
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        force3D: true,
      });

      const easeFunc = gsap.parseEase("power1.inOut");
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: isMobile ? "+=800" : "+=2000",
          scrub: true,
          pin: true,
          pinSpacing: true,
          pinType: "transform",
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const easedProgress = easeFunc(timeline.progress());
          section.style.setProperty("--progress", easedProgress);
        },
      });

      timeline.to(smallImages, {
        z: isMobile ? "50vh" : "100vh",
        duration: 1,
        ease: "power1.inOut",
        stagger: {
          amount: 0.2,
          from: "center",
        },
      });

      if (typeof window !== "undefined" && window.innerWidth > 768 && frontImages.length > 0) {
        timeline.to(
          frontImages,
          {
            scale: 1,
            duration: 1,
            ease: "power1.inOut",
            delay: 0.1,
          },
          0.6
        );
      }
    }, section);

    // Refresh ScrollTrigger calculations
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="section"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <BackgroundGrid />
      {isDesktop && <GlassCanvas pointerRef={pointerRef} />}

      {/* Top-Left Institutional & Brand Logos */}
      <div className="absolute top-4 left-4 sm:top-7 sm:left-9 z-30 select-none pointer-events-auto flex items-center gap-2 sm:gap-5">
        <a href="/" aria-label="CSEA Home" className="block focus:outline-none focus:ring-2 focus:ring-[#0026ff]/30 rounded-lg">
          <img
            src="/logos/csea.png"
            alt="CSEA Logo"
            className="h-8 sm:h-12 md:h-14 w-auto object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
            draggable={false}
          />
        </a>

        {/* Subtle Vertical Divider */}
        <div className="h-6 sm:h-9 w-[1px] bg-black/10" aria-hidden="true" />

        <div className="flex items-center gap-1.5 sm:gap-4">
          <img
            src="/logos/psg.png"
            alt="PSG College of Technology"
            className="h-7 sm:h-11 md:h-13 w-auto object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
            draggable={false}
          />
          <img
            src="/logos/hundred.png"
            alt="PSG 100 Years"
            className="h-7 sm:h-11 md:h-13 w-auto object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
            draggable={false}
          />
        </div>
      </div>

      {/* Hero text placed in dead center */}
      <h1>
        <span className="left">we are</span>
        <span className="right">CSEA ; )</span>
      </h1>

      {/* Central logo and college text positioned below center */}
      <div className="center-identity">
        <div className="center-graphic">
          <img
            src="/csea_stickers/atom_orbit.png"
            className="graphic-orbit"
            alt=""
            aria-hidden="true"
          />
          <img
            src="/csea_stickers/csea_cube.png"
            className="graphic-cube"
            alt="CSEA Cube"
          />
          <img
            src="/csea_stickers/spark_diamond.png"
            className="graphic-spark spark-left"
            alt=""
            aria-hidden="true"
          />
          <img
            src="/csea_stickers/spark_diamond.png"
            className="graphic-spark spark-right"
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className="center-identity__text">
          <p className="association-name">
            COMPUTER SCIENCE AND ENGINEERING ASSOCIATION
          </p>
          <p className="college-name">PSG COLLEGE OF TECHNOLOGY</p>
          <div className="accent-bar" aria-hidden="true" />
        </div>
      </div>

      {/* Center scaling media (Desktop only) */}
      <div className="section__media hidden md:block">
        <div className="section__media__back">
          <img src="/images/telescope/image-front.webp" alt="CSEA" />
        </div>

      
      </div>

      {/* Floating Parallax Editorial Photo Cards with Hand-Drawn Annotations */}
      <div className="section__images">
        {/* Left Side */}
        <div className="photo-card photo-card-1">
          <div className="photo-card__frame">
            <img src="/landing_page/image (2).webp" alt="CSEA Workshop" />
          </div>
          <div className="photo-annotation annotation-card-1">
            <span className="annotation-text">
              LEARN<br />SHARE<br />GROW
            </span>
            <ArrowDownRight className="arrow-card-1" width={36} height={26} />
          </div>
        </div>

        <div className="photo-card photo-card-2">
          <div className="photo-card__frame">
            <img src="/landing_page/image (3).webp" alt="CSEA Event" />
          </div>
          <div className="photo-annotation annotation-card-2">
            <span className="annotation-text">
              BUILD<br />TOGETHER
            </span>
            <ArrowDownLeft className="arrow-card-2" width={34} height={24} />
          </div>
        </div>

        <div className="photo-card photo-card-3">
          <div className="photo-card__frame">
            <img src="/landing_page/image (4).webp" alt="CSEA Activity" />
          </div>
        </div>

        <div className="photo-card photo-card-4">
          <div className="photo-card__frame">
            <img src="/landing_page/image (5).webp" alt="CSEA Team" />
          </div>
          <div className="photo-annotation annotation-card-4">
            <span className="annotation-text">
              SAME<br />STUDENTS<br />DIFFERENT<br />POSSIBILITIES
            </span>
          </div>
        </div>

        <div className="photo-card photo-card-5">
          <div className="photo-card__frame">
            <img src="/landing_page/image (6).webp" alt="CSEA Innovation" />
          </div>
          <div className="photo-annotation annotation-card-5">
            <span className="annotation-text">
              IDEAS<br />PEOPLE<br />OPPORTUNITIES
            </span>
            <ArrowUpRight className="arrow-card-5" width={36} height={26} />
          </div>
        </div>

        {/* Right Side */}
        <div className="photo-card photo-card-6">
          <div className="photo-card__frame">
            <img
              src="/landing_page/image (7).webp"
              alt="CSEA Lab"
            />
          </div>
          <div className="photo-annotation annotation-card-6">
            <span className="annotation-text">
              CODE<br />COLLABORATE<br />CREATE
            </span>
            <ArrowDownRight className="arrow-card-6" width={34} height={24} />
          </div>
        </div>

        <div className="photo-card photo-card-7">
          <div className="photo-card__frame">
            <img src="/landing_page/image (8).webp" alt="CSEA Presentation" />
          </div>
          <div className="photo-annotation annotation-card-7">
            <span className="annotation-text">
              STUDENT<br />LED<br />IMPACT
            </span>
            <ArrowDownLeft className="arrow-card-7" width={34} height={24} />
          </div>
        </div>

        <div className="photo-card photo-card-8">
          <div className="photo-card__frame">
            <img
              src="/landing_page/image (9).webp"
              alt="CSEA Community"
            />
          </div>
          <div className="photo-annotation annotation-card-8">
            <span className="annotation-text">
              COMMUNITY<br />BEYOND<br />CLASSROOMS
            </span>
            <ArrowDownRight className="arrow-card-8" width={34} height={24} />
          </div>
        </div>

        <div className="photo-card photo-card-9">
          <div className="photo-card__frame">
            <img src="/landing_page/image (10).webp" alt="CSEA Session" />
          </div>
        </div>

        <div className="photo-card photo-card-10">
          <div className="photo-card__frame">
            <img
              src="/landing_page/image (11).webp"
              alt="CSEA Gathering"
            />
          </div>
          <div className="photo-annotation annotation-card-10">
            <ArrowUpLeft className="arrow-card-10" width={34} height={24} />
            <span className="annotation-text">
              TECHNOLOGY<br />PEOPLE<br />A STRONGER<br />TOMORROW
            </span>
            <HandDrawnUnderline className="underline-card-10" width={78} height={8} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TelescopeSection;
