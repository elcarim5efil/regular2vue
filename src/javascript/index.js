const { transform } = require('@babel/standalone');
const collectData = require('./collect-data');

function transformJs(code) {
  const res = transform(code, {
    plugins: [
      collectData
    ]
  })
  const { modified = {}, unmodified = {} } = res.metadata.dataCollection || {}
  return {
    modified,
    unmodified
  }
}

module.exports = {
  transformJs
}