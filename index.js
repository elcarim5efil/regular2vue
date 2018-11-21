const prettier = require("prettier");
const codegen = require('./src/codegen');
const transformFiles = require('./src/transform-files');

function gen(source, { pretty = true } = {}) {
  const raw = codegen(source)
  if (pretty) {
    return prettier.format(raw, { parser: 'vue' });
  }
  return raw;
}

module.exports = gen;