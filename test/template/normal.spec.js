const { assert } = require('./helper');

describe('normal', function() {
  it('binding', () => {
    assert(
      `<input value="{ title }"/>`,
      `<input :value="title">`
    )
  })


  it('binding should work without quotes', () => {
    assert(
      `<input value={title}/>`,
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

  it('unclose tag', () => {
    assert(
      `<input>`,
      `<input>`
    )
    assert(
      `<img src="{url}">`,
      `<img :src="url">`
    )
  })
})