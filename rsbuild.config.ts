import { defineConfig } from "@rsbuild/core";
import fs from "fs";
import path from "path";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "backend/certs/cert.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "backend/certs/cert.crt")),
    },
  },
  plugins: [pluginReact()],
});
