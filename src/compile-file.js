const path = require('path')
const fs = require('fs-extra');
const prettier = require("prettier");
const codegen = require('./codegen');

function resolvePath(...args) {
  return path.resolve(process.cwd(), ...args);
}

function readFile(source) {
  const file = fs.readFileSync(source).toString();
  return file;
}

function resolveOutputPath(source, output = '') {
  let outputPath = ''
  const sourceInfo = path.parse(source);
  const outputInfo = path.parse(output);
  const ext = sourceInfo.ext === '.rgl' ? '.vue' : sourceInfo.ext;
  if (!output) {
    outputPath = resolvePath(path.join(sourceInfo.dir, `${sourceInfo.name}${ext}`));
  } else if (!outputInfo.ext) {
    outputPath = path.resolve(output, `${sourceInfo.name}${ext}`);
  } else {
    outputPath = output;
  }
  return outputPath;
}

function outputFile(filePath, content) {
  fs.outputFileSync(filePath, content);
}

function genTemplate(src, options = {}) {
  const { pretty = true } = options;
  let raw = '';
  let prettified = '';

  try {
    raw = codegen(src);
    if (pretty) {
      prettified = prettier.format(`${raw}`, { parser: 'vue' });
    }
  } catch(err) {
    console.log(err);
  }

  return { raw, prettified }
}

function compileRgl(source, output, options = {}) {
  const templateReg = /<template>([\s\S]*)<\/template>/;
  const file = readFile(source);
  const template = templateReg.exec(file)[1];
  const { raw, prettified } = genTemplate(template, options);
  const res = file.replace(template, `\n${prettified || raw}\n`);

  const outputPath = resolveOutputPath(source, output);
  outputFile(outputPath, res);
}

function compileHtml(source, output, options = {}) {
  const { pretty = true } = options;
  const file = readFile(source);
  const { raw, prettified } = genTemplate(file, options);
  const outputPath = resolveOutputPath(source, output);
  outputFile(outputPath, prettified || raw);
}

function compileFile(source, output, options = {}) {
  if(path.extname(source) === '.rgl') {
    compileRgl(source, output, options);
  } else {
    compileHtml(source, output, options);
  }
}

module.exports = compileFile
