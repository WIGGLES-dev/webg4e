const path = require("path")
const { readFileSync } = require("fs")
module.exports = function (config, options) {
  return {
    name: "json-import",
    transform({ id, contents, isDev, fileExt }) {
      if (fileExt === ".json") {
        return contents.replaceAll(/"@import .*"/g, (match) => {
          const dir = id.split(".")[0].split("\\").slice(0, -1).join("\\")
          const rel = match.split(" ")[1].slice(0, -1)
          const importPath = path.resolve(dir, rel)
          const replace = readFileSync(importPath).toString()
          return replace
        })
      }
    },
  }
}
