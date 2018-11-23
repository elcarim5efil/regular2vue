const codegen = require('../../src/template/codegen');

module.exports = {
  assert(source, expected) {
    expect(codegen(source)).toEqual(expected);
  }
}
