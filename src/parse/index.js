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
  // parseExpression(expr){
  //   return this.lex(expr)
  // },
  parseExpression(expr, simple){
    return new Parser( expr, { mode: 2, expression: true } ).expression()
  },
}