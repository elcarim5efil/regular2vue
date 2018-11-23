const { assert } = require('./helper');

describe('class & r-class', function() {
  it('static class', () => {
    assert(
      `<div class="test"></div>`,
      `<div class="test"></div>`
    )
  })

  it('binding class str', () => {
    assert(
      `<div class="test {type}"></div>`,
      `<div :class="['test',\`\${type}\`]"></div>`
    )

    assert(
      `<div class="test {this.getClass()}"></div>`,
      `<div :class="['test',\`\${getClass()}\`]"></div>`
    )

    assert(
      `<div class="test head-{type}"></div>`,
      `<div :class="['test',\`head-\${type}\`]"></div>`
    )

    assert(
      `<div class="test head-{type} {type}-tail"></div>`,
      `<div :class="['test',\`head-\${type}\`,\`\${type}-tail\`]"></div>`
    )
  })

  it('r-class', () => {
    assert(
      `<div r-class="{{test:test}}"></div>`,
      `<div :class="{test:test}"></div>`
    )

    assert(
      `<div r-class="{{'test-class':test}}"></div>`,
      `<div :class="{'test-class':test}"></div>`
    )
  })

  it('should work without quotes', () => {
    assert(
      `<div r-class={{'test-class':test}}></div>`,
      `<div :class="{'test-class':test}"></div>`
    )
  })
})