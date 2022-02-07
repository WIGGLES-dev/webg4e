require("dotenv").config()
const preprocess = require("svelte-preprocess")
const path = require("path")
const foundrySystemDirectory = path.resolve(
  process.env.FOUNDRY_USER,
  "Data",
  "systems",
  "gurps4e"
)
module.exports = {
  mount: {
    src: "/",
    assets: "/assets",
  },
  buildOptions: {
    out: foundrySystemDirectory,
    clean: true,
    watch: true,
  },
  devOptions: {
    tailwindConfig: "./tailwind.config.cjs",
  },
  plugins: [
    "@snowpack/plugin-postcss",
    "./json-import.cjs",
    [
      "@snowpack/plugin-svelte",
      {
        preprocess: preprocess({ postcss: true }),
        compilerOptions: {
          dev: true,
          css: true,
        },
      },
    ],
  ],
}
