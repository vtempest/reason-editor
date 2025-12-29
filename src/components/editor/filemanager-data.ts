/**
 * Demo data for the file manager component
 */

export interface FileItem {
  id: string;
  size: number;
  date: Date;
  type: "file" | "folder";
}

export function getData(): FileItem[] {
  return [
    {
      id: "/Documents",
      size: 4096,
      date: new Date(2024, 0, 15, 10, 30),
      type: "folder",
    },
    {
      id: "/Documents/Projects",
      size: 4096,
      date: new Date(2024, 1, 10, 14, 20),
      type: "folder",
    },
    {
      id: "/Documents/Projects/README.md",
      size: 2048,
      date: new Date(2024, 1, 10, 14, 25),
      type: "file",
    },
    {
      id: "/Documents/Projects/index.ts",
      size: 3500,
      date: new Date(2024, 1, 12, 9, 15),
      type: "file",
    },
    {
      id: "/Documents/Notes",
      size: 4096,
      date: new Date(2024, 0, 20, 16, 45),
      type: "folder",
    },
    {
      id: "/Documents/Notes/meeting-notes.txt",
      size: 1500,
      date: new Date(2024, 1, 5, 11, 30),
      type: "file",
    },
    {
      id: "/Music",
      size: 4096,
      date: new Date(2023, 11, 1, 14, 45),
      type: "folder",
    },
    {
      id: "/Music/playlist.m3u",
      size: 512,
      date: new Date(2023, 11, 5, 18, 20),
      type: "file",
    },
    {
      id: "/Pictures",
      size: 4096,
      date: new Date(2024, 1, 1, 12, 0),
      type: "folder",
    },
    {
      id: "/Pictures/vacation.jpg",
      size: 2048000,
      date: new Date(2024, 1, 2, 15, 30),
      type: "file",
    },
    {
      id: "/Pictures/screenshot.png",
      size: 1024000,
      date: new Date(2024, 1, 8, 10, 45),
      type: "file",
    },
    {
      id: "/Code",
      size: 4096,
      date: new Date(2024, 0, 10, 9, 0),
      type: "folder",
    },
    {
      id: "/Code/main.js",
      size: 4500,
      date: new Date(2024, 1, 15, 13, 20),
      type: "file",
    },
    {
      id: "/Code/styles.css",
      size: 2200,
      date: new Date(2024, 1, 14, 16, 10),
      type: "file",
    },
    {
      id: "/Downloads",
      size: 4096,
      date: new Date(2024, 1, 18, 8, 30),
      type: "folder",
    },
    {
      id: "/Info.txt",
      size: 1000,
      date: new Date(2023, 10, 30, 6, 13),
      type: "file",
    },
    {
      id: "/README.md",
      size: 3200,
      date: new Date(2024, 1, 1, 10, 0),
      type: "file",
    },
  ];
}

export function getDrive(): string {
  return "Local Storage";
}
