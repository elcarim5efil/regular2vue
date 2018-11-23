const mustacheReg = /^{(.*)}$/;
const OPEN = /\{/;
const CLOSE = /\}/;

const stripMustache = value => {
  const str = (mustacheReg.exec(value) || [])[1] || ''
  return str ? str.trim() : value;
};
const stripThisContext = value => ( value.replace(/this\./g, '') );
const strip = value => stripMustache(stripThisContext(value));

function isBindingValue(value) {
  if (typeof value === 'object') {
    return true;
  } else {
    return mustacheReg.test(value)
  }
}

function resolveValue(value) {
  if (typeof value === 'object') {
    return stripThisContext(value.body);
  } else {
    return strip ? stripMustache(stripThisContext(value)) : value;
  }
}

function extractExpressionInString(str, splitReg = /\s+/) {
  const parts = str.split(splitReg);
  let i = 0;
  let cursor = parts[i];
  let res = []

  while(cursor) {
    if (OPEN.test(cursor)) {
      const mustache = [];
      while(i < parts.length) {
        mustache.push(cursor);

        if (CLOSE.test(cursor)) {
          res.push(mustache.join(' '));
          i++;
          cursor = parts[i];
          break;
        }
        i++;
        cursor = parts[i];
      }
    } else {
      res.push(cursor);
      i++;
      cursor = parts[i];
    }
  }

  return res;
}

function seperateStyleNameEndValue(style = '') {
  const splitIndex = style.indexOf(':');
  return {
    name: style.substring(0, splitIndex),
    value: style.substring(splitIndex + 1),
  };
}

module.exports = {
  mustacheReg,
  OPEN,
  CLOSE,
  stripMustache,
  stripThisContext,
  strip,
  isBindingValue,
  resolveValue,
  extractExpressionInString,
  seperateStyleNameEndValue,
}