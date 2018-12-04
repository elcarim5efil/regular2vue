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
      `<div :style="{'width':\`\${width}px\`}"></div>`
    )
    assert(
      `<div style="width:{this.getWidth()}px"></div>`,
      `<div :style="{'width':\`\${getWidth()}px\`}"></div>`
    )
    assert(
      `<div style="width:{width}px;height:10px"></div>`,
      `<div style="height:10px" :style="{'width':\`\${width}px\`}"></div>`
    )
    assert(
      `<div style="width:{width}px;height:{height}px"></div>`,
      `<div :style="{'width':\`\${width}px\`,'height':\`\${height}px\`}"></div>`
    )
  })

  it('r-style', () => {
    assert(
      `<div r-style="{{ width: 1 + 'px' }}"></div>`,
      `<div :style="{width: 1 + 'px'}"></div>`
    )
    assert(
      `<div r-style="{{ width: this.getWidth() }}"></div>`,
      `<div :style="{width: getWidth()}"></div>`
    )
    assert(
      `<div r-style="{{ width: this.getWidth(), height: height }}"></div>`,
      `<div :style="{width: getWidth(), height: height}"></div>`
    )
  })

  it('should work without quotes', () => {
    assert(
      `<div r-style={{'background':test}}></div>`,
      `<div :style="{'background':test}"></div>`
    )
  })

  it('should combine style and r-style', () => {
    assert(
      `<div style="color:red" r-style={{'background':test}}></div>`,
      `<div style="color:red" :style="{'background':test}"></div>`
    )
    assert(
      `<div style="color:{color}" r-style={{'background':test}}></div>`,
      `<div :style="{'color':\`\${color}\`,'background':test}"></div>`
    )
    assert(
      `<div r-style={{'background':test}} style="color:{color}" ></div>`,
      `<div :style="{'background':test,'color':\`\${color}\`}"></div>`
    )
    assert(
      `<div r-style={{'background':test}} style="color:{color};display:block" ></div>`,
      `<div style="display:block" :style="{'background':test,'color':\`\${color}\`}"></div>`
    )
  })
})