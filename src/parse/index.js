const Parser = require('./parser/Parser');
const Lexer = require('./parser/Lexer');

module.exports = {
  parse(source) {
    return new Parser(source).parse();
  }
}