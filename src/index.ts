/** AUTO-SUMMARY **
   Purpose: This file serves as a command-line interface (CLI) for the project, allowing users to execute the generator functionality from the terminal.

   Key Components:
   - `Generator`: Class imported from a local module to handle the generation process.

   Functional Overview: The file initializes and runs the `Generator` class, facilitating the execution of generation tasks directly from the command line.

   Dependencies and Integrations: Relies on the `Generator` class from the local project to perform the generation tasks.

   Additional Context: This CLI setup enhances the project's usability and accessibility by providing a user-friendly way to interact with the project's functionalities directly from the command line.
*** END-SUMMARY **/

import { Command } from 'commander';
import { runSummaryGeneration } from './generator/summaryManager.js';
import { pino } from 'pino';

// Logger setup
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

const program = new Command();

program
  .name('readmebot')
  .description('AI-powered README generator for GitHub repositories')
  .version('0.0.0');

program
  .command('generate')
  .description('Generate a README for the current directory')
  .option('-f, --force', 'Force regeneration of summaries')
  .option('-m, --min-lines <number>', 'Minimum lines for file to be summarized', '10')
  .option('-o, --output <file>', 'Output file name', 'README.md')
  .action(async (options) => {
    try {
      logger.info('Starting README generation...');
      await runSummaryGeneration({
        force: options.force,
        minPrependLines: parseInt(options.minLines, 10),
      });
      logger.info('README generation completed successfully!');
    } catch (error) {
      logger.error('Error generating README:', error);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update an existing README')
  .option('-f, --force', 'Force regeneration of summaries')
  .action(async (options) => {
    try {
      logger.info('Starting README update...');
      await runSummaryGeneration({
        force: options.force,
      });
      logger.info('README update completed successfully!');
    } catch (error) {
      logger.error('Error updating README:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
