const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');

function resolvePath(...args) {
  return path.resolve(process.cwd(), ...args);
}

function readFile(input) {
  const file = fs.readFileSync(input).toString();
  return file;
}

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

function copyFile(from, to) {
  fs.copyFileSync(from, to);
}

module.exports = {
  resolvePath,
  resolveOutputPath,
  readFile,
  copyFile,
  outputFile
};