#!/usr/bin/env node

import pkg from 'commander';
import getDifference from '../src/index.js';

const { program } = pkg;

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0', '-V, --version', 'output the version number')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2) => {
    const { format } = program.opts();
    const difference = getDifference(filepath1, filepath2, format);
    console.log(difference);
  });

program.parse();
