import React, { useState, useMemo } from "react";
import { FinderWindow } from "./FinderWindow";
import { DIRECTORY_DATA, SIDEBAR_SECTIONS, DEFAULT_PATH } from "./finderData";

export function MemberFinder() {
  const [history, setHistory] = useState([DEFAULT_PATH]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTeamId, setActiveTeamId] = useState("technical-team");
  const [previewMember, setPreviewMember] = useState(null);

  const currentPath = history[historyIdx] || ["CSEA"];
  const currentPathKey = currentPath.join("/");

  // Fetch current items based on directory path or fallback
  const rawItems = useMemo(() => {
    return DIRECTORY_DATA[currentPathKey] || DIRECTORY_DATA["CSEA"] || [];
  }, [currentPathKey]);

  // Filter items live based on search query
  const items = useMemo(() => {
    if (!searchQuery.trim()) return rawItems;
    const query = searchQuery.toLowerCase();
    return rawItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.role && item.role.toLowerCase().includes(query)) ||
        (item.badge && item.badge.toLowerCase().includes(query))
    );
  }, [rawItems, searchQuery]);

  // Navigation handlers
  const pushPath = (newPath) => {
    const updatedHistory = history.slice(0, historyIdx + 1);
    updatedHistory.push(newPath);
    setHistory(updatedHistory);
    setHistoryIdx(updatedHistory.length - 1);
    setSelectedId(null);
  };

  const handleGoBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setSelectedId(null);
    }
  };

  const handleGoForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setSelectedId(null);
    }
  };

  const handleNavigatePath = (index) => {
    const newPath = currentPath.slice(0, index + 1);
    pushPath(newPath);
  };

  const handleSelectTeam = (sidebarItem) => {
    setActiveTeamId(sidebarItem.id);
    if (sidebarItem.path) {
      pushPath(sidebarItem.path);
    }
  };

  const handleOpenItem = (item) => {
    if (item.type === "folder") {
      const newPath = [...currentPath, item.name];
      pushPath(newPath);
    } else if (item.type === "member") {
      setPreviewMember(item);
    }
  };

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Section Labeled Heading */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-2 block">
          Directory Explorer
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
          CSEA Members &amp; Teams
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 mt-3 font-medium">
          Explore CSEA faculty, office bearers, technical leads, and core teams .
        </p>
      </div>

      {/* macOS Finder Component */}
      <div className="relative z-10 w-full flex justify-center">
        <FinderWindow
          currentPath={currentPath}
          canGoBack={historyIdx > 0}
          canGoForward={historyIdx < history.length - 1}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sidebarSections={SIDEBAR_SECTIONS}
          activeTeamId={activeTeamId}
          onSelectTeam={handleSelectTeam}
          items={items}
          selectedId={selectedId}
          onSelectItem={(item) => setSelectedId(item ? item.id : null)}
          onOpenItem={handleOpenItem}
          previewMember={previewMember}
          onClosePreview={() => setPreviewMember(null)}
          onNavigatePath={handleNavigatePath}
        />
      </div>
    </section>
  );
}

export default MemberFinder;
