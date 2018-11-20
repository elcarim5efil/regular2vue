const { assert } = require('./helper');

describe('slot', function() {
  it('{#inc this.$body}', () => {
    assert(
      `<div>{#inc this.$body}</div>`,
      `<div><slot></slot></div>`
    )
    assert(
      `<div>{#inc this.$body()}</div>`,
      `<div><slot></slot></div>`
    )
    assert(
      `<div>{#include this.$body()}</div>`,
      `<div><slot></slot></div>`
    )
  })

  it('{#inc this.data.template}', () => {
    assert(
      `<div>{#inc this.data.template}</div>`,
      `<div><p>无法转换 {#inc this.data.template}, 请手动转换</p></div>`
    )
  })
})