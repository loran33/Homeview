import { defineConfig } from "vitest/config";

// Single ES module bundle, no code splitting: Home Assistant loads the panel
// with a single <script type="module"> via panel_custom.module_url.
export default defineConfig({
  build: {
    target: "es2022",
    outDir: "../custom_components/homeview/frontend",
    emptyOutDir: true,
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "homeview-builder.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
