import React, { useState } from "react";
import { TeamSocials } from "./TeamSocials";

export const TeamCard = ({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showSocials = isHovered || isTouched;

  return (
    <div
      className={`csea-team-card csea-team-card--${member.id}`}
      style={{
        "--card-rotation": `${member.rotation || 0}deg`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsTouched((prev) => !prev)}
      tabIndex={0}
      role="region"
      aria-label={`Team member ${member.number}: ${member.fullRole}`}
    >
      {/* Physical Photo Frame */}
      <div className="csea-team-card__frame">
        {/* Photo Container */}
        <div className="csea-team-card__photo-box">
          {!imgError && member.image ? (
            <img
              src={member.image}
              alt={member.fullRole}
              className="csea-team-card__photo"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="csea-team-card__photo-fallback"
              style={{ backgroundColor: member.fallbackColor || "#0038ff" }}
            >
              <span className="csea-team-card__fallback-text">CSEA // {member.id}</span>
            </div>
          )}

          {/* Duotone / Subtle Editorial Filter Overlay */}
          <div className="csea-team-card__photo-tint" aria-hidden="true" />

          {/* Floating Social Pill (reveals on hover / tap) */}
          <div
            className={`csea-team-card__social-layer ${showSocials ? "is-visible" : ""}`}
            aria-hidden={!showSocials}
          >
            <TeamSocials socials={member.socials} memberName={member.fullRole} />
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="csea-team-card__footer">
          <div className="csea-team-card__role">
            {member.roleLines.map((line, i) => (
              <span key={i} className="csea-team-card__role-line">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
