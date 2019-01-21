const {
  OPEN,
  stripThisContext,
  stripMustache,
  isBindingValue,
  isBindingExpression,
  resolveValue,
  extractExpressionInString,
  seperateStyleNameEndValue,
  resovleAttrExpression,
  hasUnwalkedAttr,
} = require('../helper');

const { notEmpty } = require('../../helper/utils');

const onEventReg = /^on-/;
const normalDirectiveReg = /^r-[model|html|show]/;

const resolvers = {
  // r-show, r-model, r-html
  all(attr) {
    attr.walked = true;
  },
  default(attr) {
    const { name, value } = attr;
    if(normalDirectiveReg.test(name)) {
      const expr = resolveValue(value);
      const vueName = name.replace(/^r/, 'v')
      return `${vueName}="${expr}"`;
    } else {
      if (isBindingValue(value)) {
        return `:${name}="${resolveValue(value)}"`;
      } else if (isBindingExpression(value)) {
        const realValue = resovleAttrExpression(value);
        return `:${name}="${realValue}"`;
      }
      return `${name}="${value}"`;
    }
    throw new Error(`cannot resolve attr: ${name}`)
  },
  event(attr = {}) {
    const { name, value = '' } = attr;
    const realValue = resolveValue(value).replace(/\(\)/g, '');
    const vueName = name.replace(onEventReg, '')

    return `@${vueName}="${realValue}"`;
  },

  // class and r-class should combine
  class(attr = {}, el) {
    const { value = '' } = attr;
    const staticClassList = [];
    const dynamicClassList = []

    const classList = extractExpressionInString(value);
    classList.forEach(c => {
      if (OPEN.test(c)) {
        const vueValue = stripThisContext(c).replace(/{/g, '${').replace(/"/g, `'`);
        dynamicClassList.push(`\`${vueValue}\``); 
      } else {
        staticClassList.push(c);
      }
    })

    record(el, 'dynamicClassList', dynamicClassList)

    const staticClass = staticClassList.length > 0 ?
      `class="${staticClassList.join(' ')}"` :
      '';
    
    const dynamicClass = (el.dynamicClassList && !hasUnwalkedAttr(el, 'r-class')) ?
      `:class="[${el.dynamicClassList.join(',')}]"` :
      '';

    return (
      [staticClass, dynamicClass]
        .filter(notEmpty)
        .join(' ')
    );
  },
  'r-class'(attr = {}, el) {
    const { value = '' } = attr;
    const realValue = resolveValue(value).replace(/"/g, `'`);
    const vueValue = realValue;

    record(el, 'dynamicClassList', [vueValue])

    return (
      !hasUnwalkedAttr(el, 'class') ? (
        el.dynamicClassList.length > 1 ?
          `:class="[${el.dynamicClassList.join(',')}]"` :
          `:class="${vueValue}"`
      ) :
      ''
    );
  },
  
  // style and r-style should combine
  style(attr = {}, el) {
    const { value = '' } = attr;
    const staticStyleList = [];
    const dynamicStyleList = [];

    const styleList
      = extractExpressionInString(value, /;/)
        .map(seperateStyleNameEndValue);

    styleList.forEach(style => {
      const { name, value } = style;
      if (OPEN.test(style.value)) {
        dynamicStyleList.push(
          `'${name}':\`${stripThisContext(value).replace(/{/g, '${')}\``
        );
      } else {
        staticStyleList.push(`${name}:${value}`)
      }
    });

    record(el, 'dynamicStyleList', dynamicStyleList);
    
    const staticStyle = staticStyleList.length > 0 ?
      `style="${staticStyleList.join(';')}"` :
      '';

    const dynamicStyle = (el.dynamicStyleList && !hasUnwalkedAttr(el, 'r-style')) ?
      `:style="{${el.dynamicStyleList.join(',')}}"` :
      '';

    return (
      [staticStyle, dynamicStyle]
        .filter(notEmpty)
        .join(' ')
    );
  },
  'r-style'(attr = {}, el) {
    const { value = '' } = attr;
    const realValue = stripMustache(resolveValue(value));

    record(el, 'dynamicStyleList', [realValue]);

    return (
      !hasUnwalkedAttr(el, 'style') ? (
        el.dynamicStyleList.length > 1 ?
          `:style="{${el.dynamicStyleList.join(',')}}"` :
          `:style="{${realValue}}"`
      ) :
      ''
    );
  },

  // r-hide -> v-show
  'r-hide'(attr = {}) {
    const { value = '' } = attr;
    const vueValue = resolveValue(value)
    return `v-show="!(${vueValue})"`
  }
}

function record(el, key = 'dynamicClassList', list = []) {
  if (list && list.length > 0) {
    if (!el[key]) {
      el[key] = list;
    } else {
      el[key] = el[key].concat(list);
    }
    el[key] = el[key].filter(notEmpty);
  }
  return el[key];
}

module.exports = function(attr, el) {
  const { name, value } = attr;

  resolvers.all(attr, el);

  if (onEventReg.test(name)) {
    return resolvers.event(attr, el);
  } else if (resolvers[name]) {
    return resolvers[name](attr, el);
  } else {
    return resolvers.default(attr, el);
  }
}