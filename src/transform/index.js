const {
  transformTemplate,
  resolveOutputPath,
  readFile,
  copyFile,
  outputFile
} = require('./helper');

function transformRgl(input, output, options = {}) {
  const templateReg = /<template>([\s\S]*)<\/template>/;
  const file = readFile(input);
  const template = templateReg.exec(file)[1];

  const { raw, prettified, error } = transformTemplate(template, options);
  const res = file.replace(template, `\n${prettified || raw}\n`);

  const outputPath = resolveOutputPath(input, output);
  outputFile(outputPath, res);

  if (error) {
    console.error(input, error)
  }
}

function transformHtml(input, output, options = {}) {
  const { pretty = true } = options;
  const file = readFile(input);

  const { raw, prettified, error } = transformTemplate(file, options);
  
  const outputPath = resolveOutputPath(input, output);
  outputFile(outputPath, prettified || raw);

  if (error) {
    console.error(input, error)
  }
}

function transformOther(input, output, options = {}) {
  const outputPath = resolveOutputPath(input, output);
  copyFile(input, outputPath);

  console.log(`copying "${input}" to "${outputPath}"`);
}

module.exports = {
  transformHtml,
  transformRgl,
  transformOther
}