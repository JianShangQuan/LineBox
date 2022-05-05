const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/html/index.html'),
      hash: true
    }),
  ],
  optimization: {
    minimize: true
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../','dist')
  },
};