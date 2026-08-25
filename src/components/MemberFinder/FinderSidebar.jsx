import React from "react";
import {
  Compass,
  Clock,
  Star,
  Globe,
  Folder,
  HardDrive,
  Laptop,
  PlusCircle,
  Monitor,
  FileText,
  Download,
  Plus,
  Settings,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { SIDEBAR_SECTIONS } from "./finderData";

const ICON_MAP = {
  Compass,
  Clock,
  Star,
  Globe,
  Folder,
  HardDrive,
  Laptop,
  PlusCircle,
  Monitor,
  FileText,
  Download,
  Plus
};

export function FinderSidebar({
  sidebarSections = SIDEBAR_SECTIONS,
  activeTeamId = "technical-team",
  onSelectTeam
}) {
  return (
    <aside className="w-56 finder-sidebar-bg border-r border-black/10 flex flex-col justify-between select-none shrink-0 py-4 px-2.5 font-sans text-xs">
      {/* Navigation Sections */}
      <div className="flex flex-col gap-4 overflow-y-auto finder-custom-scrollbar pr-1">
        {sidebarSections.map((group) => (
          <div key={group.id} className="flex flex-col gap-1">
            {group.title && (
              <span className="px-2.5 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                {group.title}
              </span>
            )}
            {group.items.map((item) => {
              const isActive = activeTeamId === item.id;
              const IconComponent = item.iconName ? ICON_MAP[item.iconName] || Folder : null;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTeam(item)}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                    isActive
                      ? "finder-active-item font-semibold shadow-sm text-sm"
                      : "text-neutral-700 hover:bg-black/5 text-xs sm:text-sm font-medium"
                  }`}
                >
                  {IconComponent ? (
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-900"
                      }`}
                    />
                  ) : item.dotColor ? (
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.dotColor }}
                    />
                  ) : null}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer Bar */}
      <div className="pt-3 border-t border-black/10 flex items-center justify-between text-neutral-500 text-xs px-2">
        <div className="flex items-center gap-2">
          <button className="hover:text-neutral-900 transition-colors p-1 rounded hover:bg-black/5" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button className="hover:text-neutral-900 transition-colors p-1 rounded hover:bg-black/5" title="Help">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <button className="flex items-center gap-1.5 hover:text-neutral-900 text-xs transition-colors px-2 py-1 rounded hover:bg-black/5 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
          <span>Feedback</span>
        </button>
      </div>
    </aside>
  );
}
