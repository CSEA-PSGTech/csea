import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

import { preloadImages } from "./utils";
import "./TelescopeSection.css";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function TelescopeSection() {
  const sectionRef = useRef(null);

useLayoutEffect(() => {
  const section = sectionRef.current;

  if (!section) return;

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

  // Important
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    timeline.kill();
  };
}, []);

  return (
    <main>
 
          <section
            className="section"
            ref={sectionRef}
          >
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
        
    </main>
  );
}

export default TelescopeSection;