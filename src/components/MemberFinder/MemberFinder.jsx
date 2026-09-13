import { useState, useMemo } from "react";
import { FinderWindow } from "./FinderWindow";
import { useSheetMembers } from "./useSheetMembers";
import { buildFinderData } from "./buildFinderData";

export function MemberFinder() {
  const { members, loading, error } = useSheetMembers();

  // Build the folder structure fresh whenever member data changes,
  // instead of the old static DIRECTORY_DATA / SIDEBAR_SECTIONS import.
  const { directoryData, sidebarSections, defaultPath } = useMemo(
    () => buildFinderData(members),
    [members]
  );

  const [history, setHistory] = useState([defaultPath]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [previewMember, setPreviewMember] = useState(null);

  const currentPath = history[historyIdx] || defaultPath;
  const currentPathKey = currentPath.join("/");

  // Fetch current items based on directory path or fallback
  const rawItems = useMemo(() => {
    return directoryData[currentPathKey] || directoryData["CSEA"] || [];
  }, [directoryData, currentPathKey]);

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
    <section className="relative w-full py-24 px-[10%] flex flex-col justify-center overflow-hidden bg-transparent">
      {/* Section Header — Aligned to left-[10%] matching other sections */}
      <div className="relative z-10 w-full mb-12">
        <div className="w-full max-w-[380px] lg:max-w-[460px]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
            04 / Members
          </p>
          <h2 className="mt-4 text-5xl font-medium leading-[0.95] tracking-[-0.055em] lg:text-6xl text-neutral-900">
            CSEA Members &amp; Teams
          </h2>
          <p className="mt-6 text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl">
            Explore CSEA faculty, office bearers, technical leads, and core teams.
          </p>
        </div>
      </div>

      {/* macOS Finder Component */}
      <div className="relative z-10 w-full flex justify-center">
        {loading && (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
            Loading members…
          </div>
        )}

        {!loading && error && (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-red-500">Couldn't load members.</p>
            <p className="max-w-sm text-xs text-neutral-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
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
            sidebarSections={sidebarSections}
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
        )}
      </div>
    </section>
  );
}

export default MemberFinder;
