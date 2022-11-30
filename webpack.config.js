const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

module.exports = () => {
  const env = dotenv.config().parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: ["./src/index.js"],
    output: {
      path: path.join(__dirname, "public"),
      publicPath: "/",
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: ["*", ".js"],
      fallback: {},
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        inlineSource: ".(js|css)$",
        minify: { collapseWhitespace: true },
      }),
    ],
    devServer: {
      static: "./public",
    },
  };
};
