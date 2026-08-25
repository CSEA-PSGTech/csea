import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  Cloud,
  Share2,
  Tag,
  FolderOpen
} from "lucide-react";
import { HOME_BREADCRUMB_USER } from "./finderData";

export function FinderToolbar({
  currentPath = ["CSEA"],
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  viewMode = "grid",
  onChangeViewMode,
  searchQuery = "",
  onSearchChange
}) {
  const currentFolderName = currentPath[currentPath.length - 1] || "CSEA";

  return (
    <div className="h-12 finder-toolbar-bg border-b border-black/10 px-4 flex items-center justify-between select-none gap-4">
      {/* Left Navigation & Title Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Title dropdown badge */}
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-800 border border-black/10 transition-colors shadow-xs">
          <FolderOpen className="w-4 h-4 text-blue-500" />
          <span className="truncate max-w-[150px]">CSEA Explorer</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
        </button>

        {/* Navigation arrows (< >) */}
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`p-1.5 rounded-md text-neutral-700 transition-colors ${
              canGoBack ? "hover:bg-black/5 text-neutral-900" : "opacity-30 cursor-not-allowed"
            }`}
            title="Back"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className={`p-1.5 rounded-md text-neutral-700 transition-colors ${
              canGoForward ? "hover:bg-black/5 text-neutral-900" : "opacity-30 cursor-not-allowed"
            }`}
            title="Forward"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Center Path Display */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-neutral-600 font-mono bg-white/90 px-3.5 py-1 rounded-md border border-black/10 truncate max-w-sm shadow-xs">
        <span className="text-neutral-400">{HOME_BREADCRUMB_USER}</span>
        {currentPath.length > 1 && (
          <span className="text-neutral-900 font-bold">/{currentFolderName}</span>
        )}
      </div>

      {/* Right Toolbar Actions & Search */}
      <div className="flex items-center gap-2.5">
        {/* View Mode Toggle (Grid / List) */}
        <div className="flex items-center bg-white/90 rounded-lg p-0.5 border border-black/10 shadow-xs">
          <button
            onClick={() => onChangeViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "grid" ? "bg-black/10 text-black font-semibold" : "text-neutral-500 hover:text-black"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "list" ? "bg-black/10 text-black font-semibold" : "text-neutral-500 hover:text-black"
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Sync & Share Icons */}
        <div className="hidden md:flex items-center gap-1.5 text-neutral-600">
          <button className="p-1.5 rounded-md hover:bg-black/5 hover:text-black transition-colors" title="Sync Status">
            <Cloud className="w-4 h-4 text-cyan-600" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-black/5 hover:text-black transition-colors" title="Tags">
            <Tag className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-black/5 hover:text-black transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search members..."
            className="w-32 sm:w-40 bg-white border border-black/15 rounded-lg pl-9 pr-2.5 py-1.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-blue-500 focus:w-48 transition-all shadow-xs font-medium"
          />
        </div>
      </div>
    </div>
  );
}
