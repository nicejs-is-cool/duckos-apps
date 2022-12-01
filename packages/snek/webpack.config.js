const { merge } = require('webpack-merge');
const config = require('../../webpack.config');


module.exports = (env, args) => {
  let cfg = config(env, args);
  return merge(cfg, {
    output: {
        filename: 'snek.js'
    },
    resolve: {
        /*fallback: {
            path: require.resolve('path-browserify'),
            //util: require.resolve('util')
            'process/browser': require.resolve('process/')
        }*/
    }
  })
}