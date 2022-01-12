require("dotenv").config();
import { Configuration } from "webpack";
import * as path from "path";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import FileManagerPlugin from "filemanager-webpack-plugin";
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
import preprocess from "svelte-preprocess";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const mode = "development";
const config: Configuration = {
  mode,
  watch: mode === "development",
  entry: { foundry: "./src/index.ts" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    plugins: [new TsConfigPathsPlugin({ configFile: "./tsconfig.json" })],
    extensions: [".ts", ".tsx", ".js", ".svelte", ".wasm", ".css"],
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
            emitCss: false,
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
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CopyPlugin({
      patterns: [
        { from: "./template.json", to: "./" },
        { from: "./system.json", to: "./" },
      ],
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: "./dist",
              destination: path.join(
                process.env.FOUNDRY_USER || "",
                "/Data/systems/gurps4e"
              ),
            },
          ],
          archive: [{ source: "./dist", destination: "./dist/gurps4e.zip" }],
        },
      },
    }),
    new CleanWebpackPlugin(),
  ],
};
export default config;
