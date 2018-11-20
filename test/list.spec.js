const { assert } = require('./helper');

describe('list', function() {
  it('should work', () => {
    assert(
      `{#list source as item}<div>{item}</div>{/list}`,
      `<template v-for="(item,item_index) in source"><div>{{item}}</div></template>`
    )

    assert(
      `{#list source as item}{#list item.list as ele}<div>{ele}</div>{/list}{/list}`,
      `<template v-for="(item,item_index) in source"><template v-for="(ele,ele_index) in item.list"><div>{{ele}}</div></template></template>`
    )
  })
})