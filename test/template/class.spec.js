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
      `<div class="test a {type}"></div>`,
      `<div class="test a" :class="[\`\${type}\`]"></div>`
    )

    assert(
      `<div class="test {this.getClass()}"></div>`,
      `<div class="test" :class="[\`\${getClass()}\`]"></div>`
    )

    assert(
      `<div class="test head-{type}"></div>`,
      `<div class="test" :class="[\`head-\${type}\`]"></div>`
    )

    assert(
      `<div class="test head-{type} {type}-tail"></div>`,
      `<div class="test" :class="[\`head-\${type}\`,\`\${type}-tail\`]"></div>`
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

  it('should work without double quotes', () => {
    assert(
      `<div r-class='{{"u-a-b":!a}}'></div>`,
      `<div :class="{'u-a-b':!a}"></div>`
    )
  })

  it('should combine r-class and class', () => {
    assert(
      `<div class="z-{type}" r-class={{'test-class':test}}></div>`,
      `<div :class="[\`z-\${type}\`,{'test-class':test}]"></div>`
    )
    assert(
      `<div r-class={{'test-class':test}} class="z-{type}"></div>`,
      `<div :class="[{'test-class':test},\`z-\${type}\`]"></div>`
    )
    assert(
      `<div r-class={{'test-class':test}} class="cde z-{type} abc"></div>`,
      `<div class="cde abc" :class="[{'test-class':test},\`z-\${type}\`]"></div>`
    )
    assert(
      `<div r-class={{'test-class':test}} class="cde abc"></div>`,
      `<div class="cde abc" :class="[{'test-class':test}]"></div>`
    )
  })
})