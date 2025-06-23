import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://8000-i0bsowmz4mwe472x5oz4c-adb0b3da.manusvm.computer",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    hmr: {
      host: "8080-i0bsowmz4mwe472x5oz4c-adb0b3da.manusvm.computer",
      protocol: "wss",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://8000-i0bsowmz4mwe472x5oz4c-adb0b3da.manusvm.computer",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
