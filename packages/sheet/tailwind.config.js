module.exports = {
  mode: "jit",
  purge: ["./src/**/*.ts", "./src/**/*.svelte"],
  plugins: [require("tailwindcss-children")],
};
