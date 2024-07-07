const path = require("path");

module.exports = {
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
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
};
