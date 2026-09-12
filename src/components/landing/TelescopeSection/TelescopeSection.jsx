import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

import { preloadImages } from "./utils";
import GlassCanvas from "../GlassHero/GlassCanvas";
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
      ".section__images img"
    );

    gsap.set(smallImages, {
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      force3D: true,
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=2000",
        scrub: true,
        pin: true,
        pinSpacing: true,
        pinType: "transform",
        anticipatePin: 1,
        invalidateOnRefresh: true,

        onUpdate: (self) => {
          const easedProgress =
            gsap.parseEase("power1.inOut")(self.progress);

          section.style.setProperty(
            "--progress",
            easedProgress
          );
        },
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

    timeline.to(
      frontImages,
      {
        duration: 1,
        filter: "blur(0px)",
        ease: "power1.inOut",
        delay: 0.4,
        stagger: {
          amount: 0.2,
          from: "end",
        },
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
      <GlassCanvas pointerRef={pointerRef} />

      <h1>
        <span className="left">we are</span>
        <span className="right">CSEA ; )</span>
      </h1>

            <div className="section__media">
              <div className="section__media__back">
                <img
                  src="/images/telescope/img-big.jpg"
                  alt="CSEA"
                />
              </div>

              <div className="section__media__front front-1">
                <img
                  src="/images/telescope/img-big.jpg"
                  alt="CSEA"
                />
              </div>

              <div className="section__media__front front-2">
                <img
                  src="/images/telescope/img-big.jpg"
                  alt="CSEA"
                />
              </div>

              <div className="section__media__front front-3">
                <img
                  src="/images/telescope/img-big.jpg"
                  alt="CSEA"
                />
              </div>

              <div className="section__media__front front-4">
                <img
                  src="/images/telescope/img-big.jpg"
                  alt="CSEA"
                />
              </div>

              <div className="section__media__front front-5">
                <img
                  src="/images/telescope/img-big.jpg"
                  alt="CSEA"
                />
              </div>

              <div className="section__media__front front-6">
                <img
                  src="/images/telescope/img-big.jpg"
                  alt="CSEA"
                />
              </div>
            </div>

            <div className="section__images">
              <img
                src="/images/telescope/img-1.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-2.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-3.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-4.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-9.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-6.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-7.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-8.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-9.webp"
                alt=""
              />
              <img
                src="/images/telescope/img-10.webp"
                alt=""
              />
            </div>
    </section>
  );
}

export default TelescopeSection;