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
    src: {
      url: "/",
    },
  },
  buildOptions: {
    out: foundrySystemDirectory,
    clean: true,
  },
  plugins: [
    "@snowpack/plugin-postcss",
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
