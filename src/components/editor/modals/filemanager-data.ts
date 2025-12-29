export interface FileItem {
  id: string;
  type: "folder" | "file";
  date?: string;
  size?: number;
}

export function getData(): FileItem[] {
  return [
    // Root level folders
    { id: "/documents", type: "folder" },
    { id: "/images", type: "folder" },
    { id: "/projects", type: "folder" },

    // Documents folder contents
    { id: "/documents/notes.txt", type: "file", size: 1024, date: "2025-12-20" },
    { id: "/documents/research.md", type: "file", size: 2048, date: "2025-12-22" },
    { id: "/documents/report.pdf", type: "file", size: 5120, date: "2025-12-25" },

    // Images folder contents
    { id: "/images/screenshot.png", type: "file", size: 4096, date: "2025-12-21" },
    { id: "/images/diagram.svg", type: "file", size: 1536, date: "2025-12-23" },

    // Projects folder and subfolders
    { id: "/projects/web-app", type: "folder" },
    { id: "/projects/web-app/index.html", type: "file", size: 2048, date: "2025-12-24" },
    { id: "/projects/web-app/styles.css", type: "file", size: 1024, date: "2025-12-24" },
    { id: "/projects/web-app/script.js", type: "file", size: 3072, date: "2025-12-26" },

    // More root files
    { id: "/readme.md", type: "file", size: 512, date: "2025-12-15" },
    { id: "/config.json", type: "file", size: 256, date: "2025-12-18" },
  ];
}
