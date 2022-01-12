module.exports = {
  mode: "jit",
  content: ["./src/**/*.svelte"],
  plugins: [require("tailwindcss-children")],
};
