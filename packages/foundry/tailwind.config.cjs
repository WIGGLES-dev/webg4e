module.exports = {
  mode: "jit",
  content: ["./src/**/*.ts", "./src/**/*.svelte", "../sheet/**/*.svelte"],
  plugins: [require("tailwindcss-children")],
};
