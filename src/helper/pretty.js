const prettier = require("prettier/standalone");
const plugins = [require("prettier/parser-html")];

function prettify(content, options = {}) {
  let prettified = ''
  const {
    tabWidth = 4,
    singleQuote = true,
    trailingComma = 'none',
    jsxBracketSameLine = true,
    htmlWhitespaceSensitivity = 'strict'
  } = options;

  prettified = prettier.format(content, {
    parser: 'vue',
    plugins,
    tabWidth,
    singleQuote,
    trailingComma,
    jsxBracketSameLine,
    htmlWhitespaceSensitivity
  });

  return prettified;
}

module.exports = {
  prettify
};