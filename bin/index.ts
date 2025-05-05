#!/usr/bin/env node
/** AUTO-SUMMARY **
   Purpose: This file serves as a command-line interface (CLI) for the project, allowing users to execute the generator functionality from the terminal.

   Key Components:
   - `Command`: Imported from the 'commander' package to handle CLI commands and options.
   - `Generator`: Imported from the local module to handle the generation process.

   Functional Overview: The file sets up a CLI tool using the 'commander' package, defines the version of the tool, and specifies an action that initializes and runs the `Generator` when the CLI command is executed.

   Dependencies and Integrations: Depends on the 'commander' package for CLI functionality and the `Generator` class from the local project to perform the generation tasks.

   Additional Context: This CLI setup is typically used to provide a user-friendly way to interact with the functionalities of the project directly from the command line, enhancing usability and accessibility.
*** END-SUMMARY **/

import { Command } from 'commander';
import { ProjectGenerator } from '../src/generators/project/project-generator.js';
import { OpenAIProvider } from '../src/providers/ai/openai-provider.js';
import path from 'path';

const program = new Command();

program
  .version('1.0.0')
  .option('-p, --path <path>', 'Path to the project', process.cwd())
  .option('-n, --name <name>', 'Project name', path.basename(process.cwd()))
  .option('-k, --api-key <key>', 'OpenAI API key', process.env.OPENAI_API_KEY)
  .action(async (options) => {
    if (!options.apiKey) {
      console.error('Error: OpenAI API key is required. Set OPENAI_API_KEY environment variable or use --api-key option.');
      process.exit(1);
    }

    console.log('Generating documentation for project:', options.name);
    console.log('Project path:', options.path);
    console.log('Using OpenAI API key:', options.apiKey.slice(0, 10) + '...');

    const aiProvider = new OpenAIProvider({
      apiKey: options.apiKey
    });
    const generator = new ProjectGenerator(aiProvider);
    const config = {
      projectName: options.name,
      projectPath: options.path
    };

    try {
      const docs = await generator.generateDocumentation(config);
      console.log('\nGenerated Documentation:');
      console.log('=====================');
      console.log('\nBusiness Context:');
      console.log(JSON.stringify(docs.businessContext, null, 2));
      console.log('\nTechnical Context:');
      console.log(JSON.stringify(docs.technicalContext, null, 2));
    } catch (error) {
      console.error('Error generating documentation:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
