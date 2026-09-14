import React, { useEffect, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";

const InstagramIcon = ({ size = 19 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 19 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = ({ size = 19 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
  </svg>
);

const GithubIcon = ({ size = 19 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Footer = ({ onOpenTeam }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Same explicit-scrollTo approach used in the navbar: hash links call
  // window.__scrollSmoother.scrollTo() directly rather than relying on
  // ScrollSmoother's automatic anchor interception, for consistent,
  // reliable behavior everywhere in the app.
  const handleAnchorClick = useCallback((e, href) => {
    if (typeof href !== "string" || !href.startsWith("#")) return;
    e.preventDefault();
    const smoother = window.__scrollSmoother;
    if (smoother && typeof smoother.scrollTo === "function") {
      smoother.scrollTo(href, true, "top");
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // hrefs match the actual section ids in App.jsx:
  // id="home" (TelescopeSection), id="about" (set by StorySection itself),
  // id="timeline" (TimelineDemo), id="memberfinder" (MemberFinder).
  const exploreLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Timeline", href: "#timeline" },
    { label: "Members", href: "#memberfinder" },
    {label: "Blogs", href: "/blogs" },
    { label: "Team", href: "/team", isTeamTrigger: true },
  ];

  // These don't have matching sections anywhere in the app yet — left
  // as real paths for now. Clicking them will attempt a full page nav
  // to a route that doesn't exist (no router is set up). Let me know
  // if any of these should become real sections/anchors, or get
  // removed from the footer until they exist.
  const resourceLinks = [
    { label: "Gallery", href: "#" },
    { label: "Achievements", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Join Us", href: "#" },
    { label: "Contact", href: "mailto:csea.cse@psgtech.ac.in" },
  ];

  return (
    <footer className="csea-footer" role="contentinfo" aria-label="CSEA Website Footer">
      {/* Background Grid Texture and Lighting Glow */}
      <div className="csea-footer__texture" aria-hidden="true" />
      <div className="csea-footer__glow" aria-hidden="true" />

      {/* Floating Physical "MEET THE TEAM →" Folder */}
      <div className="csea-footer__folder-wrapper">
        {/* Hand-drawn excitement burst rays */}
        <svg
          className="csea-footer__folder-rays"
          width="32"
          height="30"
          viewBox="0 0 32 30"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 22L2 13" stroke="#0038ff" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M16 20L16 3" stroke="#0038ff" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M26 22L31 11" stroke="#0038ff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>

        <a
          href="/team"
          onClick={(e) => {
            if (onOpenTeam) {
              e.preventDefault();
              onOpenTeam();
            }
          }}
          className="csea-footer__folder"
          aria-label="Meet the CSEA Team"
        >
          {/* Back sheet layer for realistic physical paper depth */}
          <div className="csea-footer__folder-back" aria-hidden="true" />

          {/* Front folder container with tab */}
          <div className="csea-footer__folder-front">
            <div className="csea-footer__folder-tab" aria-hidden="true" />
            <div className="csea-footer__folder-body">
              <span className="csea-footer__folder-text">MEET THE TEAM</span>
              <svg
                className="csea-footer__folder-arrow"
                width="22"
                height="14"
                viewBox="0 0 22 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="1" y1="7" x2="19" y2="7" />
                <polyline points="13 2 19 7 13 12" />
              </svg>
            </div>
          </div>
        </a>
      </div>

      {/* Main Footer Inner Content */}
      <div className="csea-footer__inner">
        <div className="csea-footer__main-grid">

          {/* 1. Left Brand & College Column */}
          <div className="csea-footer__left-col">
            <h2 className="csea-footer__brand-title">CSEA</h2>
            <p className="csea-footer__brand-sub">
              COMPUTER SCIENCE AND<br />
              ENGINEERING ASSOCIATION
            </p>
            <div className="csea-footer__brand-divider" aria-hidden="true" />
            <p className="csea-footer__college-title">
              PSG COLLEGE OF TECHNOLOGY
            </p>

            {/* Social Icons Row */}
            <div className="csea-footer__social-row">
              <a
                href="https://instagram.com/cseapsgtech"
                target="_blank"
                rel="noopener noreferrer"
                className="csea-footer__social-link"
                aria-label="CSEA on Instagram"
              >
                <InstagramIcon size={19} />
              </a>
              <a
                href="https://www.linkedin.com/company/cse-association-psg-tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="csea-footer__social-link"
                aria-label="CSEA on LinkedIn"
              >
                <LinkedinIcon size={19} />
              </a>
              <a
                href="https://youtube.com/@cseapsgtech"
                target="_blank"
                rel="noopener noreferrer"
                className="csea-footer__social-link"
                aria-label="CSEA on YouTube"
              >
                <YoutubeIcon size={19} />
              </a>
              <a
                href="https://github.com/CSEA-PSGTech"
                target="_blank"
                rel="noopener noreferrer"
                className="csea-footer__social-link"
                aria-label="CSEA on GitHub"
              >
                <GithubIcon size={19} />
              </a>
            </div>

            <p className="csea-footer__copyright">
              © 2025 CSEA. ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* 2. Middle Navigation Columns (EXPLORE, RESOURCES, CONNECT) */}
          <div className="csea-footer__nav-group">
            {/* Column A: EXPLORE */}
            <div className="csea-footer__nav-col">
              <h3 className="csea-footer__nav-col-title">EXPLORE</h3>
              <ul className="csea-footer__nav-list">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="csea-footer__nav-link"
                      onClick={(e) => {
                        if (link.isTeamTrigger && onOpenTeam) {
                          e.preventDefault();
                          onOpenTeam();
                          return;
                        }
                        handleAnchorClick(e, link.href);
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column B: RESOURCES */}
            <div className="csea-footer__nav-col">
              <h3 className="csea-footer__nav-col-title">RESOURCES</h3>
              <ul className="csea-footer__nav-list">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="csea-footer__nav-link"
                      onClick={(e) => handleAnchorClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            
          </div>

          {/* 3. Subtle Vertical Grid Divider */}
          <div className="csea-footer__vertical-divider" aria-hidden="true" />

          {/* 4. Right Technical Graphic & Taglines */}
          <div className="csea-footer__right-col">
            <div className="csea-footer__graphic-row">
              {/* White Vector Wireframe Globe + Orbital Ring + 4-Point Star */}
              <div className="csea-footer__globe-container">
                <svg
                  className="csea-footer__globe-svg"
                  viewBox="0 0 160 140"
                  fill="none"
                  aria-hidden="true"
                >
                  {/* Sphere boundary */}
                  <circle
                    cx="70"
                    cy="70"
                    r="44"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeOpacity="0.9"
                  />
                  {/* Longitude meridian lines */}
                  <line
                    x1="70"
                    y1="26"
                    x2="70"
                    y2="114"
                    stroke="#ffffff"
                    strokeWidth="1.1"
                    strokeOpacity="0.8"
                  />
                  <ellipse
                    cx="70"
                    cy="70"
                    rx="22"
                    ry="44"
                    stroke="#ffffff"
                    strokeWidth="1.1"
                    strokeOpacity="0.75"
                  />
                  <ellipse
                    cx="70"
                    cy="70"
                    rx="35"
                    ry="44"
                    stroke="#ffffff"
                    strokeWidth="1.1"
                    strokeOpacity="0.75"
                  />
                  {/* Latitude parallel curves */}
                  <ellipse
                    cx="70"
                    cy="70"
                    rx="44"
                    ry="13"
                    stroke="#ffffff"
                    strokeWidth="1.1"
                    strokeOpacity="0.75"
                  />
                  <path
                    d="M 37 48 C 47 55 93 55 103 48"
                    stroke="#ffffff"
                    strokeWidth="1.1"
                    strokeOpacity="0.65"
                  />
                  <path
                    d="M 37 92 C 47 85 93 85 103 92"
                    stroke="#ffffff"
                    strokeWidth="1.1"
                    strokeOpacity="0.65"
                  />

                  {/* 3D Tilted Orbital Ellipse Ring */}
                  <ellipse
                    cx="70"
                    cy="70"
                    rx="74"
                    ry="20"
                    transform="rotate(-23 70 70)"
                    stroke="#ffffff"
                    strokeWidth="1.75"
                    strokeOpacity="0.95"
                  />

                  {/* 4-point Sparkle Star in upper right */}
                  <path
                    d="M 124 16 Q 124 25 115 25 Q 124 25 124 34 Q 124 25 133 25 Q 124 25 124 16 Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>

              {/* Editorial Tag List */}
              <div className="csea-footer__globe-tags">
                <span className="csea-footer__tag-item">IDEAS</span>
                <span className="csea-footer__tag-item">PEOPLE</span>
                <span className="csea-footer__tag-item">OPPORTUNITIES</span>
                <div className="csea-footer__tag-underline" aria-hidden="true" />
              </div>
            </div>

            {/* Bottom Slogan with Sparkle Star */}
            <div className="csea-footer__bottom-motto">
              <span className="csea-footer__motto-text">
                BUILD · LEARN · CREATE · TOGETHER
              </span>
              <span className="csea-footer__motto-line" aria-hidden="true" />
              <span className="csea-footer__motto-star" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M 7 0 Q 7 7 0 7 Q 7 7 7 14 Q 7 7 14 7 Q 7 7 7 0 Z" />
                </svg>
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;