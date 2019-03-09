const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractCSS = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ["@babel/polyfill", ENTRY_FILE],
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./static"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ExtractCSS("styles.css"),
  ],
  output: {
    path: OUTPUT_DIR,
    filename: '[name].js',
    // publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ExtractCSS.extract({
          fallback: 'style-loader',
          use: [
          { loader: "css-loader" },
          { loader: "postcss-loader",
            options: {
              plugins() {
                return [autoprefixer({ browsers: "cover 99.5%", grid: "autoplace"})]
              }
            }
          },
          { loader: "sass-loader" }
          ]
        })
      }
    ]
  }
};

module.exports = config;