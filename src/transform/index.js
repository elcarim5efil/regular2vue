const {
  transformTemplate,
  resolveOutputPath,
  readFile,
  copyFile,
  outputFile
} = require('./helper');

function extractTemplate(str) {
  const templateReg = /<template>([\s\S]*)<\/template>/;
  const matched = templateReg.exec(str);
  if (matched) {
    return matched[1]
  }
  return '';
}

function extractScript(str) {
  const scriptReg = /<script>([\s\S]*)<\/script>/;
  const matched = scriptReg.exec(str);
  if (matched) {
    return matched[1]
  }
  return '';
}

function transformRgl(input, output, options = {}) {
  const file = readFile(input);
  const template = extractTemplate(file);
  const script = extractScript(file);

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