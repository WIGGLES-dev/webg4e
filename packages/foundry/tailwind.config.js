module.exports = {
  mode: "jit",
  purge: ["./src/**/*.ts", "./src/**/*.svelte", "../sheet/**/*.svelte"],
  plugins: [require("tailwindcss-children")],
};
