export const mockFs: Record<string, { name: string; type: "file" | "dir" }[]> = {
  "/": [
    { name: "src", type: "dir" },
    { name: "public", type: "dir" },
    { name: "package.json", type: "file" },
    { name: "README.md", type: "file" },
  ],
  src: [
    { name: "components", type: "dir" },
    { name: "lib", type: "dir" },
    { name: "App.tsx", type: "file" },
    { name: "index.tsx", type: "file" },
  ],
  public: [
    { name: "index.html", type: "file" },
    { name: "favicon.ico", type: "file" },
  ],
  components: [
    { name: "Button.tsx", type: "file" },
    { name: "Input.tsx", type: "file" },
    { name: "Modal.tsx", type: "file" },
  ],
  lib: [
    { name: "utils.ts", type: "file" },
    { name: "api.ts", type: "file" },
  ],
};
