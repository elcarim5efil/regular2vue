const {
  OPEN,
  stripThisContext,
  isBindingValue,
  isBindingExpression,
  resolveValue,
  extractExpressionInString,
  seperateStyleNameEndValue,
  resovleAttrExpression,
} = require('../helper');

const onEventReg = /^on-/;
const normalDirectiveReg = /^r-[model|html|show]/;

const resolvers = {
  // r-show, r-model, r-html
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
  class(attr = {}) {
    const { value = '' } = attr;

    if (!OPEN.test(value)) {
      return `class="${value}"`
    }
    const classList = extractExpressionInString(value);
    const vueClassList = classList.map(c => {
      if (OPEN.test(c)) {
        const vueValue = stripThisContext(c).replace(/{/g, '${').replace(/"/g, `'`);
        return `\`${vueValue}\``;
      } else {
        return `'${c}'`;
      }
    })
    return `:class="[${vueClassList.join(',')}]"`;
  },
  'r-class'(attr = {}) {
    const { value = '' } = attr;
    const realValue = resolveValue(value).replace(/"/g, `'`);
    const vueValue = realValue;
    return `:class="${vueValue}"`;
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


module.exports = function(attr) {
  const { name, value } = attr;

  if (onEventReg.test(name)) {
    return resolvers.event(attr);
  } else if (resolvers[name]) {
    return resolvers[name](attr);
  } else {
    return resolvers.default(attr);
  }
}