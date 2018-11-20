// const fs = require('fs-extra');
const prettier = require("prettier");
const genVue = require('./src/codegen');

module.exports = function gen(source, { pretty = true }) {
  const raw = genVue(template)
  if (pretty) {
    return prettier.format(`<div>${raw}</div>`);
  }
  return raw;
}