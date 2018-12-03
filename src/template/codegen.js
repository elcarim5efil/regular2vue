const { parse } = require('./parse');
const visitors = require('./visitors');
const {
  resolveAttr
} = require('./resolve-helpers');
const {
  stripThisContext,
  isForbiddenCloseTag,
} = require('./helper');

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
    this.visitTag(el)

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
    const attrsStr =  attrs.map(resolveAttr).join(' ');

    return attrsStr ? ` ${attrsStr}` : '';
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
    if (isForbiddenCloseTag(tag)) {
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

  visit(type, key, el) {
    if (!visitors[type]) {
      return
    }

    if (visitors[type].all) {
      visitors[type].all.call(this, el)
    }

    if (visitors[type][key]) {
      visitors[type][key].call(this, el)
    }
  }

  visitTag(el) {
    const { tag } = el;
    this.visit('tag', tag, el);
  }

}

module.exports = function genVue(source) {
  const vueGenerator = new VueGenerator(source);
  return vueGenerator.genVue();
}