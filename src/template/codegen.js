const { parse } = require('./parse');
const {
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
} = require('./helper');

const onEventReg = /^on-/;
const normalDirectiveReg = /^r-[model|html|show]/;
const uncloseTags = ['input', 'img']

class VueGenerator {
  constructor(source) {
    this.source = source;
    this.ast = parse(source);
    this.shouldWrapRootDiv = this.checkIfShouldWrapRootDiv();
  }

  checkIfShouldWrapRootDiv() {
    const notCommentRootElements = this.ast.filter(e => e.type !== 'comment');
    return notCommentRootElements.length > 1 || this.ast[0].type === 'list';
  }

  genVue() {
    const compiledContent = this.ast.map(this.genElement.bind(this)).join('');
    if (this.shouldWrapRootDiv) {
      return `<div>${compiledContent}</div>`;
    }
    return compiledContent;
  }

  genElement(el = {}) {
    const { type } = el;
    if (type === 'text') {
      return this.genText(el);
    } else if(el.type === 'expression') {
      return this.genExpression(el);
    } else if(el.type === 'if') {
      return this.genIf(el)
    } else if(el.type === 'list') {
      return this.genList(el)
    } else if(el.type === 'template') {
      return this.genTemplate(el)
    } else if(el.type === 'comment') {
      return this.genComment(el)
    }
    return this.genTag(el);
  }

  genTag(el= {}) {
    const { tag } = el;
    const childrenStr = this.genChildren(el);
    const startTag = [
      `<${tag}`,
      this.genAttrs(el),
      `>`,
    ].join('');
    const endTag = this.genEndTag(el);
    return [
      startTag,
      childrenStr,
      endTag
    ].join('')
  }

  genAttrs(el = {}) {
    const { attrs = [] } = el;
    const attrsStr =  attrs.map(attr => {
      const { name, value } = attr;

      if (onEventReg.test(name)) {
        return this.genEvent(attr);
      } else if (name === 'r-class') {
        return this.genRClass(attr)
      } else if (name === 'class') {
        return this.genClass(attr)
      } else if (name === 'style') {
        return this.genStyle(attr)
      } else if (name === 'r-style') {
        return this.genRStyle(attr)
      // r-hide -> v-show
      } else if (name === 'r-hide') {
        return this.genRHide(attr)
      // r-show, r-model, r-html
      } else if(normalDirectiveReg.test(name)) {
        return this.genNormalDirective(attr);
      } else {
        if (isBindingValue(value)) {
          return `:${name}="${resolveValue(value)}"`;
        } else if (isBindingExpression(value)) {
          const realValue = resovleAttrExpression(value);
          return `:${name}="${resolveValue(realValue)}"`;
        }
        return `${name}="${value}"`;
      }
    }).join(' ');

    return attrsStr ? ` ${attrsStr}` : '';
  }

  genEvent(attr = {}) {
    const { name, value = '' } = attr;
    const realValue = resolveValue(value).replace(/\(\)/g, '');
    const vueName = name.replace(onEventReg, '')

    return `@${vueName}="${realValue}"`;
  }

  genNormalDirective(attr = {}) {
    const { name, value = '' } = attr;
    const expr = resolveValue(value);
    const vueName = name.replace(/^r/, 'v')
    return `${vueName}="${expr}"`;
  }

  genChildren(el = {}) {
    const { children = [] } = el;
    return this.genElementFromArray(children);
  }

  genElementFromArray(arr) {
    return arr.map(this.genElement.bind(this)).join('');
  }

  genText(el = {}) {
    return el.text;
  }

  genEndTag(el = {}) {
    const { tag } = el
    if (~uncloseTags.indexOf(tag)) {
      return '';
    }
    return `</${tag}>`;
  }

  genExpression(el = {}) {
    const { body } = el
    return `{{${body}}}`
  }

  genIf(el = {}) {
    let depth = 0;
    let res = [];
    let cursor = el;
    let conditionType = 'if'

    while(cursor) {
      const { type, consequent, alternate } = cursor
      if (depth !== 0) {
        conditionType = cursor.type === 'if' ? 'else-if' : 'else'
      }

      if (cursor.type === 'if') {
        res.push(
          this.genIfConsequent(cursor.test, cursor.consequent, conditionType)
        )
      }
      const next = alternate[0];
      if (next && next.type !== 'if') {
        res.push(
          this.genIfConsequent(null, alternate, 'else')
        )
        break;
      }

      cursor = next;
      depth++;
    }
    return res.join('');
  }

  genIfConsequent(test, consequent, type = 'if') {
    const condition = type === 'else' ? 'v-else' : `v-${type}="${stripThisContext(test.body)}"`
    return [
      `<template ${condition}>`,
      this.genElementFromArray(consequent),
      `</template>`
    ].join('');
  }

  genList(el = {}) {
    const { variable, sequence, body } = el;
    const vfor = `v-for="(${variable},${variable+'_index'}) in ${sequence.body}"`;
    return [
      `<template ${vfor}>`,
        this.genElementFromArray(body),
      `</template>`
    ].join('');
  }

  genClass(attr = {}) {
    const { value = '' } = attr;

    if (!OPEN.test(value)) {
      return `class="${value}"`
    }
    const classList = extractExpressionInString(value);
    const vueClassList = classList.map(c => {
      if (OPEN.test(c)) {
        return `\`${stripThisContext(c).replace(/{/g, '${')}\``
      } else {
        return `'${c}'`
      }
    })
    return `:class="[${vueClassList.join(',')}]"`
  }

  genRClass(attr = {}) {
    const { value = '' } = attr;
    const realValue = resolveValue(value);
    const vueValue = realValue;
    return `:class="${vueValue}"`;
  }

  genRStyle(attr = {}) {
    const { value = '' } = attr;
    const realValue = resolveValue(value);
    const vueValue = realValue;
    return `:style="${vueValue}"`;
  }

  genStyle(attr = {}) {
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
  }

  genRHide(attr = {}) {
    const { value = '' } = attr;
    const vueValue = resolveValue(value)
    return `v-show="!(${vueValue})"`
  }

  genTemplate(el = {}) {
    const { content } = el;
    if (/this.\$body/.test(content.body)) {
      return `<slot></slot>`
    }

    return `<p>无法转换 {#inc ${content.body}}, 请手动转换</p>`
  }

  genComment(el = {}) {
    const { value = '' } = el;
    return `<!-- ${value.trim()} -->`
  }
}

module.exports = function genVue(source) {
  const vueGenerator = new VueGenerator(source);
  return vueGenerator.genVue();
}