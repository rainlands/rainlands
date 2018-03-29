const path = require('path');
const commonConfig = require('./common.config');

const clientConfig = {
  entry: path.resolve(__dirname, '../src/client'),
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, '../build'),
  },
  target: 'electron-renderer',
  ...commonConfig,
};

const serverConfig = {
  entry: path.resolve(__dirname, '../src/server'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../build'),
  },
  target: 'electron-main',
  ...commonConfig,
};

module.exports = [clientConfig, serverConfig];
