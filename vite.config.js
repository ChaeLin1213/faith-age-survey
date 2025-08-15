import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/faith-age-survey/",   // ✅ 리포 이름과 동일
  build: { outDir: "docs" },    // ✅ 빌드 산출물을 /docs 로
  test: {
    globals: true,
    environment: "jsdom",
  },
});
