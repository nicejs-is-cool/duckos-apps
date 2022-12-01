const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');


module.exports = (env, args) => {
  const developmentConfig = { mode: 'development', devtool: 'inline-source-map' }
  const productionConfig = { mode: 'production' }
    switch(args.mode) {
      case 'development':
        return merge(commonConfig, developmentConfig);
      case 'production':
        return merge(commonConfig, productionConfig);
      default:
        throw new Error('No matching configuration was found!');
    }
}