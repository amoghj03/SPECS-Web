import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Project Pages sites are served below /<repository-name>/ rather than the
  // domain root. Keep local development and other static hosts at the root.
  base: process.env.GITHUB_PAGES === "true" ? "/SPECS-Web/" : "/",
  plugins: [react()],
});
