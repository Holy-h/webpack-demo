import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

const app = express();
import config from "./webpack.config";
const compiler = webpack(config);

// Tell express to use webpack-dev-middleware and use the webpack.config.js
// configuration file as a base
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the file on port 5000
app.listen(5000, () => {
  console.log("Example app listening on port 5000!\n")
})