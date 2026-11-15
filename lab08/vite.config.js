import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const webExtensions = [".web.js", ".web.jsx", ".web.ts", ".web.tsx", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^react-native$/, replacement: "react-native-web" }],
    extensions: webExtensions,
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: webExtensions,
      loader: { ".js": "jsx" },
    },
  },
});
