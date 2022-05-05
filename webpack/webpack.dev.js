const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/html/index.html'),
    }),
  ],
  optimization: {
    minimize: false
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../', 'test'),
  },
};