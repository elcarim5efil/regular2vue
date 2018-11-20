const { assert } = require('./helper');

describe('normal', function() {
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

  it('binding', () => {
    assert(
      `<input value="{ title }"/>`,
      `<input :value="title">`
    )
  })

  it('static', () => {
    assert(
      `<input placeholder="hello"/>`,
      `<input placeholder="hello">`
    )
  })

  it('static', () => {
    assert(
      `<div>{title}</div>`,
      `<div>{{title}}</div>`
    )
  })

  it('binding', () => {
    assert(
      `<div>{title} body {footer}</div>`,
      `<div>{{title}} body {{footer}}</div>`
    )
  })
})