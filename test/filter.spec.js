const { assert } = require('./helper');

describe('filter', function() {
  it('should work', () => {
    assert(
      `<div>{text|test}</div>`,
      `<div>{{text|test}}</div>`
    )

    assert(
      `<div>{text|test|test2}</div>`,
      `<div>{{text|test|test2}}</div>`
    )

    assert(
      `<div>{text|test:arg1,arg2}</div>`,
      `<div>{{text|test(arg1,arg2)}}</div>`
    )

    assert(
      `<div>{text|test:arg1,arg2|test2}</div>`,
      `<div>{{text|test(arg1,arg2)|test2}}</div>`
    )
  })
})