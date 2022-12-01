const { merge } = require('webpack-merge');
const config = require('../../webpack.config');


module.exports = (env, args) => {
  let cfg = config(env, args);
  return merge(cfg, {
    output: {
        filename: 'mkpkg.js',
        libraryTarget: 'commonjs',
        chunkFormat: 'commonjs'
    },
    resolve: {
        alias: {
            'process/browser': 'process'
        }
    },
    target: 'node'
  })
}