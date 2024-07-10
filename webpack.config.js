const path = require("path");

module.exports = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: { path: false },
  },
  externals: {
    puppeteer: "puppeteer-core",
    "puppeteer-core": "puppeteer-core",
  },
  output: {
    path: path.resolve("dist"),
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
};
