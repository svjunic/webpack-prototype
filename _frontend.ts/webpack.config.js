/* eslint-disable */

console.log(process.env.NODE_ENV);

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const DOCUMENT_ROOT = './dist/';
const RESOURCES_ROOT = './resources/';

module.exports = function() {
  const entries = {
    index: path.join(__dirname, `${RESOURCES_ROOT}index.ts`)
  };

  const watchOptions = {
    poll: true
  };

  const output = {
    path: path.join(__dirname, DOCUMENT_ROOT),
    filename: '[name].js',
    chunkFilename: '[name].js',
    jsonpFunction: 'sandbox'
  };

  let optimization = {
    splitChunks: {
      name: 'js/vendor',
      //chunks: 'initial'
      chunks: 'all'
    }
  };

  if (process.env.NODE_ENV === 'production') {
    optimization = Object.assign(optimization, {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true
            }
          }
        })
      ]
    });
  }

  const resolve = {
    alias: {
      '~': path.resolve(__dirname, '/resources')
      //"velocity-animate": "velocity-animate/velocity.min.js"
    },
    // モジュール検索
    modules: [path.resolve(__dirname, 'resources'), 'node_modules']
  };

  const baseConfig = {
    target: 'web',

    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        }
      ]
    },

    plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.optimize.AggressiveMergingPlugin()]
  };

  return [
    Object.assign(
      {
        mode: 'production',
        watchOptions: watchOptions,
        entry: entries,
        resolve: resolve,
        output: output,
        optimization: optimization
      },
      baseConfig
    )
  ];
};
