import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { TeamSocials } from "../team/TeamSocials";
import "../team/Team.css";

export function FinderPreview({ member, onClose }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!member) return null;

  const showSocials = isHovered || isTouched;

  const name = member.name || "CSEA Member";
  const year = member.year || member.yearAndClass || member.batch || "";
  const role = member.role || member.position || "";
  const photoSrc = member.photo || member.image || member.thumbnail || "";

  const socials = member.socials || {
    github: member.github,
    linkedin: member.linkedin,
    email: member.email,
    instagram: member.instagram,
    x: member.x,
  };

  const hasSocials = Object.values(socials).some(Boolean);

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-white/10 backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center"
      >
        {/* Floating Minimal Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 sm:-right-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white text-neutral-800 hover:text-black backdrop-blur-md transition-all shadow-md border border-black/10 cursor-pointer"
          title="Close (Esc)"
          aria-label="Close preview"
        >
          <X className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
            ESC
          </span>
        </button>

        {/* The Exact "Meet the Team" Frame */}
        <div
          className="csea-team-card finder-preview-card !bg-transparent !shadow-none"
          style={{
            "--card-rotation": `${member.rotation || -1.2}deg`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsTouched((prev) => !prev)}
          tabIndex={0}
          role="region"
          aria-label={`Member ${name}`}
        >
          {/* Physical Photo Frame */}
          <div className="csea-team-card__frame">
            {/* Photo Container */}
            <div className="csea-team-card__photo-box !bg-transparent">
              {!imgError && photoSrc ? (
                <img
                  src={photoSrc}
                  alt={name}
                  className="csea-team-card__photo"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className="csea-team-card__photo-fallback"
                  style={{ backgroundColor: member.fallbackColor || "#0038ff" }}
                >
                  <span className="csea-team-card__fallback-text">
                    CSEA // {name}
                  </span>
                </div>
              )}

              {/* Floating Social Pill (reveals on hover / tap) */}
              {hasSocials && (
                <div
                  className={`csea-team-card__social-layer ${
                    showSocials ? "is-visible" : ""
                  }`}
                  aria-hidden={!showSocials}
                >
                  <TeamSocials socials={socials} memberName={name} />
                </div>
              )}
            </div>

            {/* Card Footer Bar with Name and Year Data */}
            <div className="csea-team-card__footer finder-preview-footer">
              <div className="csea-team-card__role">
                {/* NAME */}
                <span className="csea-team-card__role-line finder-preview-name">
                  {name}
                </span>

                {/* YEAR */}
                {year && (
                  <span className="csea-team-card__role-line finder-preview-year">
                    {year}
                  </span>
                )}

                {/* POSITION / ROLE */}
                {role && role !== name && (
                  <span className="csea-team-card__role-line finder-preview-position">
                    {role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinderPreview;