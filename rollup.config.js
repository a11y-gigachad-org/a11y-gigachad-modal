import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"

import { defineConfig } from "rollup"

export default defineConfig({
  input: "src/index.ts",
  output: { dir: "dist", format: "es", sourcemap: true },
  plugins: [commonjs(), nodeResolve(), typescript(), terser()],
  external: ["react"],
})
