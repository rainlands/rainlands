const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const config = require('../config');

const clientConfig = {
  entry: path.resolve(__dirname, '../src/client'),
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, '../build'),
  },
  target: 'electron-renderer',
  plugins: [
    new HTMLWebpackPlugin({
      title: config.title,
      template: path.resolve(__dirname, '../src/index.html'),
      filename: path.resolve(__dirname, '../build/index.html'),
    }),
  ],
};

const serverConfig = {
  entry: path.resolve(__dirname, '../src/server'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../build'),
  },
  target: 'electron-main',
  node: {
    __filename: true,
    __dirname: true,
  },
};

module.exports = [clientConfig, serverConfig];
