const codegen = require('../template/codegen');
const { prettify } = require('./pretty');
const templateReg = /<template>([\s\S]*)<\/template>/;
const scriptReg = /<script>([\s\S]*)<\/script>/;

function isRgl(content) {
  return templateReg.test(content) && scriptReg.test(content);
}

function transformHtml(input, options = {}) {
  let raw = '';
  let prettified = '';
  let error = null;
  try {
    raw = codegen(input);
    prettified = prettify(raw, options);
  } catch(err) {
    error = err;
  }
  return {
    raw,
    prettified,
    error
  };
}

function transformRgl(input, options = {}) {
  const templateReg = /<template>([\s\S]*)<\/template>/;
  const template = (templateReg.exec(input) || [])[1];
  if (template === undefined) {
    return {
      raw: '',
      prettified: '',
      error: new Error('Cannot match <template> content'),
    };
  }

  let transed = transformHtml(template, options);
  if (!transed.error) {
    const transformedRgl = input.replace(template, `\n${transed.prettified || transed.raw}`);
    return {
      raw: transformedRgl,
      prettified: transformedRgl,
      error: null
    }
  } else {
    return {
      raw: '',
      prettified: '',
      error: transed.error,
    };
  }
}

module.exports = {
  isRgl,
  transformHtml,
  transformRgl,
};