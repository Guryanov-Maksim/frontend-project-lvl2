#!/usr/bin/env node

import { program } from 'commander';
import getDifference from '../lib/index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0', '-V, --version', 'output the version number')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const difference = getDifference(filepath1, filepath2);
    console.log(difference);
  });

program.parse();
