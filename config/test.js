'use strict';

let path = require('path');
let srcPath = path.join(__dirname, '/../src/');

module.exports = {
  entry: path.join(__dirname, '/../test/loadtests.js'),
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'isparta-instrumenter-loader',
        include: [
          path.join(__dirname, '/../src')
        ]
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include:
          [
            path.join(__dirname, '/../src'),
            path.join(__dirname, '/../test')
          ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      helpers: path.join(__dirname, '/../test/helpers'),
      components: srcPath + 'components/',
      styles: srcPath + 'styles/',
      config: srcPath + 'config/' + process.env.REACT_WEBPACK_ENV
    }
  },
  plugins: []
};
