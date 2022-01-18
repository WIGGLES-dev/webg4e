import { config } from "dotenv";
config();
import * as path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import preprocess from "svelte-preprocess";
export default {
  mode: "development",
  watch: true,
  entry: {
    main: "./src/main.js",
  },
  resolve: {
    mainFields: ["svelte", "browser", "module", "main"],
    extensions: [".ts", ".tsx", ".js", ".svelte", ".wasm", ".css"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(process.env.FOUNDRY_USER, "Data", "systems", "gurps4e"),
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: false,
            preprocess: preprocess({
              postcss: true,
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
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: true,
    }),
    new CopyPlugin({
      patterns: [{ from: "static", to: "./" }],
    }),
  ],
};
