import React from "react";
import { FinderToolbar } from "./FinderToolbar";
import { FinderSidebar } from "./FinderSidebar";
import { FinderGrid } from "./FinderGrid";
import { FinderBreadcrumbs } from "./FinderBreadcrumbs";
import { FinderPreview } from "./FinderPreview";
import "./MemberFinder.css";

export function FinderWindow({
  currentPath = ["CSEA"],
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  viewMode = "grid",
  onChangeViewMode,
  searchQuery = "",
  onSearchChange,
  sidebarSections,
  activeTeamId = "technical-team",
  onSelectTeam,
  items = [],
  selectedId = null,
  onSelectItem,
  onOpenItem,
  previewMember = null,
  onClosePreview,
  onNavigatePath
}) {
  const selectedItemObj = items.find((i) => i.id === selectedId);

  return (
    <div className="relative w-full max-w-[1360px] mx-auto h-[700px] rounded-[18px] overflow-hidden border border-black/15 finder-content-bg finder-window-shadow flex flex-col font-sans select-none text-neutral-900">
      {/* Top Window Titlebar / Chrome Header */}
      <div className="h-11 finder-toolbar-bg border-b border-black/10 px-4 flex items-center justify-between shrink-0">
        {/* macOS Traffic Lights (🔴 🟡 🟢) */}
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 hover:opacity-80 transition-opacity cursor-pointer" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 hover:opacity-80 transition-opacity cursor-pointer" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 hover:opacity-80 transition-opacity cursor-pointer" />
        </div>

        {/* Window Center Title */}
        <div className="text-sm font-semibold text-neutral-700 tracking-wide">
          CSEA Team Explorer — Finder
        </div>

        {/* Dummy spacer for alignment */}
        <div className="w-16" />
      </div>

      {/* Toolbar Controls */}
      <FinderToolbar
        currentPath={currentPath}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={onGoBack}
        onGoForward={onGoForward}
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* Main Workspace (Sidebar + Grid Content) */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
        {/* Left macOS Navigation Sidebar */}
        <FinderSidebar
          sidebarSections={sidebarSections}
          activeTeamId={activeTeamId}
          onSelectTeam={onSelectTeam}
        />

        {/* Right Content Workspace */}
        <FinderGrid
          items={items}
          selectedId={selectedId}
          viewMode={viewMode}
          onSelect={onSelectItem}
          onOpen={onOpenItem}
        />
      </div>

      {/* Bottom Breadcrumbs & Status Bar */}
      <FinderBreadcrumbs
        path={currentPath}
        itemCount={items.length}
        selectedItem={selectedItemObj}
        onNavigatePath={onNavigatePath}
      />

      {/* Member Detail Preview Drawer Modal */}
      {previewMember && (
        <FinderPreview member={previewMember} onClose={onClosePreview} />
      )}
    </div>
  );
}
