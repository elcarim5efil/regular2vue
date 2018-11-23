const Parser = require('./parser/Parser');
const Lexer = require('./parser/Lexer');

module.exports = {
  parse(source) {
    return new Parser(source).parse();
  },
  lex(source) {
    const tokens = new Lexer(source, {
       mode: 2,
       expression: true
    }).lex();
    return tokens;
  },
}