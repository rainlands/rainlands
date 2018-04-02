const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const appConfig = require('../config');

module.exports = {
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'worker-loader',
        },
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: appConfig.title,
      template: path.resolve(
        __dirname,
        '../src/index.html',
      ),
      filename: path.resolve(
        __dirname,
        '../build/index.html',
      ),
    }),
    new CleanWebpackPlugin(
      [path.resolve(__dirname, '../build')],
      { allowExternal: true },
    ),
  ],
};
