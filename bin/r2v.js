#!/usr/bin/env node

const program = require('commander');
const transformFiles = require('../src/transform-files')
const pkg = require('../package.json')

program
  .version(pkg.version, '-v, --version')
  .parse(process.argv);

const [ source, output ] = program.args

transformFiles(source, output)