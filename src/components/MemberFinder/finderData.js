/**
 * CSEA Member Finder - Configuration & Directory Data
 * 
 * Easily customize:
 * 1. SIDEBAR_SECTIONS: Left-side tabs, section headers, icons, and target paths.
 * 2. DIRECTORY_DATA: Folders, member profiles, images, videos, scripts, file sizes, tags, and social links.
 * 3. DEFAULT_PATH: Initial open directory path.
 */

export const DEFAULT_PATH = ["CSEA", "Technical Team"];
export const HOME_BREADCRUMB_USER = "/CSEA/Directory";

/** Left Sidebar Custom Tabs & Navigation Sections */
export const SIDEBAR_SECTIONS = [
  {
    id: "overview",
    title: null,
    items: [
      { id: "overview-item", label: "Overview", iconName: "Compass", path: ["CSEA"] },
      { id: "recents", label: "Recents", iconName: "Clock", path: ["CSEA", "Technical Team"] },
      { id: "favorites", label: "Favorites", iconName: "Star", path: ["CSEA", "Faculty Advisor"] },
    ],
  },
  {
    id: "main-teams",
    title: "Main Directory",
    items: [
      { id: "technical-team", label: "Technical Team", iconName: "Folder", path: ["CSEA", "Technical Team"] },
      { id: "faculty-staff", label: "Faculty Advisor", iconName: "Folder", path: ["CSEA", "Faculty Advisor"] },
      { id: "office-bearers", label: "Office Bearers", iconName: "Folder", path: ["CSEA", "Office Bearers"] },
    ],
  },
  {
    id: "sub-teams",
    title: "Specialized Teams",
    items: [
      { id: "design-creative", label: "Design", iconName: "Folder", path: ["CSEA", "Design"] },
      { id: "web-dev", label: "Web Dev Team", iconName: "Folder", path: ["CSEA", "Web Dev Team"] },
      { id: "events-pr", label: "ERM", iconName: "Folder", path: ["CSEA", "ERM"] },
    ],
  },
  {
    id: "tags",
    title: "Tags",
    items: [
      { id: "tag-lead", label: "Team Leads", dotColor: "#3B82F6", path: ["CSEA", "Technical Team"] },
      { id: "tag-core", label: "Core Members", dotColor: "#10B981", path: ["CSEA", "Web Dev Team"] },
      { id: "tag-faculty", label: "Faculty Advisors", dotColor: "#F59E0B", path: ["CSEA", "Faculty Advisor"] },
    ],
  },
];

/** Directory Folders & Member Records */
export const DIRECTORY_DATA = {
  "CSEA": [
    { id: "folder-tech", name: "Technical Team", type: "folder", iconTag: "Code" },
    { id: "folder-fac", name: "Faculty Advisor", type: "folder", iconTag: "Edu" },
    { id: "folder-ob", name: "Office Bearers", type: "folder", iconTag: "Lead" },
    { id: "folder-des", name: "Design", type: "folder", iconTag: "UI" },
    { id: "folder-web", name: "Web Dev Team", type: "folder", iconTag: "Web" },
    { id: "folder-events", name: "ERM", type: "folder", iconTag: "PR" },

  ],
  "CSEA/Technical Team": [
    {
      id: "mem-1",
      name: "Dr. A. Ramesh",
      role: "Faculty Advisor",
      type: "member",
      badge: "Faculty",
      department: "Computer Science",
      batch: "Staff / Advisor",
      year: "Staff / Advisor",
      roll: "FACULTY // CSE",
      bio: "Head Advisor guiding CSEA research projects, competitive coding clubs, and technical innovation workshops.",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "advisor@csea.edu"
    },
    {
      id: "mem-2",
      name: "Siddharth V.",
      role: "Technical Lead",
      type: "member",
      badge: "Lead",
      department: "Computer Science",
      batch: "3rd Year (2023 - 2027)",
      year: "3rd Year (2023 - 2027)",
      roll: "23L101",
      bio: "Full stack developer specializing in distributed systems, Rust, and open-source infrastructure.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "siddharth@csea.org"
    },
    {
      id: "mem-3",
      name: "Ananya Sharma",
      role: "AI / ML Core",
      type: "member",
      badge: "Core",
      department: "AI & Data Science",
      batch: "2nd Year (2024 - 2028)",
      year: "2nd Year (2024 - 2028)",
      roll: "24L105",
      bio: "Machine learning enthusiast focusing on computer vision and neural network optimization.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "ananya@csea.org"
    },
    {
      id: "mem-4",
      name: "Karthik R.",
      role: "DevOps Engineer",
      type: "member",
      badge: "Core",
      department: "Computer Science",
      batch: "3rd Year (2023 - 2027)",
      year: "3rd Year (2023 - 2027)",
      roll: "23L120",
      bio: "Cloud architecture enthusiast managing Kubernetes clusters and CI/CD pipelines for CSEA portals.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "karthik@csea.org"
    },
    { id: "tech-sh", name: "csea_cluster_setup.sh", type: "script", size: "12 KB" },
    { id: "tech-plot", name: "benchmark_plot.png", type: "image", size: "142 KB", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80" },
    { id: "tech-mp4", name: "hackathon_2026.mp4", type: "video", size: "45.2 MB", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80" }
  ],
  "CSEA/Faculty Advisor": [
    {
      id: "fac-1",
      name: "Dr. K. Swaminathan",
      role: "Professor & HOD",
      type: "member",
      badge: "HOD",
      department: "Computer Science",
      batch: "Professor & HOD",
      year: "Professor & HOD",
      roll: "FACULTY // HOD",
      bio: "Head of Computer Science & Engineering Department with 20+ years of academic research in algorithms.",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      email: "hod@csea.edu"
    },
    {
      id: "fac-2",
      name: "Dr. Meenakshi S.",
      role: "Associate Professor",
      type: "member",
      badge: "Faculty",
      department: "Computer Science",
      batch: "Associate Professor",
      year: "Associate Professor",
      roll: "FACULTY // CSE",
      bio: "Research focus in Artificial Intelligence, NLP, and Cyber-Physical Systems.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      email: "meenakshi@csea.edu"
    }
  ],
  "CSEA/Office Bearers": [
    {
      id: "ob-1",
      name: "Rahul Verma",
      role: "President",
      type: "member",
      badge: "President",
      department: "Computer Science",
      batch: "Final Year (2022 - 2026)",
      year: "Final Year (2022 - 2026)",
      roll: "22L201",
      bio: "Leading CSEA initiatives, organizing national symposiums, and bridging student-industry partnerships.",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      linkedin: "https://linkedin.com",
      email: "president@csea.org"
    },
    {
      id: "ob-2",
      name: "Pooja Nair",
      role: "Vice President",
      type: "member",
      badge: "VP",
      department: "Computer Science",
      batch: "Final Year (2022 - 2026)",
      year: "Final Year (2022 - 2026)",
      roll: "22L202",
      bio: "Coordinating student chapters, hackathons, and technical speaker sessions.",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      linkedin: "https://linkedin.com",
      email: "vp@csea.org"
    }
  ],
  "CSEA/Design": [
    {
      id: "des-1",
      name: "Varun K.",
      role: "Design Lead",
      type: "member",
      badge: "Lead",
      department: "Computer Science",
      batch: "2nd Year (2024 - 2028)",
      year: "2nd Year (2024 - 2028)",
      roll: "24L210",
      bio: "UI/UX designer and motion graphic artist passionate about clean macOS interfaces.",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
      github: "https://github.com",
      email: "varun@csea.org"
    }
  ],
  "CSEA/Web Dev Team": [
    {
      id: "web-1",
      name: "Nikhil Raj",
      role: "Frontend Architect",
      type: "member",
      badge: "Core",
      department: "Computer Science",
      batch: "2nd Year (2024 - 2028)",
      year: "2nd Year (2024 - 2028)",
      roll: "24L142",
      bio: "Crafting reactive web interfaces using React, GSAP, and Tailwind CSS.",
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
      github: "https://github.com",
      email: "nikhil@csea.org"
    }
  ],
  "CSEA/ERM": [
    {
      id: "ev-1",
      name: "Riya Sen",
      role: "PR & Event Manager",
      type: "member",
      badge: "Lead",
      department: "Computer Science",
      batch: "2nd Year (2024 - 2028)",
      year: "2nd Year (2024 - 2028)",
      roll: "24L188",
      bio: "Managing CSEA brand presence, outreach, and annual flagship tech fest logistics.",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      email: "events@csea.org"
    }
  ]
};
