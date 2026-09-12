import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";


import TelescopeSection from "./components/landing/TelescopeSection/TelescopeSection";
import AboutSection from "./components/about/AboutSection";
import EventsSection from "./components/events/EventsSection";
import { Skiper28 } from "@/components/ui/skiper-ui/skiper28";
import StaggeredMenu from "./components/ui/skiper-ui/Navbar";

import MemberFinder from "./components/MemberFinder/MemberFinder";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function App() {
  const menuItems = [
    {
      label: "Home",
      ariaLabel: "Go to home page",
      link: "/",
    },
    {
      label: "About",
      ariaLabel: "Learn about us",
      link: "/about",
    },
    {
      label: "Events",
      ariaLabel: "Explore CSEA events",
      link: "#events",
    },
    {
      label: "Services",
      ariaLabel: "View our services",
      link: "/services",
    },
    {
      label: "Contact",
      ariaLabel: "Get in touch",
      link: "/contact",
    },
  ];

  const socialItems = [
    {
      label: "Twitter",
      link: "https://twitter.com",
    },
    {
      label: "GitHub",
      link: "https://github.com",
    },
    {
      label: "LinkedIn",
      link: "https://linkedin.com",
    },
  ];

  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: ".wrapper",
      content: ".content",
      smooth: 1.2,
      smoothTouch: 0.1,
      effects: true,
      normalizeScroll: false,
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <>
     

      {/* =====================================================
          FIXED NAVBAR
          Completely independent from ScrollSmoother
      ===================================================== */}

      <div className="fixed inset-0 z-[99999] h-dvh w-screen pointer-events-none">
        <div className="relative h-full w-full pointer-events-none">

          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials
            displayItemNumbering
            menuButtonColor="#0026ff"
            openMenuButtonColor="#5227FF"
            changeMenuColorOnOpen
            colors={["#B497CF", "#5227FF"]}
            logoUrl="/favicon.svg"
            accentColor="#5227FF"
            onMenuOpen={() => console.log("Menu opened")}
            onMenuClose={() => console.log("Menu closed")}
          />

        </div>
      </div>


      {/* =====================================================
          SCROLLSMOOTHER CONTENT
      ===================================================== */}

      <div className="wrapper">
        <div className="content">

          <TelescopeSection />

          <AboutSection />

          <EventsSection />

     
          <MemberFinder />
     <Skiper28 />
        </div>
      </div>
    </>
  );
}

export default App;