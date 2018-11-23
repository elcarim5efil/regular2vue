const {
  isRgl,
  transformHtml,
  transformRgl,
} = require('../../src/helper/transform');

describe('helper/transform/isRgl', () => {
  it('should work 1', () => {
    const content = `<div>{{a}}</div>`;
    expect(isRgl(content)).toBeFalsy();
  })

  it('should work 2', () => {
    const content = `<template><div>{{a}}</div></template>`;
    expect(isRgl(content)).toBeFalsy();
  })

  it('should work 3', () => {
    const content = `<template><div>{{a}}</div></template><script>export default{ }</script>`;
    expect(isRgl(content)).toBeTruthy();
  })

  it('should work 4', () => {
    const content = `<template><div>{{a}}</div></template><script>export default{ }</script>`;
    expect(isRgl(content)).toBeTruthy();
  })

  it('should work 5', () => {
    const content = `<template><div>{{a}}</div></template><script>export default{ }</script><style>.main{color:red;}</style>`;
    expect(isRgl(content)).toBeTruthy();
  })
})

describe('helper/transform/transformHtml', () => {
  it('should work', () => {
    const content = `<div>{a}</div>`;
    expect(transformHtml(content)).toEqual({
      raw: `<div>{{a}}</div>`,
      prettified: `<div>{{a}}</div>\n`,
      error: null,
    });
  })

  it('should work with error', () => {
    const content = `<div>{{a}</div>`;
    const res = transformHtml(content);
    expect(res.error).toBeDefined();
    expect(res.raw).toBe('');
    expect(res.prettified).toBe('');
  })
})

describe('helper/transform/transformRgl', () => {
  it('should work', () => {
    const content =
      `<template>` +
        `<div>{a}</div>` +
      `</template>` +
      `<script>export default {}</script>`;

    const res = transformRgl(content);
    expect(res.raw).toEqual(
      `<template>\n` +
        `<div>{{a}}</div>\n` +
      `</template>` +
      `<script>export default {}</script>`,
    );

    expect(res.prettified).toEqual(
      `<template>\n` +
        `<div>{{a}}</div>\n` +
      `</template>` +
      `<script>export default {}</script>`,
    );

    expect(res.error).toBeNull();
  })

  it('should output error with error rgl content', () => {
    const content =
      `<template>` +
        `<div>{{a}</div>` +
      `</template>` +
      `<script>export default {}</script>`;

    const res = transformRgl(content);
    expect(res.raw).toEqual('');

    expect(res.prettified).toEqual('');

    expect(res.error).toBeDefined();
  })

  it('should output error with none rgl content', () => {
    const content = `<div>{a}</div>`;

    const res = transformRgl(content);
    expect(res.raw).toEqual('');

    expect(res.prettified).toEqual('');

    expect(res.error).toBeDefined();
  })
})