# Architecture

Create:

components/
└── MemberFinder/
    ├── MemberFinder.jsx
    ├── MemberFinder.css
    ├── FinderWindow.jsx
    ├── FinderSidebar.jsx
    ├── FinderToolbar.jsx
    ├── FinderBreadcrumbs.jsx
    ├── FinderGrid.jsx
    ├── FinderItem.jsx
    └── FinderPreview.jsx

## Responsibilities

MemberFinder
- navigation state
- selected team
- selected member

FinderWindow
- visual window shell

FinderSidebar
- team navigation

FinderToolbar
- back/forward
- view controls
- search UI

FinderGrid
- folders and members

FinderItem
- individual folder/member

FinderPreview
- optional member preview