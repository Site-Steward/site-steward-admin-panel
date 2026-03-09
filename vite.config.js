import { defineConfig } from "vite";
import path from "node:path";
import react from '@vitejs/plugin-react'

const projectRoot = path.resolve(__dirname);

export default defineConfig({
  root: path.resolve(projectRoot, "src/demo-site"),
  envDir: projectRoot,
  publicDir: path.resolve(projectRoot, "public"),
  plugins: [react()]
});
