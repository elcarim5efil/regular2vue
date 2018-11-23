const {
  prettify
} = require('../../src/helper/pretty');

describe('helper/pretty', () => {
  it('should work', () => {
    const content = `<div>{{a}}</div>`;
    const prettified = prettify(content);
    expect(prettified).toBe('<div>{{a}}</div>\n')
  })
})