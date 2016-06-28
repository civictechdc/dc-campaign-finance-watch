'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'dist',  // feel free to remove the appEnv property here
  api: 'production'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
