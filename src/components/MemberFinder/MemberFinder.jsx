import { useState, useMemo } from "react";
import { FinderWindow } from "./FinderWindow";
import { MobileMemberFinder } from "./MobileMemberFinder";
import { useSheetMembers } from "./useSheetMembers";
import { buildFinderData } from "./buildFinderData";

// ---- Pinned teams ----
// Verticals listed here always appear first, in this order.
// Names are matched case-insensitively against the "Vertical" column.
const PINNED_TEAMS = [
  (name) => name === "head" || name === "hod", // "Head" vertical (HoD)
  (name) => name.includes("faculty"), // "Faculty Advisor" / "Faculty Advisors"
];

function getItemName(item) {
  if (!item) return "";
  if (item.name) return item.name;
  if (item.label) return item.label;
  if (item.title) return item.title;
  if (Array.isArray(item.path) && item.path.length) return item.path[item.path.length - 1];
  return "";
}

function pinnedRank(item) {
  const name = getItemName(item).trim().toLowerCase();
  const idx = PINNED_TEAMS.findIndex((matches) => matches(name));
  return idx === -1 ? PINNED_TEAMS.length : idx;
}

// Stable sort: pinned teams first, everything else keeps its original order.
function sortPinnedFirst(list) {
  if (!Array.isArray(list)) return list;
  return list
    .map((item, i) => ({ item, i }))
    .sort((a, b) => pinnedRank(a.item) - pinnedRank(b.item) || a.i - b.i)
    .map(({ item }) => item);
}

export function MemberFinder() {
  const { members, loading, error } = useSheetMembers();

  // Build the folder structure fresh whenever member data changes,
  // then move Faculty Advisor and Verticals Head to the top.
  const { directoryData, sidebarSections, defaultPath } = useMemo(() => {
    const built = buildFinderData(members);

    const directoryData = { ...built.directoryData };
    if (Array.isArray(directoryData["CSEA"])) {
      directoryData["CSEA"] = sortPinnedFirst(directoryData["CSEA"]);
    }

    const sidebarSections = Array.isArray(built.sidebarSections)
      ? built.sidebarSections.map((section) =>
          Array.isArray(section?.items)
            ? { ...section, items: sortPinnedFirst(section.items) }
            : section
        )
      : built.sidebarSections;

    return { ...built, directoryData, sidebarSections };
  }, [members]);

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
    <section className="relative w-full pt-8 sm:pt-20 pb-2 sm:pb-24 px-4 sm:px-8 md:px-[10%] flex flex-col justify-center overflow-hidden bg-transparent">
      {/* Section Header — Aligned to left matching other sections */}
      <div className="relative z-10 w-full mb-6 sm:mb-12">
        <div className="w-full max-w-[380px] lg:max-w-[460px]">
          <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
            04 / Members
          </p>
          <h2 className="mt-2 sm:mt-4 text-2xl sm:text-5xl font-medium leading-[1.08] sm:leading-[0.95] tracking-[-0.03em] sm:tracking-[-0.055em] lg:text-6xl text-neutral-900">
            CSEA Members &amp; Teams
          </h2>
          <p className="mt-2 sm:mt-6 text-xs sm:text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl">
            Explore CSEA faculty, office bearers, technical leads, and core teams.
          </p>
        </div>
      </div>

      {/* Main Container */}
      {/*
        min-h here matches the loading spinner's h-64 up to roughly the
        real FinderWindow's height, so this section itself doesn't grow
        once its data arrives. Without it, anything BELOW Members (BlogCTA,
        footer) would get pushed down if someone scrolls there while this
        is still loading. Tune against the real FinderWindow height in
        devtools.
      */}
      <div className="relative z-10 w-full flex justify-center min-h-[560px] sm:min-h-[620px]">
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
          <>
            {/* Desktop macOS Finder Window */}
            <div className="hidden md:block w-full">
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
            </div>

            {/* Mobile Touch-Friendly CSEA Explorer */}
            <div className="block md:hidden w-full">
              <MobileMemberFinder
                directoryData={directoryData}
                onSelectMember={(item) => setPreviewMember(item)}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MemberFinder;