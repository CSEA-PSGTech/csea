import React from "react";

/**
 * Hand-drawn blue editorial annotations & SVG curved arrows
 * matching team-visual-reference.png
 */

export const AnnotationCard1 = () => (
  <div className="csea-annotation csea-annotation--card1" aria-hidden="true">
    <div className="csea-annotation__text">
      <span>DESIGN</span>
      <span>IDEATE</span>
      <span>VISUALIZE</span>
    </div>
    <svg className="csea-annotation__arrow-c1" viewBox="0 0 54 36" fill="none">
      <path
        d="M 6 4 C 18 10, 36 12, 44 26"
        stroke="#0038ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 33 24 L 44 26 L 43 15"
        stroke="#0038ff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const AnnotationCard2 = () => (
  <div className="csea-annotation csea-annotation--card2" aria-hidden="true">
    <div className="csea-annotation__text">
      <span>BUILD</span>
      <span>OPTIMIZE</span>
      <span>SCALE</span>
    </div>
    <svg className="csea-annotation__arrow-c2" viewBox="0 0 46 36" fill="none">
      <path
        d="M 8 4 C 20 8, 30 18, 32 28"
        stroke="#0038ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 22 24 L 32 28 L 36 18"
        stroke="#0038ff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const AnnotationCard3 = () => (
  <div className="csea-annotation csea-annotation--card3" aria-hidden="true">
    <div className="csea-annotation__text">
      <span>ORGANIZE</span>
      <span>CONNECT</span>
      <span>MAKE IT HAPPEN</span>
    </div>
    <svg className="csea-annotation__arrow-c3" viewBox="0 0 52 36" fill="none">
      <path
        d="M 44 4 C 32 10, 18 14, 10 26"
        stroke="#0038ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 21 24 L 10 26 L 12 15"
        stroke="#0038ff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const AnnotationPeopleBehind = () => (
  <div className="csea-annotation csea-annotation--people-behind" aria-hidden="true">
    <div className="csea-annotation__text csea-annotation__text--lg">
      <span>PEOPLE</span>
      <span>BEHIND</span>
      <span>CSEA</span>
    </div>
    {/* Hand-drawn Smiley */}
    <svg className="csea-annotation__smiley" viewBox="0 0 32 32" fill="none">
      <circle cx="10" cy="11" r="2.2" fill="#0038ff" />
      <circle cx="22" cy="11" r="2.2" fill="#0038ff" />
      <path
        d="M 7 18 C 11 26, 21 26, 25 18"
        stroke="#0038ff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const AnnotationDifferentPeople = () => (
  <div className="csea-annotation csea-annotation--different-people" aria-hidden="true">
    {/* Hand-drawn Star */}
    <svg className="csea-annotation__star-single" viewBox="0 0 28 28" fill="none">
      <path
        d="M 14 3 L 17 10 L 25 11 L 19 17 L 21 25 L 14 21 L 7 25 L 9 17 L 3 11 L 11 10 Z"
        stroke="#0038ff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <div className="csea-annotation__text">
      <span>DIFFERENT</span>
      <span>PEOPLE</span>
      <span>SAME VISION</span>
    </div>
    <div className="csea-annotation__underline" />
  </div>
);

export const AnnotationHoverHint = () => (
  <div className="csea-annotation csea-annotation--hover-hint" aria-hidden="true">
    <div className="csea-annotation__text csea-annotation__text--sm">
      <span>Hover</span>
      <span>to reveal socials</span>
    </div>
    <svg className="csea-annotation__hint-arrow" viewBox="0 0 48 30" fill="none">
      <path
        d="M 40 6 C 24 8, 12 16, 6 24"
        stroke="#0038ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 16 22 L 6 24 L 8 13"
        stroke="#0038ff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const AnnotationTogether = () => (
  <div className="csea-annotation csea-annotation--together" aria-hidden="true">
    {/* Hand-drawn twin sparkle stars */}
    <div className="csea-annotation__star-cluster">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M 12 2 L 15 9 L 22 10 L 17 15 L 18 22 L 12 18 L 6 22 L 7 15 L 2 10 L 9 9 Z"
          stroke="#0038ff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M 12 2 L 15 9 L 22 10 L 17 15 L 18 22 L 12 18 L 6 22 L 7 15 L 2 10 L 9 9 Z"
          stroke="#0038ff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <div className="csea-annotation__text">
      <span>BUILD</span>
      <span>LEARN</span>
      <span>CREATE</span>
      <span>TOGETHER</span>
    </div>
    <div className="csea-annotation__underline" />
  </div>
);
