import { useState, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useParams, useLocation } from "react-router-dom";
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
import TimelineDemo from "./components/Timeline/TimelineSection";
import Footer from "./components/footer/Footer";
import { TeamOverlay } from "./components/team/TeamOverlay";
import BlogCTA from "./components/blogs/blogCTA";
import BlogsListPage from "./components/blogs/blogsListPage";
import BlogPostPage from "./components/blogs/blogsPostPage";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Immediately disable browser's automatic scroll restoration on reload
if (typeof window !== "undefined") {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  ScrollTrigger.clearScrollMemory("manual");
  window.scrollTo(0, 0);
}

function HomePage() {
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  useLayoutEffect(() => {
    // 1. Enforce manual scroll restoration & clear GSAP's recorded scroll memory
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    ScrollTrigger.clearScrollMemory("manual");

    // 2. Clear any lingering hash from previous navigation on reload so browser doesn't anchor jump
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    // 3. Immediately reset window scroll position to top
    window.scrollTo(0, 0);

    // 4. Reset on beforeunload so reload always begins at (0, 0)
    const handleBeforeUnload = () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Skip ScrollSmoother entirely on mobile / small screens — GSAP's
    // transform-based smooth scroll fights with mobile browser chrome
    // (address bar collapse, momentum scroll, viewport resize) and
    // causes jank/glitches. Native scroll is used instead.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      window.__scrollSmoother = null;
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        ScrollTrigger.refresh(true);
      });
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }

    const smoother = ScrollSmoother.create({
      wrapper: ".wrapper",
      content: ".content",
      smooth: 1.2,
      smoothTouch: false,
      effects: true,
      normalizeScroll: false,
    });

    // Ensure ScrollSmoother starts at top (0) without glide
    smoother.scrollTop(0);

    // Exposed so StaggeredMenu (which renders outside .wrapper/.content,
    // in the fixed navbar div) can explicitly call scrollTo on click,
    // instead of relying on ScrollSmoother's anchor-click interception
    // reaching anchors outside its own scoped tree.
    window.__scrollSmoother = smoother;

    requestAnimationFrame(() => {
      smoother.scrollTop(0);
      ScrollTrigger.refresh(true);
      smoother.scrollTop(0);
    });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.__scrollSmoother = null;
      smoother.kill();
    };
  }, []);

  return (
    <>
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

          <BlogCTA />

          <Skiper28 />

          <div id="contact" className="w-full bg-[#002fe6]">
            <Footer onOpenTeam={() => setIsTeamOpen(true)} />
          </div>
        </div>
      </div>

      {/* CSEA Meet The Team Full-Screen Cinematic Poster Overlay */}
      <TeamOverlay isOpen={isTeamOpen} onClose={() => setIsTeamOpen(false)} />
    </>
  );
}

// Thin wrapper so BlogPostPage (which takes `id` as a plain prop, see
// its own file header comment) can read it from the route param.
function BlogPostRoute() {
  const { id } = useParams();
  return <BlogPostPage id={id} />;
}

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "#home" },
    { label: "About", ariaLabel: "Learn about us", link: "#about" },
    { label: "Clubs", ariaLabel: "Explore Affiliated Clubs", link: "#affiliated-clubs" },
    { label: "Events", ariaLabel: "Explore CSEA events", link: "#events" },
    { label: "Timeline", ariaLabel: "See our journey and milestones", link: "#timeline" },
    { label: "Members", ariaLabel: "Explore CSEA members", link: "#memberfinder" },
    { label: "Blogs", ariaLabel: "Read our blogs", link: "/blogs" },
    { label: "Contact", ariaLabel: "Get in touch", link: "mailto:csea.cse@psgtech.ac.in" },
  ];

  const socialItems = [
    { label: "Instagram", link: "https://instagram.com/cseapsgtech" },
    { label: "GitHub", link: "https://github.com/CSEA-PSGTech" },
    { label: "LinkedIn", link: "https://www.linkedin.com/company/cse-association-psg-tech/" },
  ];

  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* =====================================================
          FIXED NAVBAR
          Completely independent from ScrollSmoother, present
          across every route.
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

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogsListPage />} />
        <Route path="/blogs/:id" element={<BlogPostRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;