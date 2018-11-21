const { assert } = require('./helper');

describe('directive', function() {
  it('r-hide', () => {
    assert(
      `<input r-hide="{ !show }"/>`,
      `<input v-show="!(!show)">`
    )

    assert(
      `<input r-hide="{ this.shouldHide() }"/>`,
      `<input v-show="!(shouldHide())">`
    )
  })

  it('r-show', () => {
    assert(
      `<input r-show="{ show }"/>`,
      `<input v-show="show">`
    )
    assert(
      `<input r-show="{ shouldShow() }"/>`,
      `<input v-show="shouldShow()">`
    )
  })

  it('r-model', () => {
    assert(
      `<input r-model="{ title }"/>`,
      `<input v-model="title">`
    )
  })

  it('r-html', () => {
    assert(
      `<input r-html="{ title }"/>`,
      `<input v-html="title">`
    )
  })

  it('should work without quotes', () => {
    assert(
      `<div r-style={{'background':test}}></div>`,
      `<div :style="{'background':test}"></div>`
    )
  })
})