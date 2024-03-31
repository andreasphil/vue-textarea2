import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },

  build: {
    lib: {
      entry: [
        fileURLToPath(new URL("./src/components/Textarea2.vue", import.meta.url)),
        fileURLToPath(new URL("./src/lib/text.ts", import.meta.url)),
      ],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
    },
  },
});
