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
    port: 3001,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
