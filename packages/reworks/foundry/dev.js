import webpack from "webpack";
import conf from "./webpack.config.js";

const bundler = webpack(conf);

bundler.run();
