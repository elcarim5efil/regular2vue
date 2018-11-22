const path = require('path');
const glob = require('glob')

const {
  transformRgl,
  transformHtml,
  transformOther
} = require('./transform');

function readFiles(input, options = {}) {
  return new Promise((resolve, reject) => {
    glob(input, options, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    })
  })
}

function transformFileSync(input, output, options = {}) {
  const ext = path.extname(input)
  if(ext === '.rgl') {
    transformRgl(input, output, options);
  } else if(ext === '.html') {
    transformHtml(input, output, options);
  } else {
    transformOther(input, output, options)
  }
}

function transformFiles(input, output, options = {}) {
  return readFiles(input)
    .then(files => {
      files.forEach(filePath => {
        console.log(`transforming "${filePath}"...`)
        transformFileSync(filePath, output);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = transformFiles
