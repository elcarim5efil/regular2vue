const genVue = require('../src/codegen');

module.exports = {
  assert(source, expected) {
    expect(genVue(source)).toEqual(expected);
  }
}
