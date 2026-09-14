import { useState, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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
import BlogCTA from "./components/blogs/blogCTA";
import BlogsListPage from "./components/blogs/blogsListPage";
import BlogPostPage from "./components/blogs/blogsPostPage";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


function HomePage() {
  const [isTeamOpen, setIsTeamOpen] = useState(false);

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

// Thin wrapper so BlogPostPage (which takes `id` as a plain prop, see
// its own file header comment) can read it from the route param.
function BlogPostRoute() {
  const { id } = useParams();
  return <BlogPostPage id={id} />;
}

function App() {
  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "#home" },
    { label: "About", ariaLabel: "Learn about us", link: "#about" },
    { label: "Clubs", ariaLabel: "Explore Affiliated Clubs", link: "#affiliated-clubs" },
    { label: "Events", ariaLabel: "Explore CSEA events", link: "#events" },
    { label: "Timeline", ariaLabel: "See our journey and milestones", link: "#timeline" },
    { label: "Blogs", ariaLabel: "Read our blogs", link: "/blogs" },
    { label: "Members", ariaLabel: "Explore CSEA members", link: "#memberfinder" },
    { label: "Contact", ariaLabel: "Get in touch", link: "mailto:csea.cse@psgtech.ac.in" },
  ];

  const socialItems = [
    { label: "Instagram", link: "https://instagram.com/cseapsgtech" },
    { label: "GitHub", link: "https://github.com/CSEA-PSGTech" },
    { label: "LinkedIn", link: "https://www.linkedin.com/company/cse-association-psg-tech/" },
  ];

  return (
    <BrowserRouter>
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