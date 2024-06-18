#!/usr/bin/env node

import { Command } from 'commander';
import { Greeter } from '../src/index'; // Adjust the path to where your Greeter class is located

const program = new Command();

program
  .version('1.0.0')
  .argument('<name>', 'Name to greet')
  .action((name) => {
    const greeter = new Greeter(name);
    console.log(greeter.greet());
  });

program.parse(process.argv);
