const glob = require('glob');
const path = require('path');
const prettier = require('prettier');
const fs = require('fs-extra');
const codegen = require('../codegen');

function resolvePath(...args) {
  return path.resolve(process.cwd(), ...args);
}

function readFile(input) {
  const file = fs.readFileSync(input).toString();
  return file;
}

function resolveOutputPath(input, output = '') {
  let outputPath = ''
  const inputInfo = path.parse(input);
  const outputInfo = path.parse(output);
  const ext = inputInfo.ext === '.rgl' ? '.vue' : inputInfo.ext;
  if (!output) {
    outputPath = resolvePath(path.join(inputInfo.dir, `${inputInfo.name}${ext}`));
  } else if (!outputInfo.ext) {
    outputPath = path.resolve(output, `${inputInfo.name}${ext}`);
  } else {
    outputPath = output;
  }
  return outputPath;
}

function outputFile(filePath, content) {
  fs.outputFileSync(filePath, content);
}

function transformTemplate(source, options = {}) {
  const { pretty = true } = options;
  let error = null;
  let raw = '';
  let prettified = '';

  try {
    raw = codegen(source);
  } catch(err) {
    error = err
    // console.log('[codegen error]', err, source);
  }

  try {
    if (pretty) {
      prettified = prettier.format(`${raw}`, { parser: 'vue' });
    }
  } catch(err) {
    error = err
    // console.log('[prettier error]', err, source);
  }

  return { raw, prettified, error }
}

module.exports = {
  resolvePath,
  resolveOutputPath,
  readFile,
  outputFile,
  transformTemplate,
};