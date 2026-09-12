import { useLayoutEffect, useRef } from "react";
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
  const pointerRef = useRef({
    x: 0.5,
    y: 0.5,
    velocity: 0,
    inside: false,
  });
  const prevPointerRef = useRef({ x: 0.5, y: 0.5, time: performance.now() });

  const handlePointerMove = (e) => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

    if (clientX === undefined || clientY === undefined) return;

    const now = performance.now();
    const dt = Math.max(0.001, (now - prevPointerRef.current.time) / 1000);

    const u = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1.0 - (clientY - rect.top) / rect.height));

    const dx = u - prevPointerRef.current.x;
    const dy = v - prevPointerRef.current.y;
    const dist = Math.hypot(dx, dy);
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

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2000",
          scrub: 1.2,
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
        z: "100vh",
        duration: 1,
        ease: "power1.inOut",
        stagger: {
          amount: 0.2,
          from: "center",
        },
      });

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
      <GlassCanvas pointerRef={pointerRef} />

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

      {/* Center scaling media */}
      <div className="section__media">
        <div className="section__media__back">
          <img src="/images/telescope/img-big.jpg" alt="CSEA" />
        </div>

        <div className="section__media__front front-1">
          <img src="/images/telescope/img-big.jpg" alt="CSEA" />
        </div>

        <div className="section__media__front front-2">
          <img src="/images/telescope/img-big.jpg" alt="CSEA" />
        </div>

        <div className="section__media__front front-3">
          <img src="/images/telescope/img-big.jpg" alt="CSEA" />
        </div>

        <div className="section__media__front front-4">
          <img src="/images/telescope/img-big.jpg" alt="CSEA" />
        </div>

        <div className="section__media__front front-5">
          <img src="/images/telescope/img-big.jpg" alt="CSEA" />
        </div>

        <div className="section__media__front front-6">
          <img src="/images/telescope/img-big.jpg" alt="CSEA" />
        </div>
      </div>

      {/* Floating Parallax Editorial Photo Cards with Hand-Drawn Annotations */}
      <div className="section__images">
        {/* Left Side */}
        <div className="photo-card photo-card-1">
          <div className="photo-card__frame">
            <img src="/landing_page/IMG_3783.jpg" alt="CSEA Workshop" />
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
            <img src="/landing_page/IMG20260214102944.jpg" alt="CSEA Event" />
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
            <img src="/landing_page/IMG20260214102643.jpg" alt="CSEA Activity" />
          </div>
        </div>

        <div className="photo-card photo-card-4">
          <div className="photo-card__frame">
            <img src="/landing_page/IMG_2573.JPG" alt="CSEA Team" />
          </div>
          <div className="photo-annotation annotation-card-4">
            <span className="annotation-text">
              SAME<br />STUDENTS<br />DIFFERENT<br />POSSIBILITIES
            </span>
          </div>
        </div>

        <div className="photo-card photo-card-5">
          <div className="photo-card__frame">
            <img src="/landing_page/IMG_9304.jpg" alt="CSEA Innovation" />
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
              src="/landing_page/a32ce3c3-589d-4146-a7d5-89f03edbd825.JPG"
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
            <img src="/landing_page/IMG_0214.jpg" alt="CSEA Presentation" />
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
              src="/landing_page/f1f64b74-2bfd-4098-a042-41087da10e68.JPG"
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
            <img src="/landing_page/IMG_3766.jpg" alt="CSEA Session" />
          </div>
        </div>

        <div className="photo-card photo-card-10">
          <div className="photo-card__frame">
            <img
              src="/landing_page/PXL_20260214_055018849.MP.jpg"
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