import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  server: {
    port: 3005,
    host: true,
    open: true,
    hmr: {
      port: 3005,
    },
    watch: {
      usePolling: false,
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
