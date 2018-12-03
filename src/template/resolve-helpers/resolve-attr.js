const {
  OPEN,
  stripThisContext,
  isBindingValue,
  isBindingExpression,
  resolveValue,
  extractExpressionInString,
  seperateStyleNameEndValue,
  resovleAttrExpression,
  hasUnwalkedAttr,
} = require('../helper');

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
        return `:${name}="${resolveValue(realValue)}"`;
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
  class(attr = {}, el) {
    const { value = '' } = attr;
    let staticClass = '';
    let dynamicClass = '';
    let staticClassList = [];

    if (!OPEN.test(value)) {
      staticClassList = value.split(/\s+/);
    }
    const classList = extractExpressionInString(value);
    let dynamicClassList = classList
      .map(c => {
        if (OPEN.test(c)) {
          const vueValue = stripThisContext(c).replace(/{/g, '${').replace(/"/g, `'`);
          return `\`${vueValue}\``;
        } else if (!~staticClassList.indexOf(c)){
          staticClassList.push(c);
        }
      })
      .filter(e => e);

    recordDynamicClassList(el, dynamicClassList)

    staticClass = staticClassList.length > 0 ?
      `class="${staticClassList.join(' ')}"` :
      '';
    
    dynamicClass = (el.dynamicClassList && !hasUnwalkedAttr(el, 'r-class')) ?
      `:class="[${el.dynamicClassList.join(',')}]"` :
      '';

    return [staticClass, dynamicClass].filter(e => e).join(' ');
  },
  'r-class'(attr = {}, el) {
    const { value = '' } = attr;
    const realValue = resolveValue(value).replace(/"/g, `'`);
    const vueValue = realValue;

    recordDynamicClassList(el, [vueValue])

    return !hasUnwalkedAttr(el, 'class') ?
      (
        el.dynamicClassList.length > 1 ?
          `:class="[${el.dynamicClassList.join(',')}]"` :
          `:class="${vueValue}"`
      ) :
      '';
  },
  'r-style'(attr = {}) {
    const { value = '' } = attr;
    const realValue = resolveValue(value);
    const vueValue = realValue;
    return `:style="${vueValue}"`;
  },
  style(attr = {}) {
    const { value = '' } = attr;

    if (!OPEN.test(value)) {
      return `style="${value}"`
    }

    const styleList
      = extractExpressionInString(value, /;/)
        .map(seperateStyleNameEndValue);

    const vueStyleList
      = styleList
        .map(style => {
          const { name, value } = style;
          if (OPEN.test(style.value)) {
            return `'${name}':\`${stripThisContext(value).replace(/{/g, '${')}\``;
          } else {
            return `'${name}':'${value}'`
          }
        })

    return `:style="[{${vueStyleList.join(',')}}]"`
  },
  // r-hide -> v-show
  'r-hide'(attr = {}) {
    const { value = '' } = attr;
    const vueValue = resolveValue(value)
    return `v-show="!(${vueValue})"`
  }
}

function recordDynamicClassList(el, list = []) {
  if (list && list.length > 0) {
    if (!el.dynamicClassList) {
      el.dynamicClassList = list;
    } else {
      el.dynamicClassList = el.dynamicClassList.concat(list);
    }
    el.dynamicClassList = el.dynamicClassList.filter(e => e);
  }
  return el.dynamicClassList
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