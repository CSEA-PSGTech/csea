import { useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

import TelescopeSection from "./components/landing/TelescopeSection/TelescopeSection";
import AboutSection from "./components/about/AboutSection";
import AffiliatedClubs from "./components/affiliated-clubs/AffiliatedClubs";
import EventsSection from "./components/events/EventsSection";
import { Skiper28 } from "@/components/ui/skiper-ui/skiper28";
import StaggeredMenu from "./components/ui/skiper-ui/Navbar";

import MemberFinder from "./components/MemberFinder/MemberFinder";
import TimelineDemo from "./components/timeline-demo";
import Footer from "./components/footer/Footer";
import { TeamOverlay } from "./components/team/TeamOverlay";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/* =====================================================
   App.jsx — single scrolling page, anchor-based nav.

   Every nav link is a "#id" hash. Because StaggeredMenu
   renders outside .wrapper/.content (in the fixed navbar
   div), it can't rely on ScrollSmoother's automatic anchor
   interception reaching it — so StaggeredMenu.jsx explicitly
   calls window.__scrollSmoother.scrollTo() on click instead.
   See the comment on window.__scrollSmoother below.

   EventsSection already renders its own <section id="events">
   internally, so it's used directly with no wrapper. Every
   other section here doesn't set its own id, so it's wrapped
   in a <div id="..."> to give scrollTo something to target.
===================================================== */

function App() {
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "#home" },
    { label: "About", ariaLabel: "Learn about us", link: "#about" },
    { label: "Clubs", ariaLabel: "Explore Affiliated Clubs", link: "#affiliated-clubs" },
    { label: "Events", ariaLabel: "Explore CSEA events", link: "#events" },
    { label: "Timeline", ariaLabel: "See our journey and milestones", link: "#timeline" },
    { label: "Members", ariaLabel: "Explore CSEA members", link: "#memberfinder" },
    { label: "Contact", ariaLabel: "Get in touch", link: "mailto:csea.cse@psgtech.ac.in" },
  ];

  const socialItems = [
    { label: "Instagram", link: "https://instagram.com/cseapsgtech" },
    { label: "GitHub", link: "https://github.com/cse-psgtech" },
    { label: "LinkedIn", link: "https://www.linkedin.com/company/cse-association-psg-tech/" },
  ];

  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: ".wrapper",
      content: ".content",
      smooth: 1.2,
      smoothTouch: false,
      effects: true,
      normalizeScroll: false,
    });

    // Exposed so StaggeredMenu (which renders outside .wrapper/.content,
    // in the fixed navbar div) can explicitly call scrollTo on click,
    // instead of relying on ScrollSmoother's anchor-click interception
    // reaching anchors outside its own scoped tree.
    window.__scrollSmoother = smoother;

    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });

    return () => {
      window.__scrollSmoother = null;
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
            // logoUrl="/favicon.svg"
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
          <div id="home">
            <TelescopeSection />
          </div>

          <AboutSection />

          <div id="affiliated-clubs">
            <AffiliatedClubs />
          </div>

          {/* EventsSection already renders <section id="events"> internally */}
          <EventsSection />

          <div id="timeline">
            <TimelineDemo />
          </div>

          <div id="memberfinder">
            <MemberFinder />
          </div>

          <Skiper28 />

          <div id="contact">
            <Footer onOpenTeam={() => setIsTeamOpen(true)} />
          </div>
        </div>
      </div>

      {/* CSEA Meet The Team Full-Screen Cinematic Poster Overlay */}
      <TeamOverlay isOpen={isTeamOpen} onClose={() => setIsTeamOpen(false)} />
    </>
  );
}

export default App;