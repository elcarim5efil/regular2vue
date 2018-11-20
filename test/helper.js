const genVue = require('../src/genVue');

module.exports = {
  assert(source, expected) {
    expect(genVue(source)).toEqual(expected);
  }
}
