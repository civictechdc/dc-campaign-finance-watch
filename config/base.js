'use strict';
let path = require('path');
let defaultSettings = require('./defaults');
module.exports = {
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: `.${defaultSettings.publicPath}`
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: `${defaultSettings.srcPath}/components/`,
      styles: `${defaultSettings.srcPath}/styles/`,
      config: `${defaultSettings.srcPath}/config/` +
        process.env.REACT_WEBPACK_ENV,
      // temporary fix for missing require in `react-ga`
      // cf. https://github.com/react-ga/react-ga/issues/53
      'react/lib/Object.assign': 'object-assign'
    }
  },
  module: {}
};
