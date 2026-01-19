// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // All requests starting with /api go to backend
      "/api": {
        target: "http://localhost:5000", // your backend URL
        changeOrigin: true,
        secure: false,
        // Optional: remove /api prefix if your backend routes don't have it
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
