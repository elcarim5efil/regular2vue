const {
  isRgl,
  transformHtml,
  transformRgl,
} = require('./helper/transform');

function transform(input, options = {}) {
  const { rgl } = options;
  if (rgl || isRgl(input)) {
    return transformRgl(input, options);
  }
  return transformHtml(input, options);
}

module.exports = {
  transform
};