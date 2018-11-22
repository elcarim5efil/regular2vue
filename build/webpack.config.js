const path = require('path')

function resolve(...args) {
  return path.resolve(__dirname, '../', ...args);
}
module.exports = {
  mode: 'production',
  entry: {
    index: resolve('./src/index.js')
  },
  output: {
    path: resolve('dist'),
     filename: 'r2v.js',
     library: 'r2v'
  }
}