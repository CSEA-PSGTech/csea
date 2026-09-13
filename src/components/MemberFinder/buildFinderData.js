

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


function badgeFromPosition(position) {
  if (!position) return "Member";
  const p = position.toLowerCase();
  if (p.includes("secretary")) return "Secretary";
  if (p.includes("director")) return "Director";
  if (p.includes("associate head") || p.includes("associate")) return "Associate";
  if (p.includes("head")) return "Head";
  if (p.includes("executive")) return "Executive";
  if (p.includes("manager")) return "Manager";
  return position;
}

export function buildFinderData(members) {
  
  const verticalOrder = [];
  const seen = new Set();
  for (const m of members) {
    const v = m.vertical || "Other";
    if (!seen.has(v)) {
      seen.add(v);
      verticalOrder.push(v);
    }
  }

  const directoryData = {
    CSEA: verticalOrder.map((vertical) => ({
      id: `folder-${slugify(vertical)}`,
      name: vertical,
      type: "folder",
      iconTag: vertical.slice(0, 3).toUpperCase(),
    })),
  };

  for (const vertical of verticalOrder) {
    const pathKey = `CSEA/${vertical}`;
    directoryData[pathKey] = members
      .filter((m) => (m.vertical || "Other") === vertical)
      .map((m) => ({
        id: `mem-${m.id}`,
        rawId: m.id,
        name: m.name,
        role: m.position,
        position: m.position,
        type: "member",
        department: vertical,
        batch: m.yearAndClass || m.year || m.batch || "",
        year: m.yearAndClass || m.year || m.batch || "",
        yearAndClass: m.yearAndClass || m.year || m.batch || "",
        roll: m.roll || m.rollNo || m.rollNumber || (m.id && !m.id.toString().startsWith("mem-") ? m.id : "") || "",
        bio: m.bio || "", 
        photo: m.photo || m.url || m.image || "",
        github: m.github,
        linkedin: m.linkedin,
        email: m.email,
        socials: {
          github: m.github,
          linkedin: m.linkedin,
          email: m.email,
        },
      }));
  }

  const sidebarSections = [
    {
      id: "overview",
      title: null,
      items: [{ id: "overview-item", label: "Overview", iconName: "Compass", path: ["CSEA"] }],
    },
    {
      id: "main-teams",
      title: "Directory",
      items: verticalOrder.map((vertical) => ({
        id: `team-${slugify(vertical)}`,
        label: vertical,
        iconName: "Folder",
        path: ["CSEA", vertical],
      })),
    },
  ];

  return { directoryData, sidebarSections, defaultPath: ["CSEA"] };
}
