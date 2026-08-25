# Implementation Plan - CSEA Member Finder Component

## Overview
Implement the decorative macOS Finder-inspired CSEA Member Finder component inside `src/components/MemberFinder/` following the specifications in `.design/ARCHITECTURE.md`, `.design/COMPONENT.md`, `.design/DESIGN.md`, and the visual reference images in `references/` (`first.jpg` and `seconf.jpg`).

---

## 1. Directory Structure to Create
`src/components/MemberFinder/`
├── `MemberFinder.jsx`       # Container & state management (path, history, search, view mode, selection)
├── `MemberFinder.css`       # Styles, scrollbars, animations, and custom theme tokens
├── `FinderWindow.jsx`       # macOS window shell, frame, border, traffic lights, and overall layout
├── `FinderSidebar.jsx`      # Left navigation sidebar (grouped teams, categories, active highlight, bottom footer)
├── `FinderToolbar.jsx`      # Header toolbar with back/forward nav, path title, view mode toggle, search input
├── `FinderBreadcrumbs.jsx`  # Bottom status bar with path breadcrumb trail and item counter
├── `FinderGrid.jsx`         # Main workspace grid/list container handling folder & member items
├── `FinderItem.jsx`         # Individual folder item or member card (thumbnail, badge, label, hover/focus state)
└── `FinderPreview.jsx`      # Detail panel/modal for previewing selected member (photo, bio, socials, role)

---

## 2. Component Breakdown & Functionality

### 2.1 State Management (`MemberFinder.jsx`)
- **Navigation State**: `currentPath` array (`["CSEA", "Technical Team"]`).
- **History Stack**: `history` array and `historyIndex` for Back (`<`) and Forward (`>`) toolbar navigation.
- **Selection State**: `selectedId` for clicked items.
- **View Mode**: `"grid"` | `"list"` mode toggle.
- **Search Query**: Filters items live in current directory or across all teams.
- **Preview Member**: `selectedMember` for sidebar/double-click detail preview.

### 2.2 Data Schema (Mock Data)
- **Teams & Subfolders**:
  - `Faculty Advisor`
  - `Office Bearers`
  - `Technical Team`
  - `Design & Creative`
  - `Web Dev Team`
  - `Events & PR`
  - `Alumni & Advisors`
- **Member Cards & Assets**:
  - Member photos, name, role/designation, bio, social links (GitHub, LinkedIn, Email), badges (Lead, Core, Faculty).
  - Custom file previews matching visual reference: `.mp4` video highlight with badge, `.png` graph image card, `.sh` script icon badge, `.log` files.

### 2.3 Visual Fidelity (`DESIGN.md` & Reference Images)
- **Window Shell**: Rounded macOS dark window frame (`rounded-[16px]`), subtle border (`border-white/10`), deep drop shadow (`shadow-2xl shadow-black/80`).
- **Traffic Light Dots**: Red (`#FF5F56`), Yellow (`#FFBD2E`), Green (`#27C93F`).
- **Sidebar**: Dark translucent sidebar with section headers (`Overview`, `Teams`, `Batches`, `Tags`), active blue highlight pill (`#0066FF`), Lucide icons, and bottom gear/info footer.
- **Toolbar**: Title dropdown (`spaceDriveIndexDB ∨` / `CSEA Finder ∨`), back/forward arrows, grid/list view toggle (`88`), live search input.
- **Grid Layout**: Responsive multi-column grid, blue macOS 3D folder icons, member avatar thumbnails with labels underneath, selection outline, 150-250ms smooth transitions.
- **Bottom Status Bar**: `■ CSEA > ■ Technical Team > ■ Member`, item count display.

---

## 3. Integration Plan
- Integrate `MemberFinder` into `src/App.jsx` within the main content flow.
- Ensure full responsiveness and accessibility without modifying unrelated components or existing landing sections.

---

## 4. Verification Plan
1. **Visual Accuracy**: Compare rendered Finder window against `references/first.jpg` and `references/seconf.jpg` (spacing, proportions, window chrome, sidebar, active states, folder/file grid).
2. **Interactivity Testing**:
   - Single-click selection highlight.
   - Double-click to enter folder or view member modal.
   - Back (`<`) and Forward (`>`) buttons working with path history.
   - Sidebar item click direct navigation.
   - Grid vs. List view toggle layout switch.
   - Search bar filtering items live.
