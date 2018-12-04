const { assert } = require('./helper');

describe('tag', function() {
  it('should not close forbidden close tags', () => {
    assert(
      `<input>`,
      `<input>`
    )
    assert(
      `<br/>`,
      `<br>`
    )
    assert(
      `<br>`,
      `<br>`
    )
    assert(
      `<col>`,
      `<col>`
    )
    assert(
      `<img>`,
      `<img>`
    )
    assert(
      `<meta>`,
      `<meta>`
    )
  })

  it('should convert r-component to component', () => {
    assert(
      `<r-component is="comp"/>`,
      `<component is="comp"></component>`
    )
    assert(
      `<r-component is="{comp}"/>`,
      `<component :is="comp"></component>`
    )
    assert(
      `<r-component is="{getComp()}"/>`,
      `<component :is="getComp()"></component>`
    )
  })
})