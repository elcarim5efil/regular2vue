// const fs = require('fs-extra');
const prettier = require("prettier");
const genVue = require('./src/codegen');

function gen(source, { pretty = true } = {}) {
  const raw = genVue(source)
  if (pretty) {
    return prettier.format(`<div>${raw}</div>`, { parser: 'vue' });
  }
  return raw;
}

module.exports = gen;