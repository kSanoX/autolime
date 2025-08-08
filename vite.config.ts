import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react";
import svgr from 'vite-plugin-svgr';
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") }
    ],
  },
  server: {
    host: true,
    allowedHosts: ['4a4c45c7c314.ngrok-free.app'] // или просто true
  },
});
