import React from "react";
import { Folder, ChevronRight, HardDrive } from "lucide-react";

export function FinderBreadcrumbs({
  path = ["CSEA"],
  itemCount = 0,
  selectedItem = null,
  onNavigatePath
}) {
  return (
    <div className="h-8 border-t border-black/10 bg-[#F2F2F7] px-4 flex items-center justify-between text-xs text-neutral-600 font-mono select-none">
      {/* Path Breadcrumbs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {path.map((segment, index) => {
          const isLast = index === path.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
              <button
                onClick={() => onNavigatePath(index)}
                className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-black/5 transition-colors ${
                  isLast ? "text-neutral-900 font-bold" : "text-neutral-600 font-medium"
                }`}
              >
                {index === 0 ? (
                  <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                )}
                <span>{segment}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Item Counter & Selection Info */}
      <div className="text-xs text-neutral-500 font-sans shrink-0 ml-3 font-medium">
        {selectedItem ? (
          <span>Selected: <strong className="text-neutral-900 font-bold">{selectedItem.name}</strong></span>
        ) : (
          <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
        )}
      </div>
    </div>
  );
}
