const path = require('path');
const glob = require('glob')

const {
  transformRgl,
  transformHtml
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

function transformFile(input, output, options = {}) {
  if(path.extname(input) === '.rgl') {
    transformRgl(input, output, options);
  } else {
    transformHtml(input, output, options);
  }
}

function transformFiles(input, output, options = {}) {
  readFiles(input)
    .then(files => {
      files.forEach(filePath => {
        console.log(`transforming "${filePath}"...`)
        transformFile(filePath, output);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = transformFiles
