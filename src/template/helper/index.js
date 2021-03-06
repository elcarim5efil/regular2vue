const mustacheReg = /^{([^{]*)}$/;
const OPEN = /\{/;
const CLOSE = /\}/;

const stripMustache = value => {
  let str = value
  if (/^{.*}$/.test(value)) {
    str = value.substring(1, value.length - 1);
  }
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

function isBindingExpression(value) {
  if (typeof value === 'object') {
    return false;
  } else {
    return /{/.test(value)
  }
}

function resolveValue(value) {
  if (typeof value === 'object') {
    return stripThisContext(value.body);
  } else if (/\|/.test(value)) {
    return resolveFilterExpression(stripMustache(stripThisContext(value)));
  } else {
    return stripMustache(stripThisContext(value));
  }
}

function resolveFilterExpression(value) {
  const parts = value.split('|');
  const variable = parts[0];
  const filters = parts.slice(1).map((filter) => {
    const [ filterName, args = '' ] = filter.split(':');
    if (args) {
      return `${filterName}(${args})`;
    } else {
      return filterName;
    }
  })

  return `${variable}|${filters.join('|')}`;
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

function resovleAttrExpression(value) {
  const len = value.length;
  let i = 0;
  const res = [];
  while(i < len) {
    // collect expression
    if (value[i] === '{') {
      let tmp = '';
      i++;
      while(value[i] && value[i] !== '}') {
        if (!/\s/.test(value[i])) {
          tmp += value[i];
        }
        i++;
      }
      res.push(resolveValue(tmp))
    // collect string
    } else if(value[i] !== '}') {
      let tmp = '';
      while(value[i]) {
        tmp += value[i];
        if (value[i + 1] === '{') {
          break;
        }
        i++;
      }
      res.push(`'${tmp}'`)
    }
    i++;
  }
  return res.join('+')
}

function seperateStyleNameEndValue(style = '') {
  const splitIndex = style.indexOf(':');
  return {
    name: style.substring(0, splitIndex),
    value: style.substring(splitIndex + 1),
  };
}

const forbiddenCloseTags = [
  'area', 'base', 'br', 'col', 'command',
  'embed', 'hr', 'img', 'input', 'keygen',
  'link', 'meta', 'param', 'source', 'track',
  'wbr',
];

function isForbiddenCloseTag(tag) {
  return ~forbiddenCloseTags.indexOf(tag);
}

function hasUnwalkedAttr(el = {}, name) {
  const { attrs } = el;
  return attrs.some(attr => attr.name === name && !attr.walked);
}

module.exports = {
  mustacheReg,
  OPEN,
  CLOSE,
  stripMustache,
  stripThisContext,
  strip,
  isBindingValue,
  isBindingExpression,
  resolveValue,
  extractExpressionInString,
  seperateStyleNameEndValue,
  resovleAttrExpression,
  isForbiddenCloseTag,
  hasUnwalkedAttr
}