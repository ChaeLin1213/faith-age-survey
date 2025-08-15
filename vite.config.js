import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 저장소 이름으로 교체하세요!
  base: "/faith-age-survey/",
  test: {
    globals: true,
    environment: "jsdom",
  },
});
