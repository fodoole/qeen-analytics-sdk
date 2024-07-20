const path = require('path');

module.exports = {
  mode: 'production',
  entry: './build/fodoole.js',
  output: {
    filename: 'fodoole.js',
    path: path.resolve(__dirname, 'dist'),
  },
};