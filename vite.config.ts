import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ✅ Clean Vercel-friendly config (No server-side, no Replit plugins)
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"), // frontend-only alias
      "@shared": path.resolve(__dirname, "shared"),
    },
  },

  root: path.resolve(__dirname, "client"), // If your React app is inside /client
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
