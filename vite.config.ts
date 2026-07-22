import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    compression({
      verbose: true,
      disable: false,
      deleteOriginFile: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
  ],
  esbuild: {
    jsx: "automatic",
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: "automatic",
    },
  },
  server: {
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
  },
});
