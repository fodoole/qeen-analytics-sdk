const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const DotenvWebpack = 'dotenv-webpack';
const Dotenv = require(DotenvWebpack);
const GolfMinifierPlugin = require('./build_plugins/golfMinifier');
const IIFEWrapperPlugin = require('./build_plugins/iifeWrapper');

const envFilePath = path.resolve(__dirname, '.env');
const envFileExists = fs.existsSync(envFilePath);
if (envFileExists) {
  require('dotenv').config({ path: envFilePath });
}

if (!process.env.GET_CONTENT_ENDPOINT) {
  console.error('Error: GET_CONTENT_ENDPOINT environment variable is not defined.');
  process.exit(1);
}

module.exports = {
  mode: 'production',
  entry: './build/qeen.js',
  output: {
    filename: 'qeen.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        minify: TerserPlugin.uglifyJsMinify,
        terserOptions: {
          compress: {
            passes: 10,
            inline: true,
            drop_debugger: true,
            dead_code: true,
            conditionals: true,
            unused: true,
            evaluate: true,
            sequences: true,
            booleans: true,
            loops: true,
            toplevel: true,
            hoist_funs: true,
            hoist_vars: true,
            if_return: true,
            join_vars: true,
            collapse_vars: true,
            reduce_funcs: true,
            reduce_vars: true,
            side_effects: true,
            pure_getters: true,
            keep_fargs: false,
            keep_fnames: false,
            reduce_vars: true,
            collapse_vars: true,
            pure_funcs: ['console.log'],
          },
          output: {
            comments: false,
            wrap_iife: true,
          },
          mangle: {
            properties: {
              regex: /^_/,
            },
            toplevel: true,
          },
        },
      }),
    ],
    usedExports: true,
  },
  plugins: [
    envFileExists ? new Dotenv() : new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new GolfMinifierPlugin(),
    new IIFEWrapperPlugin(),
  ],
};