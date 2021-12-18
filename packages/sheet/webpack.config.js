const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const preprocess = require("svelte-preprocess");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = (env) => {
  const dev = env.dev;
  const mode = env.mode || "development";
  const devServer = dev
    ? {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        writeToDisk: true,
      }
    : undefined;
  return {
    mode,
    watch: true,
    entry: { sheet: "src/index.ts" },
    devServer,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    resolve: {
      plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
      extensions: [".ts", ".tsx", ".js", ".svelte"],
      alias: {
        svelte: path.resolve("node_modules", "svelte"),
      },
      mainFields: ["svelte", "browser", "module", "main"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
        },
        {
          test: /\.svelte$/,
          use: {
            loader: "svelte-loader",
            options: {
              emitCss: true,
              preprocess: preprocess({
                postcss: true,
                typescript: true,
              }),
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                url: false,
              },
            },
            "postcss-loader",
          ],
        },
        {
          test: /node_modules\/svelte\/.*\.mjs$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin(),
      new CopyPlugin({
        patterns: [{ from: "static", to: "./" }],
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: true,
      }),
    ],
    mode: "development",
  };
};
module.exports = config;
