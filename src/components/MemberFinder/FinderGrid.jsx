import React from "react";
import { FinderItem } from "./FinderItem";

export function FinderGrid({
  items = [],
  selectedId,
  viewMode = "grid",
  onSelect,
  onOpen
}) {
  return (
    <div
      onClick={() => onSelect(null)}
      className="flex-1 overflow-y-auto p-6 finder-custom-scrollbar min-h-0 select-none"
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-neutral-500 py-16">
          <p className="text-base font-medium">No items found in this directory</p>
          <span className="text-xs text-neutral-400 mt-1">Try another search or folder</span>
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4 px-4 py-1.5 text-xs font-bold tracking-wider text-neutral-400 uppercase border-b border-black/10 mb-2 pb-2">
            <span className="w-7"></span>
            <span className="flex-1">Name</span>
            <span className="w-32">Role / Type</span>
            <span className="w-24 text-right">Size / Tag</span>
          </div>
          {items.map((item) => (
            <FinderItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              viewMode="list"
              onSelect={onSelect}
              onOpen={onOpen}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 items-start">
          {items.map((item) => (
            <FinderItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              viewMode="grid"
              onSelect={onSelect}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
