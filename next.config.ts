import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Lock Turbopack to this app so a parent-folder package-lock does not steal the workspace root
// (fixes wrong .env / module resolution when "Macro Project Sem4" also has a lockfile).
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
