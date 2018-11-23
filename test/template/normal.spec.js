const { assert } = require('./helper');

describe('attr', () => {
  it('binding', () => {
    assert(
      `<input value="{ title }"/>`,
      `<input :value="title">`
    )
  })

  it('binding with string concat', () => {
    assert(
      `<input value="head{ a + b }tail"/>`,
      `<input :value="'head'+a+b+'tail'">`
    )

    assert(
      `<input value="{ a }{ b }"/>`,
      `<input :value="a+b">`
    )

    assert(
      `<input value="{ a } + { b }"/>`,
      `<input :value="a+' + '+b">`
    )

    assert(
      `<input value="{ a() } + { b() }"/>`,
      `<input :value="a()+' + '+b()">`
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
})

describe('text', () => {
  it('binding', () => {
    assert(
      `<div>{title} body {footer}</div>`,
      `<div>{{title}} body {{footer}}</div>`
    )
  })

  it('binding without quotes', () => {
    assert(
      `<div>{title}</div>`,
      `<div>{{title}}</div>`
    )
  })
})

describe('tag', () => {
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