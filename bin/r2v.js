#!/usr/bin/env node

const program = require('commander');
const compileFile = require('../src/compile-file')
const pkg = require('../package.json')

program
  .version(pkg.version, '-v, --version')
  .parse(process.argv);

const [ source, output ] = program.args

compileFile(source, output)