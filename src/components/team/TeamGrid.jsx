import React from "react";

export const TeamGrid = () => {
  return (
    <div className="csea-team-grid" aria-hidden="true">
      {/* Vertical Column Guides */}
      <div className="csea-team-grid__line csea-team-grid__line--v1" />
      <div className="csea-team-grid__line csea-team-grid__line--v2" />
      <div className="csea-team-grid__line csea-team-grid__line--v3" />
      <div className="csea-team-grid__line csea-team-grid__line--v4" />
      <div className="csea-team-grid__line csea-team-grid__line--v5" />

      {/* Horizontal Guides */}
      <div className="csea-team-grid__line csea-team-grid__line--h1" />
      <div className="csea-team-grid__line csea-team-grid__line--h2" />
    </div>
  );
};
