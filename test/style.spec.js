const { assert } = require('./helper');

describe('style & r-style', function() {
  it('static style', () => {
    assert(
      `<div style="width:1px"></div>`,
      `<div style="width:1px"></div>`
    )
  })

  it('binding style', () => {
    assert(
      `<div style="width:{width}px"></div>`,
      `<div :style="[\`width:\${width}px\`]"></div>`
    )
    assert(
      `<div style="width:{this.getWidth()}px"></div>`,
      `<div :style="[\`width:\${getWidth()}px\`]"></div>`
    )
    assert(
      `<div style="width:{width}px;height:10px"></div>`,
      `<div :style="[\`width:\${width}px\`,'height:10px']"></div>`
    )
    assert(
      `<div style="width:{width}px;height:{height}px"></div>`,
      `<div :style="[\`width:\${width}px\`,\`height:\${height}px\`]"></div>`
    )
  })

  it('r-style', () => {
    assert(
      `<div r-style="{{ width: 1 + 'px' }}"></div>`,
      `<div :style="{ width: 1 + 'px' }"></div>`
    )
    assert(
      `<div r-style="{{ width: this.getWidth() }}"></div>`,
      `<div :style="{ width: getWidth() }"></div>`
    )
  })
})