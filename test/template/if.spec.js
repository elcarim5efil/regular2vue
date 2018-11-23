const { assert } = require('./helper');

describe('if', function() {
  it('should work', () => {
    assert(
      `{#if a}a{/if}`,
      `<template v-if="a">a</template>`
    )

    assert(
      `{#if this.getCondtion(a, b.c) }a{/if}`,
      `<template v-if="getCondtion(a,b.c)">a</template>`
    )

    assert(
      `{#if a['my-age'] > 100 }a{/if}`,
      `<template v-if="a['my-age']>100">a</template>`
    )

    assert(
      `{#if a}a{#else}b{/if}`,
      `<template v-if="a">a</template><template v-else>b</template>`
    )

    assert(
      `{#if a}a{#elseif b}b{/if}`,
      `<template v-if="a">a</template><template v-else-if="b">b</template>`
    )

    assert(
      `{#if a}a{#elseif b}b{#else}c{/if}`,
      `<template v-if="a">a</template><template v-else-if="b">b</template><template v-else>c</template>`
    )

    assert(
      `{#if a}a{#else}start{#if b}b{/if}end{/if}`,
      `<template v-if="a">a</template><template v-else>start<template v-if="b">b</template>end</template>`
    )

    assert(
      `{#if a}a{#else}{#if b}b{/if}{/if}`,
      `<template v-if="a">a</template><template v-else-if="b">b</template>`
    )

    assert(
      `{#if a}{#if b}b{/if}{#else}c{/if}`,
      `<template v-if="a"><template v-if="b">b</template></template><template v-else>c</template>`
    )
  })
})