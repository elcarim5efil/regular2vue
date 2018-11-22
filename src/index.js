const prettier = require("prettier/standalone");
const plugins = [require("prettier/parser-html")];
const codegen = require('./codegen');

codegen(`<input class="r-{type}">`)
      

function prettify(content, options = {}) {
  const {
    pretty = true,
    tabWidth = 4,
    singleQuote = true,
    trailingComma = 'none'
  } = options;

  return pretty ? prettier.format(content, {
    parser: 'vue',
    plugins,
    tabWidth,
    singleQuote,
    trailingComma
  }) : content;
}

function gen(input, options = {}) {
  let raw = '';
  let prettified = '';
  let res = ''
  try {
    raw = codegen(input);
    prettified = prettify(raw);
    return raw;
  } catch(err1) {
    try {
      const templateReg = /<template>([\s\S]*)<\/template>/;
      const template = templateReg.exec(input)[1];
      raw = codegen(template || '');
      prettified = prettify(raw);
      res = input.replace(template, prettified);
    } catch(err2) {
      console.log(err1, err2)
    }
  }
  return res;
}

module.exports = gen;