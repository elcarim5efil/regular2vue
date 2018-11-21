const { assert } = require('./helper');

describe('list', function() {
  it('should work', () => {
    assert(
      `<div>{#list source as item}<div>{item}</div>{/list}</div>`,
      `<div><template v-for="(item,item_index) in source"><div>{{item}}</div></template></div>`
    )

    assert(
      `<div>{#list source as item}{#list item.list as ele}<div>{ele}</div>{/list}{/list}</div>`,
      `<div><template v-for="(item,item_index) in source"><template v-for="(ele,ele_index) in item.list"><div>{{ele}}</div></template></template></div>`
    )
  })
})