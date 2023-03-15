/* eslint-disable no-undef */
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs"; // https use
import path from "path"; // https use

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/ig-live-comment/", // github page use
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8088,
    https: { // https use
      key: fs.readFileSync(path.resolve(__dirname, "localhost.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "localhost.crt"))
    },
    proxy: {
      "/api": {
        target: "http://bgec.dev-relithe.com" // 泰爾開發站
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/assets/styles/scss/index.scss";
        `
      },
      less: {
        javascriptEnabled: true,
        modifyVars: {
          "primary-color": "#5395CC",
          "error-color": "#C4484E",
          "border-radius-base": "4px",
        },
      }
    }
  }
});
