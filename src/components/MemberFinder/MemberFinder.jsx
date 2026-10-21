import { useState, useMemo, useEffect, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, FolderOpen } from "lucide-react";
import { FinderWindow } from "./FinderWindow";
import { MobileMemberFinder } from "./MobileMemberFinder";
import { MemberSpotlight } from "./MemberSpotlight";
import { useSheetMembers } from "./useSheetMembers";
import { buildFinderData } from "./buildFinderData";

// ---- Excluded verticals ----
// Heads are shown in the Visionaries section instead, so they're left out here.
// Matched case-insensitively against the "Vertical" column.
const EXCLUDED_VERTICALS = new Set(["head", "heads"]);

function isExcluded(member) {
  return EXCLUDED_VERTICALS.has((member?.vertical || "").trim().toLowerCase());
}

// ---- Pinned teams ----
// Verticals listed here always appear first, in this order.
// Names are matched case-insensitively against the "Vertical" column.
const PINNED_TEAMS = [
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

function slugify(str = "") {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const VIEWS = [
  { id: "spotlight", label: "Spotlight", Icon: Users },
  { id: "directory", label: "Directory", Icon: FolderOpen },
];

export function MemberFinder() {
  const { members, loading, error } = useSheetMembers();

  // Drop the Head vertical before building folders, so it never appears
  // in the spotlight, sidebar, CSEA root folder, search, or the mobile explorer.
  const visibleMembers = useMemo(
    () => (Array.isArray(members) ? members.filter((m) => !isExcluded(m)) : members),
    [members]
  );

  // Build the folder structure fresh whenever member data changes,
  // then move pinned teams to the top.
  const { directoryData, sidebarSections, defaultPath } = useMemo(() => {
    const built = buildFinderData(visibleMembers);

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
  }, [visibleMembers]);

  // Verticals in the same order as the directory, each with its members.
  const verticals = useMemo(
    () =>
      (directoryData["CSEA"] || [])
        .filter((item) => item.type === "folder")
        .map((folder) => ({
          name: folder.name,
          members: (directoryData[`CSEA/${folder.name}`] || []).filter((i) => i.type === "member"),
        }))
        .filter((v) => v.members.length > 0),
    [directoryData]
  );

  // ---- View: spotlight (portraits) or directory (Finder) ----
  const [view, setView] = useState("spotlight");
  const [spotlightIdx, setSpotlightIdx] = useState(0);

  // ---- Directory (Finder) state ----
  const [history, setHistory] = useState([defaultPath]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [previewMember, setPreviewMember] = useState(null);

  const currentPath = history[historyIdx] || defaultPath;
  const currentPathKey = currentPath.join("/");

  // Keep the spotlight index valid if the sheet data changes.
  useEffect(() => {
    if (spotlightIdx >= verticals.length && verticals.length > 0) setSpotlightIdx(0);
  }, [verticals.length, spotlightIdx]);

  // Section height changes between views / verticals — let ScrollSmoother re-measure.
  const refreshScroll = useCallback(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    if (!loading) refreshScroll();
  }, [view, loading, refreshScroll]);

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

  // Switching views carries the current team across:
  // spotlight → directory opens that team's folder, directory → spotlight shows the open folder.
  const switchView = (next) => {
    if (next === view) return;

    if (next === "directory") {
      const team = verticals[spotlightIdx]?.name;
      if (team && currentPath[1] !== team) {
        pushPath(["CSEA", team]);
        setActiveTeamId(`team-${slugify(team)}`);
      }
    } else {
      const openTeam = currentPath[1];
      const idx = verticals.findIndex((v) => v.name === openTeam);
      if (idx !== -1) setSpotlightIdx(idx);
    }

    setPreviewMember(null);
    setView(next);
  };

  return (
    <section className="relative w-full pt-8 sm:pt-20 pb-6 sm:pb-24 px-4 sm:px-8 md:px-[10%] flex flex-col justify-center overflow-hidden bg-transparent">
      {/* Section Header — Aligned to left matching other sections */}
      <div className="relative z-10 w-full mb-8 sm:mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="w-full max-w-[380px] lg:max-w-[460px]">
          <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
            05 / Members
          </p>
          <h2 className="mt-2 sm:mt-4 text-2xl sm:text-5xl font-medium leading-[1.08] sm:leading-[0.95] tracking-[-0.03em] sm:tracking-[-0.055em] lg:text-6xl text-neutral-900">
            CSEA Members &amp; Teams
          </h2>
          <p className="mt-2 sm:mt-6 text-xs sm:text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl">
            Guided by our visionaries, driven by our students — meet the teams that power every CSEA initiative.
          </p>
        </div>

        {/* View toggle */}
        {!loading && !error && (
          <div
            role="tablist"
            aria-label="Members view"
            className="inline-flex self-start md:self-auto rounded-full border border-black/10 bg-white p-1 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.25)]"
          >
            {VIEWS.map(({ id, label, Icon }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchView(id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition
                    focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5258FF]/30
                    ${active ? "bg-[#5258FF] text-white" : "text-neutral-600 hover:text-neutral-900"}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Container */}
      {/*
        min-h keeps the section from collapsing while data loads, so anything
        BELOW Members (BlogCTA, footer) doesn't get pushed down mid-scroll.
      */}
      <div className="relative z-10 w-full flex justify-center min-h-[520px] sm:min-h-[600px]">
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

        {!loading && !error && view === "spotlight" && (
          <MemberSpotlight
            verticals={verticals}
            index={spotlightIdx}
            onIndexChange={setSpotlightIdx}
            onLayoutChange={refreshScroll}
          />
        )}

        {!loading && !error && view === "directory" && (
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
