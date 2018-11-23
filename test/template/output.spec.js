const { assert } = require('./helper');

describe('output', function() {
  it('should not wrap with div in single root', () => {
    assert(
      `<div><span></span></div>`,
      `<div><span></span></div>`
    )
    assert(
      `<!-- comment --><div><span></span></div>`,
      `<!-- comment --><div><span></span></div>`
    )
  })

  it('should wrap with div in multiple root', () => {
    assert(
      `<div>1</div><div>2</div>`,
      `<div><div>1</div><div>2</div></div>`
    )
    assert(
      `{#if a}<div>1</div>{#else}<div>2</div>{/if}`,
      `<template v-if=\"a\"><div>1</div></template><template v-else><div>2</div></template>`
    )
    assert(
      `{#list source as item}<div>1</div>{/list}`,
      `<div><template v-for="(item,item_index) in source"><div>1</div></template></div>`
    )
  })
})