# Member Finder

## Purpose

A visual navigation component for browsing CSEA teams and members.

It is a presentation component.

It does NOT:

- access the filesystem
- upload files
- download files
- rename files
- delete files
- manipulate real directories

## Data

The component receives member/team data through props.

Example:

teams = [
  {
    id: "faculty",
    name: "Faculty",
    type: "team",
    members: [...]
  },
  {
    id: "technical",
    name: "Technical Team",
    type: "team",
    members: [...]
  }
]

## Navigation

Root:
CSEA Members

Folder:
Team members

Member:
Photo + name + role

## Interactions

- Single click → select
- Double click → open
- Back button → previous location
- Sidebar team → navigate directly
- Grid/List toggle → presentation only