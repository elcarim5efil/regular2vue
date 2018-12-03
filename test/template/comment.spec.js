const { assert } = require('./helper');

describe('comment', function() {
  it('should bew reserved', () => {
    assert(
      `<div><!-- i am comment --></div>`,
      `<div><!-- i am comment --></div>`
    )

    assert(
      `<div>{! i am comment !}</div>`,
      `<div></div>`
    )

    assert(
      `<div {! i am comment !}></div>`,
      `<div></div>`
    )
  })
})