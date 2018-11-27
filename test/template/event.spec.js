const { assert } = require('./helper');

describe('event', function() {
  it('methods', () => {
    assert(
      `<div on-click="{ this.onClick() }"></div>`,
      `<div @click="onClick"></div>`
    )

    assert(
      `<div on-click="{this.onClick($event)}"></div>`,
      `<div @click="onClick($event)"></div>`
    )

    assert(
      `<div on-click="{this.onClick(1,2)}"></div>`,
      `<div @click="onClick(1,2)"></div>`
    )
  })

  it('expression', () => {
    assert(
      `<div on-click="{ this.a++ }"></div>`,
      `<div @click="a++"></div>`
    )

    assert(
      `<div on-click="{this.a=this.b+this.c}"></div>`,
      `<div @click="a=b+c"></div>`
    )

    assert(
      `<div on-click={a = false}></div>`,
      `<div @click="a=false"></div>`
    )

    assert(
      `<div on-click={a = b || c}></div>`,
      `<div @click="a=b||c"></div>`
    )
  })

  it('should work without quotes', () => {
    assert(
      `<div on-click={ this.onClick() }></div>`,
      `<div @click="onClick"></div>`
    )
  })
})