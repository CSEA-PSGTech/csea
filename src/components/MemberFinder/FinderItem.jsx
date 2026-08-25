import React from "react";
import { Folder, Terminal, FileText, User } from "lucide-react";

export function FinderItem({
  item,
  isSelected,
  viewMode = "grid",
  onSelect,
  onOpen
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(item);
    if (item.type === "member" || item.type === "folder") {
      onOpen(item);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onOpen(item);
  };

  // Render SVG / Thumbnail based on item type (Bigger icons without on-icon label text)
  const renderIcon = () => {
    if (item.type === "folder") {
      return (
        <div className="relative flex items-center justify-center w-24 h-20 macos-folder-icon">
          {/* macOS 3D Blue Folder SVG */}
          <svg viewBox="0 0 72 60" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id={`folderGrad-${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id={`folderBackGrad-${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
            </defs>
            {/* Folder Back */}
            <path
              d="M 6 10 C 6 6, 9 4, 13 4 L 26 4 C 29 4, 31 7, 34 10 L 37 13 L 64 13 C 68 13, 70 16, 70 20 L 70 50 C 70 54, 68 56, 64 56 L 8 56 C 4 56, 2 54, 2 50 L 2 14 C 2 10, 4 10, 6 10 Z"
              fill={`url(#folderBackGrad-${item.id})`}
            />
            {/* Inner tab sheet */}
            <rect x="8" y="12" width="56" height="38" rx="3" fill="#ffffff" opacity="0.3" />
            {/* Folder Front */}
            <path
              d="M 2 20 C 2 16, 5 15, 9 15 L 63 15 C 67 15, 70 16, 70 20 L 68 51 C 68 55, 65 57, 61 57 L 11 57 C 7 57, 4 55, 4 51 Z"
              fill={`url(#folderGrad-${item.id})`}
            />
          </svg>
        </div>
      );
    }

    if (item.type === "video") {
      return (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 border border-black/10 shadow-md group hover:scale-105 transition-transform">
          <img
            src={item.thumbnail || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded text-white font-bold tracking-tighter">
            MP4
          </span>
        </div>
      );
    }

    if (item.type === "image") {
      return (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white border border-black/10 p-1 flex items-center justify-center shadow-md hover:scale-105 transition-transform">
          <img
            src={item.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80"}
            alt={item.name}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      );
    }

    if (item.type === "script") {
      return (
        <div className="relative w-20 h-24 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-col items-center justify-center p-2 shadow-md hover:scale-105 transition-transform">
          <Terminal className="w-10 h-10 text-emerald-600" />
          <span className="text-xs font-mono text-emerald-700 font-bold mt-1">&gt;_</span>
        </div>
      );
    }

    if (item.type === "member") {
      return (
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-3 border-blue-500/70 shadow-lg group-hover:scale-105 transition-transform">
          <img
            src={item.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="w-20 h-24 rounded-xl bg-neutral-100 border border-black/10 flex items-center justify-center shadow-md">
        <FileText className="w-10 h-10 text-neutral-500" />
      </div>
    );
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer text-sm select-none transition-colors ${
          isSelected
            ? "bg-blue-50 text-blue-900 font-semibold border border-blue-200"
            : "text-neutral-800 hover:bg-black/5"
        }`}
      >
        <div className="w-7 h-7 flex items-center justify-center shrink-0">
          {item.type === "folder" ? (
            <Folder className="w-5 h-5 text-blue-500 fill-blue-500/20" />
          ) : item.type === "member" ? (
            <User className="w-5 h-5 text-cyan-600" />
          ) : item.type === "script" ? (
            <Terminal className="w-5 h-5 text-emerald-600" />
          ) : (
            <FileText className="w-5 h-5 text-neutral-500" />
          )}
        </div>
        <span className="flex-1 truncate font-semibold text-sm">{item.name}</span>
        <span className="w-32 text-xs text-neutral-500 truncate font-medium">{item.role || item.type}</span>
        <span className="w-24 text-xs text-neutral-400 text-right font-mono">{item.size || item.badge || "--"}</span>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group flex flex-col items-center justify-start p-3 rounded-xl cursor-pointer select-none transition-all duration-150 ${
        isSelected
          ? "bg-blue-500/15 ring-2 ring-blue-500/60 shadow-md"
          : "hover:bg-black/5"
      }`}
    >
      <div className="flex items-center justify-center h-24 w-24 mb-2.5">
        {renderIcon()}
      </div>
      <span className="text-xs sm:text-sm text-center text-neutral-800 font-semibold leading-snug max-w-[120px] truncate group-hover:text-black">
        {item.name}
      </span>
      {item.size && (
        <span className="text-[10px] text-neutral-400 mt-1 font-mono">
          {item.size}
        </span>
      )}
      {item.role && (
        <span className="text-[11px] text-blue-600 mt-0.5 max-w-[120px] truncate text-center font-semibold">
          {item.role}
        </span>
      )}
    </div>
  );
}
