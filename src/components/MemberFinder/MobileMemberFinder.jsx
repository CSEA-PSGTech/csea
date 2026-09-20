import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
} from "lucide-react";

import { FinderPreview } from "./FinderPreview";

function resolvePhotoUrl(photo) {
  if (!photo) return "";
  if (photo.startsWith("http://") || photo.startsWith("https://") || photo.startsWith("data:")) {
    if (photo.includes("drive.google.com")) {
      const match = photo.match(/id=([^&]+)/) || photo.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w500`;
      }
    }
    return photo;
  }
  if (photo.startsWith("/api/")) return `http://localhost:4000${photo}`;
  return photo;
}

// Team descriptions & metadata mapping
const TEAM_META = {
  Technical: {
    description: "Core developers, builders and tech leads.",
    defaultInterests: ["Backend", "DevOps", "Security", "Open Source", "Systems"],
  },
  "Technical Team": {
    description: "Core developers, builders and tech leads.",
    defaultInterests: ["Backend", "DevOps", "Security", "Open Source", "Systems"],
  },
  "Office Bearer": {
    description: "Student leaders driving CSEA forward.",
    defaultInterests: ["Leadership", "Community", "Strategy", "Operations", "Governance"],
  },
  "Office Bearers": {
    description: "Student leaders driving CSEA forward.",
    defaultInterests: ["Leadership", "Community", "Strategy", "Operations", "Governance"],
  },
  Admin: {
    description: "Managing logistics, coordination, and resources.",
    defaultInterests: ["Operations", "Event Logistics", "Planning", "Budgeting", "Coordination"],
  },
  Events: {
    description: "Curating flagship hackathons, symposiums and technical tracks.",
    defaultInterests: ["Event Production", "Workshops", "Hackathons", "Outreach", "Coordination"],
  },
  Design: {
    description: "Crafting visual identity, editorial graphics and UI/UX.",
    defaultInterests: ["UI/UX", "Brand Systems", "Motion", "Typography", "Figma"],
  },
  "Public Relations": {
    description: "Connecting CSEA with industry, academia and tech communities.",
    defaultInterests: ["Sponsorships", "Alumni Network", "Outreach", "Press", "Partnerships"],
  },
  Media: {
    description: "Capturing moments and creating visual stories.",
    defaultInterests: ["Photography", "Cinematography", "Post-Production", "Audio", "Storytelling"],
  },
  "E-Cell": {
    description: "Fostering startup culture, student founders and ventures.",
    defaultInterests: ["Venture Building", "Product", "Pitching", "Growth", "Incubation"],
  },
  "Faculty Advisor": {
    description: "Faculty leaders and academic mentors guiding CSEA.",
    defaultInterests: ["Research", "Curriculum", "Mentorship", "Innovation", "Algorithms"],
  },
  "Web Dev Team": {
    description: "Building CSEA digital experiences, portals and tooling.",
    defaultInterests: ["Frontend", "React", "Fullstack", "APIs", "Performance"],
  },
  ERM: {
    description: "External relations, sponsor coordination and PR.",
    defaultInterests: ["Public Relations", "Outreach", "Sponsorship", "Media", "Events"],
  },
};

// Fallback folder directory if directoryData is empty
const DEFAULT_MOBILE_FOLDERS = [
  { id: "folder-ob", name: "Office Bearer" },
  { id: "folder-admin", name: "Admin" },
  { id: "folder-events", name: "Events" },
  { id: "folder-design", name: "Design" },
  { id: "folder-pr", name: "Public Relations" },
  { id: "folder-media", name: "Media" },
  { id: "folder-technical", name: "Technical" },
  { id: "folder-ecell", name: "E-Cell" },
];

/**
 * 3D macOS Blue Folder SVG
 */
function MacFolderIcon({ className = "w-14 h-12" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 72 60" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="mFolderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="mFolderBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
        {/* Back */}
        <path
          d="M 6 10 C 6 6, 9 4, 13 4 L 26 4 C 29 4, 31 7, 34 10 L 37 13 L 64 13 C 68 13, 70 16, 70 20 L 70 50 C 70 54, 68 56, 64 56 L 8 56 C 4 56, 2 54, 2 50 L 2 14 C 2 10, 4 10, 6 10 Z"
          fill="url(#mFolderBackGrad)"
        />
        {/* Tab sheet */}
        <rect x="8" y="12" width="56" height="38" rx="3" fill="#ffffff" opacity="0.4" />
        {/* Front */}
        <path
          d="M 2 20 C 2 16, 5 15, 9 15 L 63 15 C 67 15, 70 16, 70 20 L 68 51 C 68 55, 65 57, 61 57 L 11 57 C 7 57, 4 55, 4 51 Z"
          fill="url(#mFolderGrad)"
        />
      </svg>
    </div>
  );
}

/**
 * Hand-drawn curved arrow annotation pointing up to folders
 */
function TapFolderAnnotation() {
  return (
    <div className="relative w-full flex flex-col items-center pt-3 pb-2 select-none pointer-events-none">
      <div className="flex items-center gap-2 text-[#0038FF]">
        <svg
          width="46"
          height="32"
          viewBox="0 0 46 32"
          fill="none"
          stroke="#0038FF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="rotate-[-10deg]"
        >
          <path d="M 6 26 C 18 28, 36 24, 38 8" />
          <path d="M 32 10 L 38 6 L 42 13" />
        </svg>
        <span
          className="text-xs font-bold tracking-wider uppercase text-[#0038FF]"
          style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive, sans-serif" }}
        >
          Tap a folder to explore
        </span>
      </div>
    </div>
  );
}

/**
 * Helper to check if role/position is a Lead
 */
function isLeadRole(role = "") {
  const r = role.toLowerCase();
  return (
    r.includes("lead") ||
    r.includes("head") ||
    r.includes("president") ||
    r.includes("secretary") ||
    r.includes("director") ||
    r.includes("chair") ||
    r.includes("advisor") ||
    r.includes("convenor")
  );
}

export function MobileMemberFinder({
  directoryData = {},
  onSelectMember,
}) {
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'leads' | 'members'
  const [previewMember, setPreviewMember] = useState(null);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);

  // Extract folder list from directoryData["CSEA"] or fallback
  const folders = useMemo(() => {
    const rootItems = directoryData["CSEA"];
    if (rootItems && rootItems.length > 0) {
      return rootItems.filter((i) => i.type === "folder");
    }
    return DEFAULT_MOBILE_FOLDERS;
  }, [directoryData]);

  // Extract members for active folder
  const currentMembers = useMemo(() => {
    if (!activeFolder) return [];
    // Key might be `CSEA/${activeFolder.name}`
    const key = `CSEA/${activeFolder.name}`;
    const found = directoryData[key] || [];
    return found.filter((i) => i.type === "member");
  }, [activeFolder, directoryData]);

  // Filter members by tab
  const filteredMembers = useMemo(() => {
    if (activeTab === "leads") {
      return currentMembers.filter((m) => isLeadRole(m.role || m.position));
    }
    if (activeTab === "members") {
      return currentMembers.filter((m) => !isLeadRole(m.role || m.position));
    }
    return currentMembers;
  }, [currentMembers, activeTab]);

  const leadsCount = useMemo(() => {
    return currentMembers.filter((m) => isLeadRole(m.role || m.position)).length;
  }, [currentMembers]);

  const generalMembersCount = useMemo(() => {
    return currentMembers.filter((m) => !isLeadRole(m.role || m.position)).length;
  }, [currentMembers]);

  const activeMeta = useMemo(() => {
    if (!activeFolder) return null;
    return (
      TEAM_META[activeFolder.name] || {
        description: "Explore the members and contributors in this team.",
        defaultInterests: ["Engineering", "Collaboration", "Technology", "Design"],
      }
    );
  }, [activeFolder]);

  // Handle opening a folder
  const handleOpenFolder = (folder) => {
    setActiveFolder(folder);
    setActiveTab("all");
    setIsQuickNavOpen(false);
  };

  // Handle going back to directory
  const handleBackToDirectory = () => {
    setActiveFolder(null);
    setActiveTab("all");
    setPreviewMember(null);
  };

  return (
    <div className="w-full max-w-[340px] sm:max-w-md mx-auto">
      {/* Container simulating the refined macOS Finder card on mobile */}
      <div className="w-full rounded-[20px] sm:rounded-[22px] bg-white border border-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
        {/* Finder Header Bar */}
        <div className="h-11 sm:h-12 bg-neutral-100/80 border-b border-black/8 px-3.5 sm:px-4 flex items-center justify-between">
          {/* macOS Window Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
          </div>

          {/* Center Title / Quick Nav dropdown toggle */}
          <button
            type="button"
            onClick={() => setIsQuickNavOpen(true)}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-neutral-800 hover:text-blue-600 transition-colors cursor-pointer py-1 px-2 rounded-md active:bg-black/5"
          >
            <span>CSEA Explorer</span>
            <span className="text-[10px] text-neutral-400">⌄</span>
          </button>

          {/* Quick jump button */}
          <button
            type="button"
            onClick={() => setIsQuickNavOpen(true)}
            aria-label="Jump to Team"
            className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white border border-black/10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Compass className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-600" />
          </button>
        </div>

        {/* Directory Breadcrumbs / Path Sub-Bar */}
        <div className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-neutral-50/70 border-b border-black/5 flex items-center justify-between text-[11px] sm:text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-1 truncate">
            <span className="text-blue-600 font-semibold">📁</span>
            <span>
              /CSEA/{activeFolder ? activeFolder.name : "Directory"}
            </span>
          </div>

          {activeFolder && (
            <button
              onClick={handleBackToDirectory}
              className="text-[11px] sm:text-xs font-sans text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Dynamic Content: Screen 02 (Directory) OR Screen 03/05 (Team View) */}
        <div className="p-3.5 sm:p-5 min-h-[350px] flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {!activeFolder ? (
              /* =======================================================
                 02. TEAM DIRECTORY (Grid of Folders)
                 ======================================================= */
              <motion.div
                key="directory-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                {/* 2-Column Grid of Folders */}
                <div className="grid grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-3 sm:gap-x-4 py-1.5 sm:py-2">
                  {folders.map((folder) => (
                    <motion.button
                      key={folder.id || folder.name}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleOpenFolder(folder)}
                      className="flex flex-col items-center text-center p-1.5 sm:p-2 rounded-xl hover:bg-neutral-50 active:bg-blue-50/50 transition-colors group cursor-pointer focus:outline-none"
                    >
                      <MacFolderIcon className="w-13 h-11 sm:w-16 sm:h-14 transition-transform group-hover:scale-105" />
                      <span className="mt-1.5 text-[11px] sm:text-xs font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug max-w-[120px] truncate">
                        {folder.name}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Hand-drawn annotation */}
                <TapFolderAnnotation />
              </motion.div>
            ) : (
              /* =======================================================
                 03 & 05. TEAM VIEW (Polaroid Cards with Role & Tabs)
                 ======================================================= */
              <motion.div
                key={`team-view-${activeFolder.name}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                {/* Back to Directory Button */}
                <button
                  onClick={handleBackToDirectory}
                  className="self-start inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-blue-600 transition-colors mb-3 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Directory</span>
                </button>

                {/* Team Header Banner */}
                <div className="flex items-start gap-3 mb-4">
                  <MacFolderIcon className="w-12 h-10 shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-950 leading-tight">
                      {activeFolder.name}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">
                      {activeMeta.description}
                    </p>
                  </div>
                </div>

                {/* Filter Tabs: All / Leads / Members */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-100/90 border border-black/5 mb-5 select-none self-start">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeTab === "all"
                        ? "bg-[#0038FF] text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    All ({currentMembers.length})
                  </button>

                  <button
                    onClick={() => setActiveTab("leads")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeTab === "leads"
                        ? "bg-[#0038FF] text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Leads ({leadsCount})
                  </button>

                  <button
                    onClick={() => setActiveTab("members")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activeTab === "members"
                        ? "bg-[#0038FF] text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Members ({generalMembersCount})
                  </button>
                </div>

                {/* Member Polaroid Cards Grid */}
                {filteredMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400 text-xs">
                    <p>No members in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 pb-2">
                    {filteredMembers.map((member, idx) => {
                      const photoUrl = resolvePhotoUrl(
                        member.photo ||
                        member.url ||
                        member.image ||
                        member.thumbnail ||
                        ""
                      );
                      // Alternate slight rotations for organic polaroid look
                      const rotations = [-1.5, 1.2, -1, 1.5, -0.8, 1];
                      const rot = rotations[idx % rotations.length];

                      return (
                        <motion.div
                          key={member.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setPreviewMember(member)}
                          className="bg-white rounded-lg p-2 border border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-md transition-all cursor-pointer flex flex-col group"
                          style={{
                            transform: `rotate(${rot}deg)`,
                          }}
                        >
                          {/* Polaroid Photo Box */}
                          <div className="w-full aspect-square rounded-md overflow-hidden bg-neutral-100 relative mb-2">
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={member.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  if (e.currentTarget.nextSibling) {
                                    e.currentTarget.nextSibling.style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              className="w-full h-full items-center justify-center bg-blue-900 text-white text-[11px] font-mono font-bold p-1 text-center"
                              style={{
                                display: photoUrl ? "none" : "flex",
                              }}
                            >
                              {member.name.slice(0, 2).toUpperCase()}
                            </div>
                          </div>

                          {/* Member Info */}
                          <div className="text-center px-0.5">
                            <p className="text-xs font-bold text-neutral-900 leading-snug truncate">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                              {member.role || member.position || "Member"}
                              {(member.year || member.yearAndClass || member.batch) && (
                                <span className="text-neutral-400 font-normal"> · {member.year || member.yearAndClass || member.batch}</span>
                              )}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* =======================================================
         04. MEMBER DETAIL MODAL (Portaled to document.body, same as desktop)
         ======================================================= */}
      {typeof document !== "undefined" && previewMember &&
        createPortal(
          <FinderPreview
            member={previewMember}
            onClose={() => setPreviewMember(null)}
            isPortaled={true}
          />,
          document.body
        )}

      {/* =======================================================
         06. QUICK NAV (Bottom Sheet Portaled to document.body)
         ======================================================= */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isQuickNavOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsQuickNavOpen(false)}
                className="fixed inset-0 z-[100002] bg-black/50 backdrop-blur-xs flex items-end justify-center select-none"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 350 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-md rounded-t-[28px] bg-white border-t border-black/10 p-5 pb-8 shadow-2xl flex flex-col max-h-[80vh]"
                >
                  {/* Drag Handle */}
                  <div className="w-12 h-1.5 rounded-full bg-neutral-300 mx-auto mb-4" />

                  {/* Sheet Title */}
                  <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-2">
                    <h4 className="text-base font-bold text-neutral-950">
                      Jump to Team
                    </h4>
                    <button
                      onClick={() => setIsQuickNavOpen(false)}
                      className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:text-neutral-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* List of Teams */}
                  <div className="overflow-y-auto divide-y divide-black/5">
                    {folders.map((folder) => {
                      const isCurrent = activeFolder?.name === folder.name;
                      return (
                        <button
                          key={folder.id || folder.name}
                          onClick={() => handleOpenFolder(folder)}
                          className={`w-full py-3 px-2 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer rounded-lg ${
                            isCurrent ? "bg-blue-50/60 font-semibold" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <MacFolderIcon className="w-7 h-6" />
                            <span
                              className={`text-sm ${
                                isCurrent ? "text-blue-700 font-bold" : "text-neutral-800"
                              }`}
                            >
                              {folder.name}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400" />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

export default MobileMemberFinder;
