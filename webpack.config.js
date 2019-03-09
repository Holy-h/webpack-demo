const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractCSS = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const ENTRY_FILE = path.resolve(__dirname, "src", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ENTRY_FILE,
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./static"
  },
  plugins: [
    new CleanWebpackPlugin(),
    // HTML 파일 자동 생성
    new HtmlWebpackPlugin({
      title: "Webpack setup"
    }),
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